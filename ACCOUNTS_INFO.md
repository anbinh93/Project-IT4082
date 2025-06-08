# 🔐 Tài Khoản Đăng Nhập - Vehicle & Room Management System

## 📊 Trạng Thái Hệ Thống
- **Backend API**: ✅ Đang chạy tại `http://localhost:8000`
- **Frontend Web**: ✅ Đang chạy tại `http://localhost:5173/KTPM_FE`
- **Database**: ✅ Đã seed dữ liệu thành công

---

## 👥 Tài Khoản Có Sẵn

### 1. 🔑 Admin (Quản trị viên)
```
Username: admin
Password: admin123
Role: admin
```
**Quyền truy cập**: Toàn quyền quản trị hệ thống
- Quản lý xe
- Quản lý phòng
- Thống kê nhân khẩu
- Quản lý khoản thu

---

### 2. 💼 Accountant (Kế toán)
```
Username: accountant
Password: 123456
Role: accountant
```
**Quyền truy cập**: Quản lý tài chính và khoản thu
- Quản lý khoản thu
- Thống kê doanh thu
- Xem thông tin xe và phòng

---

### 3. 👤 User (Người dùng)
```
Username: user  
Password: 123456
Role: user
```
**Quyền truy cập**: Hạn chế, chỉ xem thông tin cơ bản
- Xem thông tin cá nhân
- Xem thông tin phòng được phân công

---

## 🌐 URL Truy Cập

### Frontend (Giao diện web)
```
http://localhost:5173/KTPM_FE
```

### Backend API Endpoints
```
Base URL: http://localhost:8000/api

Đăng nhập: POST /auth/login
Xe: GET /vehicles (cần token)
Phòng: GET /rooms (cần token)
Thống kê: GET /statistics/* (cần token + role)
```

---

## 🧪 Test Đăng Nhập

### Admin Login Test
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Accountant Login Test  
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "accountant", "password": "123456"}'
```

### User Login Test
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "123456"}'
```

---

## 📋 Chức Năng Chính

### 🚗 Quản Lý Xe (Vehicle Management)
- **URL**: `http://localhost:5173/KTPM_FE` → Quản lý xe
- **Quyền**: Admin
- **Chức năng**: CRUD xe, thống kê, phân công

### 🏠 Quản Lý Phòng (Room Management)  
- **URL**: `http://localhost:5173/KTPM_FE` → Quản lý phòng
- **Quyền**: Admin
- **Chức năng**: CRUD phòng, phân công hộ khẩu

### 📊 Thống Kê Nhân Khẩu
- **URL**: `http://localhost:5173/KTPM_FE` → Thống kê nhân khẩu
- **Quyền**: Admin, Manager, Accountant
- **Chức năng**: Báo cáo dân số, thống kê

---

## ⚡ Quick Start

1. **Truy cập Frontend**: http://localhost:5173/KTPM_FE
2. **Đăng nhập bằng Admin**: 
   - Username: `admin`
   - Password: `admin123`
3. **Bắt đầu quản lý**: Chọn menu bên trái để truy cập các chức năng

---

## 🔧 Troubleshooting

### Nếu Backend không hoạt động:
```bash
cd /Users/nguyenbinhan/Workspace/Project-IT4082/03_Developement/server
node server.js
```

### Nếu Frontend không hoạt động:
```bash  
cd /Users/nguyenbinhan/Workspace/Project-IT4082/03_Developement/fe
npm run dev
```

### Reset Database (nếu cần):
```bash
cd /Users/nguyenbinhan/Workspace/Project-IT4082/03_Developement/server
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## 📝 Ghi Chú
- Hệ thống đã được test và hoạt động ổn định
- Tất cả API endpoints đã được verify
- Frontend-Backend integration đã được kiểm tra
- Dữ liệu demo đã được tạo sẵn

**Ngày cập nhật**: 8 tháng 6, 2025
**Trạng thái**: ✅ Sẵn sàng sử dụng
