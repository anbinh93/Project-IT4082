# 🏢 Hệ Thống Quản Lý Chung Cư IT4082

## 🚀 Cài Đặt Nhanh

### **Bước 1: Mở Terminal và chuyển vào thư mục dự án**
```bash
cd /Users/nguyenbinhan/Workspace/Project-IT4082/03_Developement
```

### **Bước 2: Chạy lệnh cài đặt tự động**
```bash
./setup.sh setup
```

### **Bước 3: Khởi động ứng dụng**
```bash
./setup.sh dev
```

### **Bước 4: Mở trình duyệt**
- Vào địa chỉ: http://localhost:5173
- Đăng nhập với: **admin** / **admin123**

---

## 🔧 Các Lệnh Hữu Ích

```bash
./setup.sh          # Menu tương tác
./setup.sh info      # Xem thông tin hệ thống
./setup.sh health    # Kiểm tra trạng thái
./setup.sh down      # Dừng Docker services
```

---

## 🐳 Sử Dụng Docker

```bash
# Cài đặt và khởi động với Docker
./setup.sh docker
./setup.sh up

# Truy cập: http://localhost:5173
```

---

## 🆘 Xử Lý Lỗi

### **Lỗi: "Port đã được sử dụng"**
```bash
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### **Lỗi: Database**
```bash
cd server
rm database.sqlite
npm run migrate
npm run seed
```

### **Lỗi: Dependencies**
```bash
./setup.sh clean
./setup.sh deps
```

---

## 👥 Tài Khoản Mặc Định

| Vai trò | Tên đăng nhập | Mật khẩu |
|---------|---------------|----------|
| Quản lý | totruong | totruong123 |
| Kế toán | ketoan | ketoan123 |

---

## 📁 Cấu Trúc Dự Án

```
03_Developement/
├── setup.sh              # Script cài đặt chính
├── server/                # Backend (Node.js + Express)
├── fe/                    # Frontend (React + TypeScript)
├── docker-compose.yml     # Cấu hình Docker
└── [các tài liệu hướng dẫn]
```

---

## 🌟 Tính Năng Chính

✅ **Quản lý cư dân**: Thông tin cá nhân, hộ khẩu  
✅ **Quản lý căn hộ**: Phân bổ phòng, thông tin căn hộ  
✅ **Quản lý phí**: Thu phí dịch vụ, điện nước, quản lý  
✅ **Quản lý thanh toán**: Theo dõi lịch sử thanh toán  
✅ **Báo cáo thống kê**: Dân số, tài chính, công nợ  
✅ **Quản lý xe**: Đăng ký xe, phí gửi xe  

---

## 📖 Tài Liệu Chi Tiết

- **[Hướng dẫn cài đặt đầy đủ](./INSTALLATION_GUIDE.md)**
- **[Hướng dẫn deploy production](./PRODUCTION_DEPLOYMENT.md)**
- **[Báo cáo hoàn thành](./SETUP_COMPLETION_REPORT.md)**

---

**🎉 Chúc bạn sử dụng thành công!**

*Liên hệ hỗ trợ nếu gặp vấn đề trong quá trình cài đặt.*
