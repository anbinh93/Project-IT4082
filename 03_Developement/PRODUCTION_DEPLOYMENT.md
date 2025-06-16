# 🚀 IT4082 Production Deployment Guide

## 📋 Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: Minimum 20GB free space
- **Network**: Stable internet connection
- **Ports**: 80, 443, 5432, 6379 available

### Required Software
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: Latest version
- **SSL Certificate**: For HTTPS (Let's Encrypt recommended)

## 🔧 Pre-deployment Setup

### 1. Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl wget unzip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### 2. Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# For development (optional)
sudo ufw allow 8000/tcp  # Backend API
sudo ufw allow 5173/tcp  # Frontend dev server
```

### 3. Create Application User
```bash
# Create dedicated user for the application
sudo useradd -m -s /bin/bash it4082
sudo usermod -aG docker it4082

# Switch to application user
sudo su - it4082
```

## 📦 Deployment Process

### 1. Clone Repository
```bash
# Clone the project
git clone https://github.com/your-org/it4082-apartment-management.git
cd it4082-apartment-management/03_Developement

# Make scripts executable
chmod +x setup.sh
```

### 2. Environment Configuration
```bash
# Create production environment file
cp server/.env.example server/.env.production

# Edit production configuration
nano server/.env.production
```

**Production Environment Variables:**
```env
# Application
NODE_ENV=production
PORT=8000
APP_NAME="IT4082 Apartment Management"
APP_URL=https://yourdomain.com

# Database (PostgreSQL)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=apartment_management
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password-here

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://yourdomain.com

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=/app/uploads

# Redis (optional)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Logging
LOG_LEVEL=info
LOG_FILE=/app/logs/app.log

# Security Headers
HELMET_ENABLED=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=100
```

### 3. Database Setup
```bash
# Create database directories
sudo mkdir -p /var/lib/postgresql/data
sudo chown -R 999:999 /var/lib/postgresql/data

# Update docker-compose for production
cp docker-compose.yml docker-compose.prod.yml
```

**Production Docker Compose:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: it4082-postgres-prod
    restart: always
    environment:
      POSTGRES_DB: apartment_management
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "127.0.0.1:5432:5432"  # Bind to localhost only
    volumes:
      - /var/lib/postgresql/data:/var/lib/postgresql/data
      - ./database/backup:/backup
    networks:
      - apartment-network

  redis:
    image: redis:7-alpine
    container_name: it4082-redis-prod
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "127.0.0.1:6379:6379"  # Bind to localhost only
    volumes:
      - redis_data:/data
    networks:
      - apartment-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
      target: production
    container_name: it4082-backend-prod
    restart: always
    env_file:
      - ./server/.env.production
    ports:
      - "127.0.0.1:8000:8000"  # Bind to localhost only
    depends_on:
      - postgres
      - redis
    volumes:
      - ./server/uploads:/app/uploads
      - ./server/logs:/app/logs
    networks:
      - apartment-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: it4082-nginx-prod
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./fe/dist:/usr/share/nginx/html:ro
    depends_on:
      - backend
    networks:
      - apartment-network

volumes:
  redis_data:

networks:
  apartment-network:
    driver: bridge
```

### 4. SSL Certificate Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt install -y certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Create SSL directory
mkdir -p nginx/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
sudo chown -R it4082:it4082 nginx/ssl/
```

### 5. Nginx Configuration
```bash
mkdir -p nginx
```

**Create nginx/nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

        # Serve static files
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        # API proxy with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend:8000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login endpoint with stricter rate limiting
        location /api/auth/login {
            limit_req zone=login burst=3 nodelay;
            
            proxy_pass http://backend:8000/api/auth/login;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🚀 Production Deployment

### 1. Build and Deploy
```bash
# Full production setup
./setup.sh setup

# Build production assets
npm run build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
```

### 2. Database Migration and Seeding
```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Seed production data
docker-compose -f docker-compose.prod.yml exec backend npm run seed

# Create admin user
docker-compose -f docker-compose.prod.yml exec backend node scripts/createTestUsers.js
```

### 3. Health Check
```bash
# Check all services
curl -f https://yourdomain.com/api/health

# Check specific endpoints
curl -f https://yourdomain.com/api/auth/health
curl -f https://yourdomain.com/
```

## 📊 Monitoring and Maintenance

### 1. Log Management
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f backend

# View nginx logs
docker-compose -f docker-compose.prod.yml logs -f nginx

# View database logs
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### 2. Database Backup
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres apartment_management > backup_${DATE}.sql
gzip backup_${DATE}.sql
EOF

chmod +x backup.sh

# Add to crontab for daily backups
echo "0 2 * * * /home/it4082/it4082-apartment-management/03_Developement/backup.sh" | crontab -
```

### 3. SSL Certificate Renewal
```bash
# Add renewal to crontab
echo "0 3 * * 0 certbot renew --quiet && docker-compose -f docker-compose.prod.yml restart nginx" | crontab -
```

### 4. System Updates
```bash
# Create update script
cat > update.sh << 'EOF'
#!/bin/bash
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
docker system prune -f
EOF

chmod +x update.sh
```

## 🔒 Security Considerations

### 1. System Hardening
- Use non-root user for application
- Configure firewall properly
- Keep system packages updated
- Use strong passwords
- Enable SSH key authentication
- Disable password authentication

### 2. Application Security
- Use HTTPS everywhere
- Implement rate limiting
- Validate all inputs
- Use secure JWT secrets
- Implement CSRF protection
- Use secure headers

### 3. Database Security
- Use strong database passwords
- Bind database to localhost only
- Regular security updates
- Enable query logging
- Implement backup encryption

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_nhankhau_hoten ON "NhanKhau"(hoTen);
CREATE INDEX CONCURRENTLY idx_hokhau_chuho ON "HoKhau"(chuHo);
CREATE INDEX CONCURRENTLY idx_nopphi_ngaynop ON "NopPhi"(ngaynop);
```

### 2. Caching Strategy
- Use Redis for session storage
- Implement API response caching
- Use CDN for static assets
- Enable browser caching

### 3. Monitoring Tools
- Set up application monitoring
- Monitor database performance
- Track API response times
- Monitor disk space usage

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   docker-compose -f docker-compose.prod.yml ps postgres
   
   # Check database logs
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

2. **SSL Certificate Issues**
   ```bash
   # Verify certificate
   openssl x509 -in nginx/ssl/fullchain.pem -text -noout
   
   # Test SSL
   curl -I https://yourdomain.com
   ```

3. **Application Not Starting**
   ```bash
   # Check backend logs
   docker-compose -f docker-compose.prod.yml logs backend
   
   # Check environment variables
   docker-compose -f docker-compose.prod.yml exec backend env
   ```

### Emergency Recovery
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restore from backup
gunzip backup_YYYYMMDD_HHMMSS.sql.gz
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres apartment_management < backup_YYYYMMDD_HHMMSS.sql

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support Information

- **Documentation**: https://github.com/your-org/it4082-apartment-management/wiki
- **Issues**: https://github.com/your-org/it4082-apartment-management/issues
- **Email**: support@yourdomain.com
- **Team**: IT4082 Development Team

---

**Last Updated**: June 16, 2025  
**Version**: 1.0.0  
**Environment**: Production
