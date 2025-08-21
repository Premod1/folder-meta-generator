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

    if not tree:
        return jsonify({"error": "Missing folder tree"}), 400

    system_msg = """You are an assistant that generates concise metadata for a folder based only on its folder and file names. 

Requirements:
1. Return ONLY a valid JSON object with these keys:
   {
     "title": "short title summarizing the folder",
     "description": "detailed description (4-6 sentences) explaining what files and folders are inside, their purpose, and organization",
     "tags": ["array","of","short","keywords","from","folder"]
   }
2. Do NOT include any extra text, markdown, or explanations.
3. Focus entirely on the names of the folders and files in the structure provided.
4. Make the description comprehensive - mention specific file types, folder organization, and infer the project's purpose from the structure."""

    user_msg = f"Folder tree JSON:\n{json.dumps(tree, indent=2)}\n\nHint: {hint}"

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
            # Validate required keys
            if not all(key in parsed_json for key in ['title', 'description', 'tags']):
                return jsonify({
                    "title": "Generated Folder",
                    "description": "Metadata could not be generated properly.",
                    "tags": ["folder"]
                })
            return jsonify(parsed_json)
        except json.JSONDecodeError as json_error:
            print(f"JSON decode error: {json_error}")
            print(f"Content that failed to parse: {repr(content)}")
            # Return a fallback response
            return jsonify({
                "title": "Generated Folder",
                "description": f"AI response: {content[:100]}..." if len(content) > 100 else content,
                "tags": ["folder", "generated"]
            })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
