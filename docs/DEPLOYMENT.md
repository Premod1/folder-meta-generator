# Deployment Guide

## Overview

This guide covers deploying the Folder Metadata Generator to various production environments.

## Deployment Options

1. **Local/Development Server**: Simple Flask development server
2. **Production Server**: Gunicorn + Nginx setup
3. **Cloud Platforms**: Heroku, AWS, Google Cloud, etc.
4. **Container Deployment**: Docker-based deployment

## Prerequisites

- Python 3.8+
- Valid Groq API key
- Web server (Nginx recommended for production)
- SSL certificates (for HTTPS)

## Production Server Deployment

### 1. Server Setup

**Update System**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv nginx -y
```

**Create Application User**
```bash
sudo adduser --system --group foldergen
sudo mkdir -p /var/www/foldergen
sudo chown foldergen:foldergen /var/www/foldergen
```

### 2. Application Setup

**Deploy Application**
```bash
sudo -u foldergen -i
cd /var/www/foldergen
git clone https://github.com/Premod1/folder-meta-generator.git .
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

**Environment Configuration**
```bash
sudo -u foldergen nano /var/www/foldergen/.env
```

```env
GROQ_API_KEY=your_production_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
FLASK_ENV=production
```

### 3. Gunicorn Configuration

**Create Gunicorn Service File**
```bash
sudo nano /etc/systemd/system/foldergen.service
```

```ini
[Unit]
Description=Folder Metadata Generator
After=network.target

[Service]
User=foldergen
Group=foldergen
WorkingDirectory=/var/www/foldergen
Environment=PATH=/var/www/foldergen/venv/bin
ExecStart=/var/www/foldergen/venv/bin/gunicorn --bind 127.0.0.1:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

**Enable and Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable foldergen
sudo systemctl start foldergen
sudo systemctl status foldergen
```

### 4. Nginx Configuration

**Create Nginx Site Configuration**
```bash
sudo nano /etc/nginx/sites-available/foldergen
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/foldergen/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/foldergen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate Setup

**Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Obtain SSL Certificate**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "app:app"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - GROQ_MODEL=llama-3.1-8b-instant
      - FLASK_ENV=production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./static:/var/www/static:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
```

### 3. Deploy with Docker

```bash
# Create .env file with your API key
echo "GROQ_API_KEY=your_api_key" > .env

# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

## Cloud Platform Deployment

### Heroku Deployment

**1. Create Heroku App**
```bash
heroku create your-app-name
```

**2. Set Environment Variables**
```bash
heroku config:set GROQ_API_KEY=your_api_key
heroku config:set GROQ_MODEL=llama-3.1-8b-instant
```

**3. Create Procfile**
```
web: gunicorn app:app
```

**4. Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### AWS EC2 Deployment

**1. Launch EC2 Instance**
- Choose Ubuntu 20.04 LTS
- Configure security groups (HTTP, HTTPS, SSH)
- Launch with your key pair

**2. Connect and Setup**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```
Follow the production server setup steps above.

**3. Configure Security Groups**
- Allow HTTP (port 80)
- Allow HTTPS (port 443)
- Allow SSH (port 22) from your IP

## Environment Configuration

### Production Environment Variables

```env
# Required
GROQ_API_KEY=your_production_api_key

# Optional
GROQ_MODEL=llama-3.1-8b-instant
FLASK_ENV=production
PORT=8000
WORKERS=2
```

### Security Considerations

**API Key Security**
- Use environment variables, never hardcode
- Rotate API keys regularly
- Monitor API usage and limits

**Server Security**
- Keep system packages updated
- Use SSL certificates
- Configure firewall (ufw)
- Regular security audits

**Application Security**
- Validate all inputs
- Implement rate limiting
- Monitor logs for suspicious activity

## Monitoring and Logging

### Application Logs
```bash
# Gunicorn logs
sudo journalctl -u foldergen -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Performance Monitoring
```bash
# Monitor system resources
htop
df -h
free -m

# Monitor application performance
sudo systemctl status foldergen
```

### Log Rotation
```bash
sudo nano /etc/logrotate.d/foldergen
```

```
/var/log/foldergen/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 foldergen foldergen
}
```

## Performance Optimization

### Gunicorn Configuration
```bash
# /var/www/foldergen/gunicorn.conf.py
bind = "127.0.0.1:8000"
workers = 2  # 2 * CPU cores
worker_class = "sync"
timeout = 30
keepalive = 5
max_requests = 1000
max_requests_jitter = 100
```

### Nginx Optimization
```nginx
# Add to nginx configuration
gzip on;
gzip_types text/plain text/css application/json application/javascript;
client_max_body_size 10M;
```

### Caching
```nginx
# Static file caching
location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Backup and Recovery

### Application Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/foldergen_$DATE.tar.gz /var/www/foldergen/
```

### Database/Configuration Backup
```bash
# Backup environment and configuration
cp /var/www/foldergen/.env /backups/.env_$DATE
cp /etc/nginx/sites-available/foldergen /backups/nginx_$DATE.conf
```

## Troubleshooting

### Common Issues

**Service Won't Start**
```bash
sudo systemctl status foldergen
sudo journalctl -u foldergen --no-pager
```

**Nginx Errors**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**SSL Certificate Issues**
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

**API Connection Issues**
- Check API key validity
- Verify network connectivity
- Monitor API rate limits

### Health Checks

**Application Health**
```bash
curl http://localhost:8000/
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"tree":{"name":"/","type":"folder","children":[]}}'
```

**System Health**
```bash
systemctl is-active foldergen
systemctl is-active nginx
df -h
free -m
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple application instances
- Share static files via CDN

### Vertical Scaling
- Increase server resources
- Optimize Gunicorn worker count
- Monitor resource usage

### Database Considerations
- Currently stateless (no database)
- Consider Redis for session storage if needed
- Monitor API usage and caching

## Maintenance

### Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update application
sudo -u foldergen -i
cd /var/www/foldergen
git pull
source venv/bin/activate
pip install -r requirements.txt --upgrade
sudo systemctl restart foldergen
```

### SSL Certificate Renewal
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Log Cleanup
```bash
sudo journalctl --vacuum-time=30d
sudo logrotate -f /etc/logrotate.d/foldergen
```
