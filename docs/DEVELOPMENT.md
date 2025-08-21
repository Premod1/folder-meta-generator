# Development Guide

## Getting Started

This guide will help you set up the development environment and understand the codebase structure.

## Development Environment Setup

### Prerequisites
- Python 3.8+
- Git
- Text editor or IDE (VS Code recommended)
- Web browser with developer tools

### Initial Setup

1. **Clone and Setup**
```bash
git clone https://github.com/Premod1/folder-meta-generator.git
cd folder-meta-generator
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Environment Configuration**
```bash
cp .env.example .env  # Create from template
# Edit .env with your Groq API key
```

3. **Run Development Server**
```bash
export FLASK_ENV=development  # On Windows: set FLASK_ENV=development
python app.py
```

## Architecture Overview

### Backend (Flask)
- **app.py**: Main Flask application with API endpoints
- **Environment-based configuration**: Uses python-dotenv for config management
- **AI Integration**: Groq API for metadata generation
- **Error Handling**: Comprehensive error handling with fallbacks

### Frontend (JavaScript)
Modular architecture with separated concerns:

- **app.js**: Main orchestrator, handles user interactions
- **tree-builder.js**: Converts file lists to tree structures
- **ui-helpers.js**: UI state management and feedback
- **api-client.js**: Backend communication
- **pdf-generator.js**: PDF document generation
- **export-handler.js**: Export functionality coordination

### Styling
- **CSS3 with modern features**: Gradients, backdrop-filter, flexbox, grid
- **Responsive design**: Mobile-first approach
- **Professional UI**: Glass-morphism effects, smooth animations

## Code Organization

### File Structure Explained
```
folder-meta-generator/
├── app.py                 # Flask app, API endpoints, AI integration
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore patterns
├── requirements.txt      # Python dependencies
├── static/               # Client-side assets
│   ├── app.js            # Main app logic, event handling
│   ├── tree-builder.js   # File tree construction
│   ├── ui-helpers.js     # UI state, loading, errors
│   ├── api-client.js     # HTTP requests to backend
│   ├── pdf-generator.js  # PDF creation and formatting
│   └── export-handler.js # Export coordination
├── templates/
│   └── index.html        # Main HTML template, styling
└── docs/                 # Documentation
```

### Key Components

#### Backend (app.py)
```python
# Main sections:
1. Configuration and imports
2. Flask app setup
3. Routes:
   - GET / : Serve main page
   - POST /api/generate : Generate metadata
4. Error handling and JSON processing
```

#### Frontend Modules

**tree-builder.js**
- Converts browser FileList to hierarchical tree
- Handles file paths and directory structure
- Pure functions, no side effects

**ui-helpers.js**
- Loading states and animations
- Error and success message display
- Button state management
- UI feedback functions

**api-client.js**
- HTTP communication with backend
- Request/response handling
- Error parsing and propagation

**pdf-generator.js**
- Professional PDF document creation
- Layout and styling
- Corporate formatting

## Development Workflow

### Making Changes

1. **Backend Changes**
   - Modify `app.py` for API changes
   - Test with curl or Postman
   - Restart Flask server

2. **Frontend Changes**
   - Modify appropriate JS module
   - Test in browser
   - No build step required (vanilla JS)

3. **UI Changes**
   - Modify `templates/index.html`
   - Refresh browser
   - Test responsive design

### Testing

#### Manual Testing
```bash
# Start development server
python app.py

# Test API directly
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"tree": {"name": "/", "type": "folder", "children": []}}'
```

#### Browser Testing
1. Open http://localhost:5000
2. Test folder selection
3. Test metadata generation
4. Test export functionality
5. Test responsive design

### Debugging

#### Backend Debugging
- Check terminal output for Flask logs
- Add `print()` statements in `app.py`
- Check `.env` file configuration
- Verify Groq API key and model

#### Frontend Debugging
- Use browser developer tools
- Check console for JavaScript errors
- Use Network tab for API requests
- Check console.log() outputs

## Code Style Guidelines

### Python (Backend)
- Follow PEP 8 style guide
- Use descriptive variable names
- Add comments for complex logic
- Handle errors gracefully

### JavaScript (Frontend)
- Use ES6+ features
- Consistent function naming (camelCase)
- Modular architecture
- Error handling in all async functions

### HTML/CSS
- Semantic HTML elements
- Mobile-first responsive design
- Consistent spacing and naming
- Modern CSS features

## Adding New Features

### New AI Analysis Features
1. Modify system prompt in `app.py`
2. Update response processing if needed
3. Test with various folder structures

### New Export Formats
1. Create new module in `static/`
2. Add export function
3. Update UI buttons and handlers
4. Test export functionality

### UI Enhancements
1. Update `templates/index.html`
2. Add CSS styles
3. Update JavaScript interactions
4. Test across devices

## Performance Considerations

### Backend
- AI API calls can take 2-10 seconds
- Implement proper timeout handling
- Consider caching for repeated requests

### Frontend
- Minimize DOM manipulations
- Use efficient event handling
- Optimize PDF generation for large data

### Network
- Handle slow AI API responses
- Provide loading feedback
- Implement request timeout

## Security Considerations

### API Keys
- Never commit API keys to git
- Use environment variables
- Validate API responses

### Input Validation
- Sanitize file paths
- Validate tree structure
- Handle malicious input

### CORS and Headers
- Configure appropriate CORS settings
- Set security headers
- Validate content types

## Deployment Preparation

### Environment Variables
```bash
# Production environment
GROQ_API_KEY=your_production_key
GROQ_MODEL=llama-3.1-8b-instant
FLASK_ENV=production
```

### Production Considerations
- Use WSGI server (Gunicorn)
- Set up reverse proxy (Nginx)
- Configure SSL certificates
- Set up monitoring and logging

## Common Issues

### API Key Issues
- Verify key in `.env` file
- Check Groq dashboard for usage limits
- Ensure proper environment loading

### JSON Parsing Errors
- Check AI response format
- Verify error handling in `app.py`
- Test with different folder structures

### Frontend Errors
- Check browser console
- Verify all JS modules load
- Test file input compatibility

## Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Follow code style guidelines**
4. **Test thoroughly**
5. **Submit pull request**

### Pull Request Guidelines
- Clear description of changes
- Include testing steps
- Update documentation if needed
- Follow existing code patterns

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Groq API Documentation](https://console.groq.com/docs)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [MDN Web Docs](https://developer.mozilla.org/)

## Getting Help

- Check existing issues on GitHub
- Read the documentation thoroughly
- Test with minimal examples
- Provide detailed error information when asking for help
