# Folder Metadata Generator

A professional AI-powered web application that analyzes folder structures and generates comprehensive metadata including titles, descriptions, and tags. Built with Flask and modern JavaScript, featuring a sleek UI and professional PDF export capabilities.

![Folder Metadata Generator](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8%2B-brightgreen.svg)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-red.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🚀 Features

### Core Functionality
- **AI-Powered Analysis**: Uses Groq's language models for intelligent folder structure analysis
- **Professional UI**: Modern, responsive design with gradient backgrounds and glass-morphism effects
- **Multi-Format Export**: Export results as JSON or professionally formatted PDF documents
- **Real-time Processing**: Instant analysis with loading states and progress indicators
- **Error Handling**: Robust error management with user-friendly feedback

### Technical Features
- **Modular Architecture**: Clean, separated JavaScript modules for maintainability
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional PDF Generation**: Corporate-style reports with proper formatting
- **RESTful API**: Clean backend API for metadata generation
- **Environment Configuration**: Secure API key management with .env files

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js (optional, for development tools)
- Groq API key ([Get one here](https://groq.com/))

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Premod1/folder-meta-generator.git
cd folder-meta-generator
```

### 2. Set Up Python Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### 4. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
folder-meta-generator/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (create this)
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
├── docs/                      # Documentation
│   ├── API.md                 # API documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── DEVELOPMENT.md         # Development guide
├── static/                    # Static assets
│   ├── app.js                 # Main application logic
│   ├── tree-builder.js        # Folder tree building
│   ├── ui-helpers.js          # UI state management
│   ├── api-client.js          # Backend API communication
│   ├── pdf-generator.js       # PDF generation
│   └── export-handler.js      # Export functionality
└── templates/
    └── index.html             # Main HTML template
```

## 🎯 Usage

### Basic Usage
1. Open the application in your web browser
2. Click "Choose Folder" and select a folder to analyze
3. Click "Generate Metadata" to start the AI analysis
4. View the results in the analysis section
5. Export as JSON or PDF as needed

### API Usage
You can also use the API directly:

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tree": {
      "name": "/",
      "type": "folder",
      "children": [...]
    }
  }'
```

## 🔧 Configuration

### Environment Variables
- `GROQ_API_KEY`: Your Groq API key (required)
- `GROQ_MODEL`: The Groq model to use (default: llama-3.1-8b-instant)

### Customization
- **UI Styling**: Modify `templates/index.html` for design changes
- **AI Prompts**: Update the system message in `app.py` for different analysis styles
- **PDF Layout**: Customize `static/pdf-generator.js` for different PDF formats

## 📊 API Reference

### Generate Metadata
**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "tree": {
    "name": "/",
    "type": "folder",
    "children": [...]
  },
  "hint": "Optional hint for analysis"
}
```

**Response:**
```json
{
  "title": "Project Title",
  "description": "Detailed description of the folder contents...",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## 🚀 Deployment

### Production Deployment
1. Set up a production WSGI server (e.g., Gunicorn)
2. Configure a reverse proxy (e.g., Nginx)
3. Set up SSL certificates
4. Configure environment variables securely

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Development

### Running in Development Mode
```bash
export FLASK_ENV=development
python app.py
```

### Code Structure
- **Backend**: Flask application with RESTful API
- **Frontend**: Vanilla JavaScript with modular architecture
- **Styling**: CSS3 with modern features (gradients, backdrop-filter, etc.)

### Adding Features
1. Backend changes: Modify `app.py`
2. Frontend logic: Add to appropriate module in `static/`
3. UI changes: Update `templates/index.html`

## 🔍 Troubleshooting

### Common Issues

**API Key Errors**
- Ensure your Groq API key is valid and properly set in `.env`
- Check that the API key has sufficient credits

**JSON Parsing Errors**
- The application includes robust error handling for AI responses
- Check the console for detailed error messages

**File Upload Issues**
- Ensure the folder contains files (empty folders may cause issues)
- Check browser compatibility for `webkitdirectory` attribute

## 📈 Performance

- **Response Time**: Typically 2-5 seconds depending on folder complexity
- **File Limits**: No hard limits, but very large folders may take longer
- **Browser Support**: Modern browsers with ES6 support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Pramod Suraweera**
- Website: [https://premod.me/](https://premod.me/)
- GitHub: [@Premod1](https://github.com/Premod1)

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for providing the AI language model API
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [Font Awesome](https://fontawesome.com/) for icons

## 📞 Support

If you encounter any issues or have questions:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [documentation](docs/)
3. Open an issue on GitHub
4. Visit [https://premod.me/](https://premod.me/) for contact information

---

Made with ❤️ by [Pramod Suraweera](https://premod.me/)
