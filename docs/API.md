# API Documentation

## Overview

The Folder Metadata Generator provides a RESTful API for analyzing folder structures and generating detailed metadata for individual files using AI.

## Base URL

```
http://localhost:5000/api
```

## Authentication

No authentication is required for local development. The application uses your Groq API key configured in the `.env` file.

## Endpoints

### Generate Metadata

Generate comprehensive metadata with individual file analysis for a folder structure.

**Endpoint:** `POST /generate`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "tree": {
    "name": "/",
    "type": "folder",
    "children": [
      {
        "name": "src",
        "type": "folder",
        "children": [
          {
            "name": "app.py",
            "type": "file",
            "size": 1024
          }
        ]
      }
    ]
  },
  "hint": "Optional hint for AI analysis",
  "customPrompt": "Focus on security-related files and configuration"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tree` | Object | Yes | Folder structure object |
| `hint` | String | No | Optional hint to guide analysis |
| `customPrompt` | String | No | Custom prompt to guide AI analysis with specific focus |

**Tree Object Structure:**
```json
{
  "name": "folder_name",
  "type": "folder|file",
  "children": [...],  // Only for folders
  "size": 1024       // Only for files
}
```

**Success Response (200 OK):**
```json
{
  "title": "Flask Web Application",
  "files": [
    {
      "filename": "app.py",
      "description": "Main Flask application file containing the web server setup, API endpoints, and AI integration for metadata generation.",
      "tags": ["python", "flask", "backend", "api", "web-server"]
    },
    {
      "filename": "requirements.txt",
      "description": "Python package dependencies file listing all required libraries for the Flask application including Flask, python-dotenv, and groq.",
      "tags": ["dependencies", "python", "pip", "packages", "requirements"]
    },
    {
      "filename": "README.md",
      "description": "Project documentation file containing setup instructions, usage guidelines, and feature descriptions for the folder metadata generator.",
      "tags": ["documentation", "markdown", "readme", "instructions", "guide"]
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing folder tree"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "AI returned empty response"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Short, descriptive title for the folder |
| `files` | Array[Object] | Array of file analysis objects |
| `files[].filename` | String | Name of the analyzed file |
| `files[].description` | String | Detailed description (2-3 sentences) of the file's purpose and content |
| `files[].tags` | Array[String] | Relevant keywords and tags for the file |

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Missing required parameters
- **500 Internal Server Error**: AI processing errors, network issues, or invalid API responses

All errors return a JSON object with an `error` field containing a descriptive message.

## Rate Limiting

No rate limiting is implemented in the local development version. In production, consider implementing rate limiting based on your Groq API limits.

## Examples

### Python Example
```python
import requests
import json

url = "http://localhost:5000/api/generate"
data = {
    "tree": {
        "name": "/",
        "type": "folder",
        "children": [
            {
                "name": "README.md",
                "type": "file",
                "size": 2048
            },
            {
                "name": "src",
                "type": "folder",
                "children": [
                    {
                        "name": "main.py",
                        "type": "file",
                        "size": 1024
                    }
                ]
            }
        ]
    },
    "hint": "Python project",
    "customPrompt": "Focus on identifying the main application files and configuration"
}

response = requests.post(url, json=data)
result = response.json()
print(json.dumps(result, indent=2))

# Expected output format:
# {
#   "title": "Python Project",
#   "files": [
#     {
#       "filename": "README.md",
#       "description": "Project documentation with setup and usage instructions.",
#       "tags": ["documentation", "markdown", "readme"]
#     },
#     {
#       "filename": "main.py", 
#       "description": "Main Python script containing the core application logic.",
#       "tags": ["python", "main", "script", "application"]
#     }
#   ]
# }
```

### JavaScript Example
```javascript
const data = {
  tree: {
    name: "/",
    type: "folder",
    children: [
      {
        name: "package.json",
        type: "file",
        size: 512
      },
      {
        name: "src",
        type: "folder",
        children: [
          {
            name: "index.js",
            type: "file",
            size: 1024
          }
        ]
      }
    ]
  },
  hint: "Node.js project"
};

fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
  console.log(result);
  // Process individual file data
  result.files.forEach(file => {
    console.log(`${file.filename}: ${file.description}`);
    console.log(`Tags: ${file.tags.join(', ')}`);
  });
});
```

### cURL Example
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tree": {
      "name": "/",
      "type": "folder",
      "children": [
        {
          "name": "index.html",
          "type": "file",
          "size": 2048
        },
        {
          "name": "style.css",
          "type": "file",
          "size": 1024
        }
      ]
    },
    "hint": "Web project",
    "customPrompt": "Focus on frontend architecture and styling approach"
  }'
```

## Best Practices

1. **Folder Structure**: Ensure the tree object accurately represents your folder structure
2. **Hints**: Use the optional hint parameter to provide context for better analysis
3. **Error Handling**: Always handle both success and error responses
4. **File Processing**: Process the `files` array to access individual file metadata
5. **Export Integration**: Use the structured response for Excel, PDF, or JSON exports
6. **Timeouts**: Set appropriate timeouts (5-10 seconds) as AI processing can take time

## Limitations

- Maximum folder depth: No explicit limit, but very deep structures may affect performance  
- File analysis: Currently analyzes file names and extensions, not file content
- Individual files: Generates analysis for each file, which may increase processing time for large folders
- Language support: Optimized for English, but may work with other languages
- API dependencies: Requires active Groq API key and internet connection
