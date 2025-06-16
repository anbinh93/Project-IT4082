# 📖 Hướng Dẫn Cài Đặt - Hệ Thống Quản Lý Chung Cư IT4082

## 📋 Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt Tự Động](#cài-đặt-tự-động)
3. [Cài Đặt Thủ Công](#cài-đặt-thủ-công)
4. [Cài Đặt Với Docker](#cài-đặt-với-docker)
5. [Kiểm Tra Và Xử Lý Lỗi](#kiểm-tra-và-xử-lý-lỗi)
6. [Quản Lý Database](#quản-lý-database)
7. [FAQ - Câu Hỏi Thường Gặp](#faq---câu-hỏi-thường-gặp)

---

## 🔧 Yêu Cầu Hệ Thống

### **Tối Thiểu**
- **OS**: macOS 10.15+, Ubuntu 18.04+, Windows 10+
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **RAM**: 4GB
- **Disk**: 2GB trống

### **Khuyến Nghị**
- **OS**: macOS 12+, Ubuntu 20.04+, Windows 11
- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **RAM**: 8GB+
- **Disk**: 5GB+ trống
- **Docker**: >= 20.0.0 (tùy chọn)

### **Kiểm Tra Yêu Cầu**
```bash
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra Docker (tùy chọn)
docker --version
```

---

## 🚀 Cài Đặt Tự Động

### **1. Tải Về Project**
```bash
# Clone repository
git clone <repository-url>
cd Project-IT4082/03_Developement

# Hoặc nếu đã có source code
cd /path/to/Project-IT4082/03_Developement
```

### **2. Cài Đặt Một Lệnh**
```bash
# Cài đặt hoàn toàn tự động
./setup.sh setup
```

**Quá trình này sẽ:**
- ✅ Dọn dẹp các file debug/tạm thời
- ✅ Cài đặt dependencies cho backend và frontend
- ✅ Thiết lập database (migrations + seeders)
- ✅ Cấu hình Docker environment
- ✅ Build production assets
- ✅ Chạy health checks
- ✅ Hiển thị thông tin project

### **3. Khởi Chạy Development**
```bash
# Khởi động development servers
./setup.sh dev
```

**Hoặc sử dụng menu tương tác:**
```bash
./setup.sh
# Chọn tùy chọn 12: Full setup
```

---

## 🛠️ Cài Đặt Thủ Công

### **1. Cài Đặt Dependencies**

#### **Backend**
```bash
cd server
npm install
```

#### **Frontend** 
```bash
cd fe
npm install
```

### **2. Cấu Hình Database**

#### **Tạo File Environment**
```bash
# Tạo file .env trong thư mục server
cd server
cp .env.example .env  # Nếu có
```

#### **Cấu Hình Database (SQLite - Mặc định)**
```bash
# File server/.env
NODE_ENV=development
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
PORT=8000
JWT_SECRET=your-secret-key-here
```

#### **Cấu Hình Database (PostgreSQL - Tùy chọn)**
```bash
# File server/.env
NODE_ENV=development
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apartment_management
DB_USERNAME=postgres
DB_PASSWORD=your-password
PORT=8000
JWT_SECRET=your-secret-key-here
```

### **3. Thiết Lập Database**

```bash
cd server

# Chạy migrations
npm run migrate

# Chạy seeders (tạo dữ liệu mẫu)
npm run seed

# Tạo admin users
node scripts/createTestUsers.js
```

### **4. Khởi Động Services**

#### **Terminal 1 - Backend**
```bash
cd server
npm run dev
# Backend sẽ chạy tại: http://localhost:8000
```

#### **Terminal 2 - Frontend**
```bash
cd fe
npm run dev  
# Frontend sẽ chạy tại: http://localhost:5173
```

---

## 🐳 Cài Đặt Với Docker

### **1. Cài Đặt Docker**
- **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### **2. Thiết Lập Docker Environment**
```bash
# Cấu hình Docker
./setup.sh docker

# Hoặc thủ công
mkdir -p database/data database/init server/uploads server/logs
```

### **3. Khởi Động Docker Services**
```bash
# Khởi động tất cả services
./setup.sh up

# Hoặc thủ công
docker-compose up -d
```

### **4. Kiểm Tra Services**
```bash
# Kiểm tra trạng thái containers
docker-compose ps

# Xem logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### **5. Dừng Docker Services**
```bash
# Dừng services
./setup.sh down

# Hoặc thủ công  
docker-compose down
```

---

## 🔍 Kiểm Tra Và Xử Lý Lỗi

### **1. Kiểm Tra Tự Động**
```bash
# Chạy health checks
./setup.sh health

# Kiểm tra setup environment
./test-setup.sh
```

### **2. Kiểm Tra Database**
```bash
cd server

# Validate database
node scripts/validate-database.js

# Kiểm tra connection
node -e "const {sequelize} = require('./db/models'); sequelize.authenticate().then(() => console.log('✅ OK')).catch(console.error)"
```

### **3. Kiểm Tra Services**

#### **Backend**
```bash
# Test backend API
curl http://localhost:8000/api/auth/status

# Kiểm tra logs
cd server && npm run dev
```

#### **Frontend**
```bash
# Kiểm tra build
cd fe && npm run build

# Test development server
cd fe && npm run dev
```

### **4. Xử Lý Lỗi Thường Gặp**

#### **Port đã được sử dụng**
```bash
# Tìm process đang sử dụng port
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:5432 | xargs kill -9  # PostgreSQL
```

#### **Database connection failed**
```bash
# Reset database
cd server
npm run db:reset

# Hoặc recreate
rm database.sqlite
npm run migrate
npm run seed
```

#### **Dependencies issues**
```bash
# Xóa node_modules và reinstall
rm -rf server/node_modules server/package-lock.json
rm -rf fe/node_modules fe/package-lock.json

cd server && npm install
cd ../fe && npm install
```

#### **Permission denied**
```bash
# Cấp quyền execute cho script
chmod +x setup.sh
chmod +x test-setup.sh
```

---

## 🗄️ Quản Lý Database

### **1. Menu Quản Lý Database**
```bash
./setup.sh db-manage
```

**Tùy chọn có sẵn:**
- 🔄 Reset database (migrate + seed)
- 📊 Show database status  
- ✅ Validate database
- 🔙 Rollback last migration
- 🌱 Run seeders only
- 🧹 Clear all data (keep structure)
- 👥 Create test users

### **2. Lệnh Database Thủ Công**

#### **Migrations**
```bash
cd server

# Chạy all migrations
npm run migrate

# Rollback last migration
npm run migrate:undo

# Rollback all migrations
npm run migrate:undo:all
```

#### **Seeders**
```bash
# Chạy all seeders
npm run seed

# Rollback all seeders
npm run seed:undo

# Reset database hoàn toàn
npm run db:reset
```

#### **Admin Users**
```bash
# Tạo test users
node scripts/createTestUsers.js
```

### **3. Backup & Restore**

#### **SQLite Backup**
```bash
# Backup
cp server/database.sqlite server/database.backup.$(date +%Y%m%d_%H%M%S).sqlite

# Restore
cp server/database.backup.YYYYMMDD_HHMMSS.sqlite server/database.sqlite
```

#### **PostgreSQL Backup**
```bash
# Backup
docker exec postgres-container pg_dump -U postgres apartment_management > backup.sql

# Restore  
docker exec -i postgres-container psql -U postgres -d apartment_management < backup.sql
```

---

## 📊 Thông Tin Truy Cập

### **URLs**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api

### **Tài Khoản Mặc Định**
```
Admin:      username=admin,      password=admin123
Manager:    username=manager,    password=manager123
Accountant: username=accountant, password=accountant123
```

### **Database**
- **Development**: SQLite (server/database.sqlite)
- **Production**: PostgreSQL (localhost:5432)

---

## 🚀 Production Deployment

### **1. Build Production**
```bash
# Build frontend
./setup.sh build

# Hoặc thủ công
cd fe && npm run build
```

### **2. Environment Setup**
```bash
# Copy production config
cp .env.production server/.env

# Update production settings
NODE_ENV=production
DB_DIALECT=postgres
# ... other production configs
```

### **3. Deploy với Docker**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

**Xem chi tiết**: [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

---

## ❓ FAQ - Câu Hỏi Thường Gặp

### **Q: Làm sao để thay đổi port?**
A: Sửa file `.env` trong thư mục `server`:
```bash
PORT=8080  # Thay đổi port backend
```

### **Q: Có thể sử dụng MySQL thay vì PostgreSQL không?**
A: Có, sửa file `config/config.js` và cài đặt mysql2:
```bash
npm install mysql2
```

### **Q: Làm sao để reset lại database?**
A: Sử dụng lệnh:
```bash
./setup.sh db-manage
# Chọn option 1: Reset database
```

### **Q: Lỗi "EADDRINUSE" nghĩa là gì?**
A: Port đã được sử dụng. Kill process và restart:
```bash
lsof -ti:8000 | xargs kill -9
npm run dev
```

### **Q: Làm sao để thêm dữ liệu mẫu khác?**
A: Tạo seeder mới:
```bash
cd server
npx sequelize-cli seed:generate --name demo-data
# Edit file seeder
npm run seed
```

### **Q: Có thể run frontend và backend cùng port không?**
A: Không khuyến nghị. Sử dụng nginx làm reverse proxy trong production.

### **Q: Làm sao để debug API calls?**
A: Sử dụng browser DevTools hoặc:
```bash
# Backend logs
cd server && npm run dev

# API testing
curl -X GET http://localhost:8000/api/households
```

---

## 📞 Hỗ Trợ

### **Issues**
- Tạo issue trên GitHub repository
- Cung cấp logs và steps để reproduce

### **Logs**
```bash
# Backend logs
cd server && npm run dev

# Docker logs
docker-compose logs backend
docker-compose logs frontend
```

### **Debug Mode**
```bash
# Chạy với debug
cd server
DEBUG=* npm run dev
```

---

## 📚 Tài Liệu Tham Khảo

- [README.md](./README.md) - Tổng quan project
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - Hướng dẫn deploy production
- [SETUP_COMPLETION_REPORT.md](./SETUP_COMPLETION_REPORT.md) - Báo cáo hoàn thành setup
- [04_Testing/README.md](../04_Testing/README.md) - Hướng dẫn testing

---

**🎉 Chúc bạn cài đặt thành công!**

*Nếu gặp vấn đề, hãy kiểm tra [SETUP_COMPLETION_REPORT.md](./SETUP_COMPLETION_REPORT.md) để biết thêm chi tiết về hệ thống.*
