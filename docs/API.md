# API Documentation

## Overview

The Folder Metadata Generator provides a RESTful API for analyzing folder structures and generating metadata using AI.

## Base URL

```
http://localhost:5000/api
```

## Authentication

No authentication is required for local development. The application uses your Groq API key configured in the `.env` file.

## Endpoints

### Generate Metadata

Generate comprehensive metadata for a folder structure.

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
  "hint": "Optional hint for AI analysis"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tree` | Object | Yes | Folder structure object |
| `hint` | String | No | Optional hint to guide analysis |

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
  "description": "This folder contains a Flask web application with a main application file (app.py) in the src directory. The structure suggests a simple web service or API implementation using Python's Flask framework. The project appears to be organized with source code separated into a dedicated src folder, following common Python project conventions.",
  "tags": ["flask", "python", "web-application", "api", "backend"]
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
| `description` | String | Detailed description (4-6 sentences) of the folder contents |
| `tags` | Array[String] | Relevant keywords and tags |

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
    "hint": "Python project"
}

response = requests.post(url, json=data)
result = response.json()
print(json.dumps(result, indent=2))
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
.then(result => console.log(result));
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
    "hint": "Web project"
  }'
```

## Best Practices

1. **Folder Structure**: Ensure the tree object accurately represents your folder structure
2. **Hints**: Use the optional hint parameter to provide context for better analysis
3. **Error Handling**: Always handle both success and error responses
4. **File Sizes**: Include file sizes when available for more accurate analysis
5. **Timeouts**: Set appropriate timeouts (5-10 seconds) as AI processing can take time

## Limitations

- Maximum folder depth: No explicit limit, but very deep structures may affect performance
- File size analysis: Currently only considers file names and sizes, not content
- Language support: Optimized for English, but may work with other languages
- API dependencies: Requires active Groq API key and internet connection
