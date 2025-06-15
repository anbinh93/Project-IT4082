# 🏢 Apartment Management System - Deployment Guide

## 📋 Overview
Complete deployment guide for the Apartment Management System with Docker containerization.

## 🚀 Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available
- 10GB+ disk space

### One-Command Deployment
```bash
./deploy.sh
```

## 🐳 Docker Deployment

### 1. Build and Run with Docker Compose
```bash
# Clone and navigate to project
cd /Users/nguyenbinhan/Workspace/Project-IT4082/03_Developement

# Start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health
- **Database**: localhost:5432

### 3. Default Login Credentials
```
Admin Account:
- Username: admin
- Password: admin123
- Role: admin (full access)

Accountant Account:
- Username: accountant
- Password: accountant123
- Role: accountant (fee management)

Manager Account:
- Username: manager
- Password: manager123
- Role: manager (household management)
```

## 🔧 Manual Setup (Alternative)

### Backend Setup
```bash
cd server
npm install
cp ../.env.production .env
npm run migrate
npm run seed
node scripts/createTestUsers.js
npm start
```

### Frontend Setup
```bash
cd fe
npm install
npm run build
npm run preview
```

### Database Setup
```bash
# Using Docker
docker run --name postgres-db \
  -e POSTGRES_DB=department_management \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin \
  -p 5432:5432 \
  -d postgres:15
```

## 📊 Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │────│    Backend      │────│   PostgreSQL    │
│   (React App)   │    │  (Express API)  │    │   (Database)    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Security Configuration

### Production Environment Variables
```bash
# Copy and modify for production
cp .env.production .env

# Update the following for production:
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_super_secure_jwt_secret_key_for_production_2025
CORS_ORIGIN=https://your-domain.com
```

### Security Features
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ CORS protection
- ✅ Security headers
- ✅ SQL injection prevention
- ✅ XSS protection

## 📈 Monitoring & Health Checks

### Health Check Endpoints
```bash
# Backend health
curl http://localhost:8000/api/health

# API status
curl http://localhost:8000/api

# Database connection test
curl http://localhost:8000/api/statistics
```

### Docker Health Checks
```bash
# Check container health
docker-compose ps

# View service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill processes using ports
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
sudo lsof -ti:5432 | xargs kill -9
```

#### 2. Database Connection Issues
```bash
# Restart database service
docker-compose restart postgres

# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up postgres -d
./setup-db.sh
```

#### 3. Build Failures
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

#### 4. Frontend Not Loading
```bash
# Check nginx logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend --no-cache
docker-compose up frontend -d
```

### Log Locations
- **Backend**: `docker-compose logs backend`
- **Frontend**: `docker-compose logs frontend`
- **Database**: `docker-compose logs postgres`

## 🔄 Maintenance Commands

### Backup Database
```bash
docker exec -t postgres-container pg_dump -U postgres department_management > backup.sql
```

### Restore Database
```bash
docker exec -i postgres-container psql -U postgres -d department_management < backup.sql
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Scale Services
```bash
# Scale backend (if using load balancer)
docker-compose up --scale backend=3 -d
```

## 📱 Production Deployment

### Cloud Deployment (AWS/GCP/Azure)
1. Set up container registry
2. Push images to registry
3. Configure environment variables
4. Set up load balancer
5. Configure SSL certificates
6. Set up monitoring

### Environment-Specific Configurations
```bash
# Development
NODE_ENV=development

# Staging
NODE_ENV=staging

# Production
NODE_ENV=production
```

## 📞 Support

### API Documentation
- **Base URL**: http://localhost:8000/api
- **Authentication**: JWT Bearer token
- **Documentation**: Available in `/server/docs/`

### System Status
- All core features implemented and tested
- Production-ready with Docker containerization
- Scalable architecture
- Comprehensive error handling

### Contact
For deployment issues or questions, refer to the project documentation or system administrator.

---

## 🎉 Success Checklist

- [ ] Docker services running (`docker-compose ps`)
- [ ] Frontend accessible (http://localhost:3000)
- [ ] Backend API responding (http://localhost:8000/api/health)
- [ ] Database connected and seeded
- [ ] Admin login working
- [ ] All main features functional

**🎊 Your Apartment Management System is now ready for production use!**
