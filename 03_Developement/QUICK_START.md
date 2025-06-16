# ⚡ Hướng Dẫn Cài Đặt Nhanh - IT4082 Apartment Management

## 🚀 Cài Đặt Trong 5 Phút

### **Bước 1: Kiểm Tra Yêu Cầu** (30 giây)
```bash
node --version    # Cần >= 18.0.0
npm --version     # Cần >= 8.0.0
```

### **Bước 2: Di Chuyển Vào Thư Mục Project** (10 giây)
```bash
cd /Users/nguyenbinhan/Workspace/Project-IT4082/03_Developement
```

### **Bước 3: Cài Đặt Tự Động** (3-4 phút)
```bash
./setup.sh setup
```

### **Bước 4: Khởi Động Development** (10 giây)
```bash
./setup.sh dev
```

### **Bước 5: Truy Cập Ứng Dụng** (5 giây)
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Login**: admin / admin123

---

## 🐳 Cài Đặt Với Docker (Khuyến Nghị)

### **Một Lệnh Duy Nhất**
```bash
cd /Users/nguyenbinhan/Workspace/Project-IT4082/03_Developement
./setup.sh docker && ./setup.sh up
```

### **Truy Cập**
- **App**: http://localhost:5173
- **API**: http://localhost:8000

---

## 🆘 Nếu Gặp Lỗi

### **Lỗi Port Đã Sử Dụng**
```bash
# Kill processes
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### **Lỗi Database**
```bash
cd server
rm database.sqlite
npm run migrate && npm run seed
```

### **Lỗi Dependencies**
```bash
./setup.sh clean
./setup.sh deps
```

---

## 📋 Menu Tương Tác

Nếu muốn kiểm soát từng bước:
```bash
./setup.sh
```

**Menu sẽ hiện:**
```
🏢 IT4082 Apartment Management System
=====================================

1) 🧹 Clean up debug files
2) 📦 Setup dependencies
3) 🗄️ Setup database
4) 🔧 Manage database
5) 🐳 Setup Docker
6) 🏗️ Build production
7) 🔍 Run health checks
8) 🚀 Start development servers
9) 🐳 Start with Docker
10) 🛑 Stop Docker services
11) 📋 Show project info
12) 🔄 Full setup (1-3,5-7)
```

---

## 🎯 Lệnh Hữu Ích

```bash
./setup.sh health       # Kiểm tra hệ thống
./setup.sh info         # Xem thông tin project
./setup.sh db-manage    # Quản lý database
./setup.sh down         # Dừng Docker services
./test-setup.sh         # Kiểm tra cài đặt
```

---

## 🔑 Tài Khoản Mặc Định

| Vai Trò | Username | Password |
|---------|----------|----------|
| Admin | admin | admin123 |
| Manager | manager | manager123 |
| Accountant | accountant | accountant123 |

---

**✅ Xong! Hệ thống đã sẵn sàng sử dụng!**

*Để biết thêm chi tiết, xem [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)*
