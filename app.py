import os
import json
from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
from groq import Groq   # ✅ use Groq client instead of OpenAI

load_dotenv()

app = Flask(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))   # ✅ set GROQ_API_KEY in .env
MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")  # ✅ default Groq model


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.json
    tree = data.get("tree")
    hint = data.get("hint", "")
    custom_prompt = data.get("customPrompt", "")

    if not tree:
        return jsonify({"error": "Missing folder tree"}), 400

    # Base system message
    system_msg = """You are an assistant that generates metadata for individual files in a folder based on their file names and folder context.

Requirements:
1. Return ONLY a valid JSON object with these keys:
   {
     "title": "short title summarizing the folder",
     "files": [
        {
          "filename": "file1.jpg",
          "description": "2-3 sentences describing file1.jpg",
          "tags": ["keywords","related","to","file1"]
        },
        {
          "filename": "file2.png", 
          "description": "2-3 sentences describing file2.png",
          "tags": ["keywords","related","to","file2"]
        }
     ]
   }
2. Do NOT include any extra text, markdown, or explanations.
3. Generate one entry in the "files" array for each file in the provided list.
4. Infer the file's purpose and content from its filename, extension, and folder context."""

    # Add custom prompt if provided
    if custom_prompt:
        system_msg += f"\n\n5. IMPORTANT: Follow this additional guidance: {custom_prompt}"

    # Extract just the file list from the tree
    file_list = []
    def extract_files(node, path=""):
        if node.get("type") == "file":
            full_path = f"{path}/{node['name']}" if path else node['name']
            file_list.append(full_path)
        elif node.get("type") == "folder" and "children" in node:
            current_path = f"{path}/{node['name']}" if path else node['name']
            for child in node["children"]:
                extract_files(child, current_path)
    
    extract_files(tree)
    
    # Construct user message with hint and custom prompt
    user_msg = f"File list:\n{json.dumps(file_list, indent=2)}"
    
    if hint:
        user_msg += f"\n\nHint: {hint}"
    
    if custom_prompt:
        user_msg += f"\n\nCustom Analysis Instructions: {custom_prompt}"

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
        )
        content = completion.choices[0].message.content.strip()
        print("DEBUG AI raw output:", repr(content))
        
        # Handle empty or None content
        if not content:
            return jsonify({"error": "AI returned empty response"}), 500
            
        # Try to extract JSON from markdown code blocks if present
        if content.startswith("```"):
            lines = content.split('\n')
            json_lines = []
            in_json = False
            for line in lines:
                if line.strip().startswith("```") and not in_json:
                    in_json = True
                    continue
                elif line.strip().startswith("```") and in_json:
                    break
                elif in_json:
                    json_lines.append(line)
            content = '\n'.join(json_lines).strip()
            
        # Try to find JSON within the response if it contains other text
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            content = content[start_idx:end_idx + 1]
        
        try:
            parsed_json = json.loads(content)
            # Validate required keys for the new format
            if not all(key in parsed_json for key in ['title', 'files']):
                return jsonify({
                    "title": "Generated Folder",
                    "files": [
                        {
                            "filename": "unknown_file",
                            "description": "Metadata could not be generated properly.",
                            "tags": ["unknown"]
                        }
                    ]
                })
            return jsonify(parsed_json)
        except json.JSONDecodeError as json_error:
            print(f"JSON decode error: {json_error}")
            print(f"Content that failed to parse: {repr(content)}")
            # Return a fallback response with the new format
            return jsonify({
                "title": "Generated Folder",
                "files": [
                    {
                        "filename": "error_file",
                        "description": f"AI response: {content[:100]}..." if len(content) > 100 else content,
                        "tags": ["folder", "generated"]
                    }
                ]
            })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
