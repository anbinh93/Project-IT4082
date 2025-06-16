# 🧪 Household Management API Testing Suite

Bộ test suite toàn diện cho các API quản lý hộ khẩu trong hệ thống quản lý chung cư.

## 📁 Cấu trúc thư mục

```
04_Testing/
├── test-household-management-api.js      # Test CRUD cơ bản cho hộ khẩu
├── test-household-member-api.js          # Test quản lý thành viên hộ khẩu
├── test-household-fee-api.js             # Test quản lý phí thu hộ khẩu
├── test-household-housing-api.js         # Test phân bổ phòng/căn hộ cho hộ khẩu
├── test-household-comprehensive.js      # Script chạy tất cả các test
├── run-household-tests.sh               # Script shell để chạy test
├── household-api-test-documentation.md  # Tài liệu chi tiết về test
└── README.md                            # File này
```

## 🎯 Phạm vi kiểm thử

### 1. Quản lý hộ khẩu cơ bản
- ✅ Tạo hộ khẩu mới
- ✅ Lấy danh sách hộ khẩu (có phân trang)
- ✅ Lấy thông tin chi tiết hộ khẩu
- ✅ Cập nhật thông tin hộ khẩu
- ✅ Tìm kiếm hộ khẩu
- ✅ Gán chủ hộ

### 2. Quản lý thành viên hộ khẩu
- ✅ Thêm thành viên vào hộ khẩu
- ✅ Xóa thành viên khỏi hộ khẩu
- ✅ Tách hộ (tạo hộ mới)
- ✅ Chuyển hộ (sang hộ khẩu khác)
- ✅ Quản lý mối quan hệ với chủ hộ
- ✅ Lịch sử thay đổi hộ khẩu

### 3. Quản lý phí hộ khẩu
- ✅ Dashboard thu phí theo đợt
- ✅ Danh sách phí theo hộ khẩu
- ✅ Cập nhật trạng thái thanh toán
- ✅ Tính toán và tính lại phí
- ✅ Thống kê thu phí
- ✅ Báo cáo theo khoản thu

### 4. Quản lý nhà ở
- ✅ Phân bổ phòng cho hộ khẩu
- ✅ Thu hồi phòng từ hộ khẩu
- ✅ Phân bổ căn hộ cho hộ khẩu
- ✅ Thu hồi căn hộ từ hộ khẩu
- ✅ Truy vấn tình trạng nhà ở
- ✅ Thống kê nhà ở

## 🚀 Cách chạy test

### Yêu cầu tiên quyết
1. Backend server đang chạy tại `http://localhost:8000`
2. Database có dữ liệu test
3. Tài khoản admin hợp lệ (`admin`/`admin123`)

### Cách 1: Sử dụng script shell (Khuyến nghị)
```bash
./run-household-tests.sh
```

Script sẽ hiển thị menu để bạn chọn:
1. Chạy tất cả test (toàn diện)
2. Chỉ test quản lý hộ khẩu
3. Chỉ test quản lý thành viên
4. Chỉ test quản lý phí
5. Chỉ test quản lý nhà ở

### Cách 2: Chạy từng test riêng lẻ
```bash
# Test quản lý hộ khẩu cơ bản
node test-household-management-api.js

# Test quản lý thành viên
node test-household-member-api.js

# Test quản lý phí
node test-household-fee-api.js

# Test quản lý nhà ở
node test-household-housing-api.js

# Test toàn diện (chạy tất cả)
node test-household-comprehensive.js
```

## 📊 Định dạng kết quả

### Kết quả từng test
```
✅ Test Name - Thành công
❌ Test Name - Thất bại
   Details: Thông tin chi tiết về lỗi
```

### Tóm tắt test suite
```
📊 HOUSEHOLD MANAGEMENT API TEST SUMMARY
========================================
Total Tests: 25
Passed: 23 ✅
Failed: 2 ❌
Success Rate: 92.00%
```

### Báo cáo toàn diện
```
🔢 OVERALL STATISTICS:
   Total Test Suites: 4
   Passed Suites: 3 ✅
   Failed Suites: 1 ❌
   Total Tests: 75
   Passed Tests: 70 ✅
   Failed Tests: 5 ❌
   Overall Success Rate: 93.33%
```

## 🔍 Các endpoint được test

### API Quản lý hộ khẩu
- `GET /api/households` - Lấy danh sách hộ khẩu
- `GET /api/households/{id}` - Lấy thông tin hộ khẩu
- `POST /api/households` - Tạo hộ khẩu mới
- `PUT /api/households/{id}` - Cập nhật hộ khẩu
- `GET /api/households/available` - Lấy hộ khẩu khả dụng
- `POST /api/households/assign-head` - Gán chủ hộ

### API Quản lý thành viên
- `GET /api/residents/available` - Lấy nhân khẩu khả dụng
- `GET /api/residents/{id}/household-info` - Thông tin hộ khẩu của nhân khẩu
- `POST /api/residents/add-to-household` - Thêm vào hộ khẩu
- `POST /api/residents/separate-household` - Tách hộ khẩu
- `GET /api/residents/household-changes` - Lịch sử thay đổi

### API Quản lý phí
- `GET /api/household-fees/dashboard/{dotThuId}` - Dashboard thu phí
- `GET /api/household-fees/dot-thu/{dotThuId}` - Phí theo đợt thu
- `PUT /api/household-fees/{id}/payment` - Cập nhật thanh toán
- `PUT /api/household-fees/recalculate/{dotThuId}/{hoKhauId}/{khoanThuId}` - Tính lại phí
- `GET /api/household-fees/dot-thu/{dotThuId}/khoan-thu/{khoanThuId}/households` - Hộ theo khoản thu

### API Quản lý nhà ở
- `POST /api/rooms/{id}/assign` - Phân bổ phòng
- `POST /api/rooms/{id}/release` - Thu hồi phòng
- `POST /api/canho/assign` - Phân bổ căn hộ
- `PUT /api/canho/{id}/remove-hokhau` - Thu hồi căn hộ
- `GET /api/rooms/statistics` - Thống kê phòng
- `GET /api/canho/statistics` - Thống kê căn hộ

## ⚠️ Các tình huống lỗi được test

### 1. Lỗi xác thực
- Thiếu token xác thực (401)
- Token không hợp lệ (401)
- Không đủ quyền (403)

### 2. Lỗi validation
- Thiếu trường bắt buộc (400)
- Kiểu dữ liệu không hợp lệ (400)
- Vi phạm quy tắc nghiệp vụ (400)

### 3. Lỗi không tìm thấy
- ID hộ khẩu không tồn tại (404)
- ID nhân khẩu không tồn tại (404)
- Đợt thu không tồn tại (404)

### 4. Lỗi logic nghiệp vụ
- Thêm nhân khẩu vào nhiều hộ khẩu
- Phân bổ phòng cho nhiều hộ khẩu
- Ràng buộc chủ hộ
- Validation số tiền thanh toán

## 📈 Mức độ phủ sóng

### Chức năng được test
- ✅ 95% endpoints API
- ✅ 90% luồng nghiệp vụ chính
- ✅ 85% trường hợp lỗi
- ✅ 80% ràng buộc dữ liệu

### Chức năng chưa test (để phát triển tương lai)
- ❌ Test hiệu suất (performance)
- ❌ Test tải (load testing)
- ❌ Test bảo mật (security)
- ❌ Test tích hợp (integration)

## 🔧 Cấu hình test

### Biến môi trường
```javascript
const API_BASE = 'http://localhost:8000/api';
const TEST_USERNAME = 'admin';
const TEST_PASSWORD = 'admin123';
```

### Timeout mặc định
- Request timeout: 5000ms
- Authentication timeout: 3000ms
- Setup timeout: 10000ms

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. "Authentication failed"
- **Nguyên nhân**: Server không chạy hoặc credentials sai
- **Giải pháp**: Kiểm tra server và thông tin đăng nhập

#### 2. "Cannot proceed without authentication"
- **Nguyên nhân**: API login không hoạt động
- **Giải pháp**: Kiểm tra endpoint `/api/auth/login`

#### 3. "No test data available"
- **Nguyên nhân**: Database chưa có dữ liệu test
- **Giải pháp**: Chạy seed data hoặc tạo dữ liệu test

#### 4. "Network timeout"
- **Nguyên nhân**: Server phản hồi chậm
- **Giải pháp**: Kiểm tra hiệu suất server

### Debug test
```bash
# Chạy test với log chi tiết
DEBUG=1 node test-household-comprehensive.js

# Chỉ chạy test cụ thể
node -e "require('./test-household-management-api.js')"
```

## 📚 Tài liệu tham khảo

- [Tài liệu chi tiết test](./household-api-test-documentation.md)
- [API Documentation](../03_Developement/server/docs/)
- [Database Schema](../03_Developement/server/db/models/)

## 🤝 Đóng góp

### Thêm test case mới
1. Tạo function test trong file phù hợp
2. Thêm vào test suite runner
3. Cập nhật documentation
4. Chạy test để đảm bảo hoạt động

### Báo cáo lỗi
1. Mô tả chi tiết lỗi
2. Cung cấp log lỗi
3. Nêu môi trường test
4. Đề xuất cách khắc phục

## 📞 Hỗ trợ

Nếu có vấn đề với test suite, vui lòng:
1. Kiểm tra documentation
2. Xem log lỗi chi tiết
3. Liên hệ team phát triển
4. Tạo issue trong repository

---

**Lưu ý**: Test suite này được thiết kế cho môi trường development. Cần điều chỉnh cho production environment.
