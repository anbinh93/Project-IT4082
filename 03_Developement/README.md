# 🏢 IT4082 Apartment Management System

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-org/it4082-apartment-management)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)

A comprehensive apartment management system built for IT4082 project. This system provides complete functionality for managing apartments, residents, households, fees, payments, and facilities.

## 📖 Documentation

- **[⚡ Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[📖 Complete Installation Guide](./INSTALLATION_GUIDE.md)** - Detailed setup instructions
- **[🚀 Production Deployment](./PRODUCTION_DEPLOYMENT.md)** - Production deployment guide
- **[✅ Setup Completion Report](./SETUP_COMPLETION_REPORT.md)** - System status and features

## 🌟 Features

### 🏠 **Core Management**
- **Resident Management**: Complete CRUD operations for residents with personal information
- **Household Management**: Household registration, member management, and head assignment
- **Apartment Management**: Room/apartment allocation and management
- **Vehicle Management**: Vehicle registration and parking management

### 💰 **Financial Management**
- **Fee Collection**: Flexible fee types and collection periods
- **Payment Tracking**: Complete payment history and status tracking
- **Fee Calculation**: Automatic fee calculation based on apartment/household
- **Financial Reports**: Comprehensive financial reporting and analytics

### 👥 **User Management**
- **Role-based Access**: Admin, Manager, Accountant, and User roles
- **Authentication**: Secure JWT-based authentication
- **Authorization**: Fine-grained permission control

### 📊 **Analytics & Reports**
- **Population Statistics**: Resident demographics and statistics
- **Financial Reports**: Payment status, collection reports
- **Occupancy Reports**: Apartment occupancy and availability
- **Custom Dashboards**: Role-based dashboard views

## 🏗️ Architecture

### **Technology Stack**

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Validation**: Express Validator
- **Testing**: Jest + Supertest

#### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router
- **State Management**: React Context + Hooks

#### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)
- **Caching**: Redis (optional)
- **CI/CD**: GitHub Actions ready

### **Project Structure**
```
03_Developement/
├── 📄 README.md                    # This file
├── 📄 PRODUCTION_DEPLOYMENT.md     # Production deployment guide
├── 📄 docker-compose.yml           # Docker services configuration
├── 📄 package.json                 # Root package configuration
├── 🔧 setup.sh                     # Development setup script
├── 
├── 🖥️ server/                      # Backend API
│   ├── 📁 config/                  # Database & app configuration
│   ├── 📁 controllers/             # API route controllers
│   ├── 📁 db/                      # Database models, migrations, seeders
│   ├── 📁 middlewares/             # Authentication & validation middleware
│   ├── 📁 routes/                  # API route definitions
│   ├── 📁 services/                # Business logic services
│   ├── 📁 scripts/                 # Utility scripts
│   ├── 📁 docs/                    # API documentation
│   ├── 📄 server.js                # Main server entry point
│   ├── 📄 package.json             # Backend dependencies
│   └── 🐳 Dockerfile               # Backend container configuration
│
├── 🌐 fe/                          # Frontend React App
│   ├── 📁 src/                     # Source code
│   │   ├── 📁 components/          # Reusable React components
│   │   ├── 📁 pages/               # Page components
│   │   ├── 📁 services/            # API service layer
│   │   ├── 📁 utils/               # Utility functions
│   │   └── 📁 assets/              # Static assets
│   ├── 📁 public/                  # Public assets
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 vite.config.ts           # Vite configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS configuration
│   ├── 📄 nginx.conf               # Nginx configuration for production
│   └── 🐳 Dockerfile               # Frontend container configuration
│
└── 📁 database/                    # Database related files
    ├── 📁 data/                    # Database data (gitignored)
    └── 📁 init/                    # Database initialization scripts
```

## 🚀 Quick Start

### **⚡ One-Command Setup**
```bash
# Navigate to project directory
cd 03_Developement

# Automated setup (5 minutes)
./setup.sh setup

# Start development servers
./setup.sh dev
```

### **🐳 Docker Setup (Recommended)**
```bash
# Setup and start with Docker
./setup.sh docker && ./setup.sh up
```

### **📱 Interactive Setup**
```bash
# Use interactive menu
./setup.sh

# Select option 12: Full setup
```

### **🌐 Access Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Login**: admin / admin123

### **Prerequisites**
- Node.js 18+ and npm 8+
- Docker and Docker Compose (for containerized setup)
- Git

### **1. Manual Setup (Alternative)**
```bash
# Clone the repository (if needed)
git clone https://github.com/your-org/it4082-apartment-management.git
cd it4082-apartment-management/03_Developement

# Make setup script executable
chmod +x setup.sh

# Run complete setup (installs dependencies, sets up database, etc.)
./setup.sh setup
```

### **2. Development Mode**
```bash
# Start development servers (backend + frontend)
./setup.sh dev
# OR
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/api/docs
```

### **3. Docker Development**
```bash
# Start with Docker
./setup.sh up
# OR
npm run docker:up

# Stop Docker services
./setup.sh down
# OR
npm run docker:down
```

### **4. Default Login Credentials**
```
Admin:      username=admin,      password=admin123
Manager:    username=manager,    password=manager123
Accountant: username=accountant, password=accountant123
```

## 🛠️ Available Scripts

### **Root Level Scripts**
```bash
# Development
npm run dev              # Start development servers
npm run build           # Build for production
npm run start           # Start production server

# Setup & Maintenance
npm run setup           # Complete project setup
npm run clean           # Clean debug files
npm run health          # Run health checks

# Docker
npm run docker:up       # Start Docker services
npm run docker:down     # Stop Docker services

# Database
npm run migrate         # Run database migrations
npm run seed            # Seed database with sample data
npm run db:reset        # Reset database

# Code Quality
npm run lint            # Lint all code
npm run format          # Format all code
npm run test            # Run all tests
```

### **Setup Script Options**
```bash
./setup.sh              # Interactive menu
./setup.sh setup        # Full setup
./setup.sh clean        # Clean debug files
./setup.sh dev          # Start development
./setup.sh build        # Build production
./setup.sh health       # Health check
./setup.sh info         # Show project info
```

## 📚 API Documentation

### **Core Endpoints**

#### **Authentication**
```
POST   /api/auth/login     # User login
POST   /api/auth/register  # User registration
POST   /api/auth/logout    # User logout
```

#### **Residents (NhanKhau)**
```
GET    /api/residents      # Get all residents
POST   /api/residents      # Create new resident
GET    /api/residents/:id  # Get resident by ID
PUT    /api/residents/:id  # Update resident
DELETE /api/residents/:id  # Delete resident
```

#### **Households (HoKhau)**
```
GET    /api/households     # Get all households
POST   /api/households     # Create new household
GET    /api/households/:id # Get household by ID
PUT    /api/households/:id # Update household
DELETE /api/households/:id # Delete household
```

#### **Apartments (Canho)**
```
GET    /api/canho          # Get all apartments
POST   /api/canho          # Create new apartment
GET    /api/canho/:id      # Get apartment by ID
PUT    /api/canho/:id      # Update apartment
DELETE /api/canho/:id      # Delete apartment
```

#### **Fee Management**
```
GET    /api/khoanthu       # Get fee types
POST   /api/khoanthu       # Create fee type
GET    /api/dotthu         # Get collection periods
POST   /api/dotthu         # Create collection period
GET    /api/household-fees # Get household fees
POST   /api/nopphi         # Record payment
```

#### **Statistics**
```
GET    /api/statistics/population    # Population statistics
GET    /api/statistics/financial     # Financial statistics
GET    /api/statistics/occupancy     # Occupancy statistics
```

For complete API documentation, visit `/api/docs` when the server is running.

## 🗄️ Database Schema

### **Core Tables**
- **Users**: System user authentication
- **NhanKhau**: Resident information
- **HoKhau**: Household information
- **Canho**: Apartment/room information
- **ThanhVienHoKhau**: Household membership

### **Financial Tables**
- **KhoanThu**: Fee types
- **DotThu**: Collection periods
- **HouseholdFees**: Individual household fees
- **NopPhi**: Payment records

### **Supporting Tables**
- **LoaiXe**: Vehicle types
- **QuanLyXe**: Vehicle registrations
- **LichSuThayDoiHoKhau**: Household change history
- **TamTruTamVang**: Temporary residence requests

For detailed schema information, see `/server/db/migrations/`.

## 🧪 Testing

### **Running Tests**
```bash
# Backend unit tests
cd server && npm test

# Integration tests
cd ../04_Testing && npm test

# Test coverage
cd server && npm run test:coverage
```

### **Test Data**
The system includes comprehensive test data:
- 8 sample residents
- 6 households with relationships
- 8 apartments (6 occupied, 2 available)
- Multiple fee types and collection periods
- Sample payment records

## 🔧 Configuration

### **Environment Variables**

#### **Backend (.env)**
```env
NODE_ENV=development
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apartment_management
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:5173
```

#### **Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=IT4082 Apartment Management
```

### **Database Configuration**
- **Development**: SQLite (`database.sqlite`)
- **Production**: PostgreSQL
- **Migrations**: Sequelize migrations in `/server/db/migrations/`
- **Seeders**: Sample data in `/server/db/seeders/`

## 📈 Performance & Monitoring

### **Performance Features**
- Database indexing for frequently queried fields
- API response caching with Redis
- Optimized database queries with Sequelize
- Frontend code splitting and lazy loading
- Docker multi-stage builds for optimized images

### **Monitoring**
- Health check endpoints
- Structured logging with Winston
- Error tracking and reporting
- Performance metrics collection

## 🔒 Security

### **Security Features**
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Secure headers with Helmet

### **Production Security**
- HTTPS enforcement
- SSL/TLS certificates
- Environment-based secrets
- Database encryption
- Regular security updates

## 🚢 Deployment

### **Development Deployment**
```bash
# Local development
npm run dev

# Docker development
docker-compose up -d
```

### **Production Deployment**
See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for detailed production deployment instructions including:
- Server setup and configuration
- SSL certificate setup
- Database configuration
- Nginx reverse proxy setup
- Monitoring and backup strategies

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### **Code Standards**
- Use TypeScript for frontend development
- Follow ESLint configuration
- Use Prettier for code formatting
- Write comprehensive tests
- Document API changes

### **Commit Convention**
```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/your-org/it4082-apartment-management/wiki)
- **Bug Reports**: [GitHub Issues](https://github.com/your-org/it4082-apartment-management/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/your-org/it4082-apartment-management/discussions)
- **Email**: support@yourdomain.com

## 🎯 Roadmap

### **Phase 1 (Current)**
- [x] Core CRUD functionality
- [x] User authentication and authorization
- [x] Basic financial management
- [x] Resident and household management

### **Phase 2 (Next)**
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Mobile responsive improvements
- [ ] API versioning

### **Phase 3 (Future)**
- [ ] Mobile app development
- [ ] Integration with external payment systems
- [ ] Advanced security features
- [ ] Multi-language support

## 👨‍💻 Team

- **IT4082 Development Team**
- **Project Supervisor**: [Supervisor Name]
- **Lead Developer**: [Lead Name]
- **Backend Developer**: [Backend Developer Name]
- **Frontend Developer**: [Frontend Developer Name]
- **QA Engineer**: [QA Engineer Name]

---

**Built with ❤️ by IT4082 Team**

**Last Updated**: June 16, 2025  
**Version**: 1.0.0
