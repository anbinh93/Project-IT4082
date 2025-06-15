# 🏠 Household Fee Management API Documentation

## 📋 Tổng quan
API quản lý phí hộ gia đình cho hệ thống chung cư BlueMoon, hỗ trợ dashboard tổng quan, theo dõi thanh toán và cập nhật trạng thái.

## 🔐 Authentication
Tất cả endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

## 🎯 Endpoints

### 1. Dashboard theo đợt thu phí
```http
GET /api/household-fees/dashboard/:dotThuId
```

**Mô tả:** Lấy tổng quan dashboard cho một đợt thu phí cụ thể

**Parameters:**
- `dotThuId` (path): ID của đợt thu phí

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "dotThu": {
      "id": 1,
      "tenDotThu": "Thu phí tháng 6/2025",
      "ngayTao": "2025-06-01T00:00:00.000Z",
      "thoiHan": "2025-06-30T00:00:00.000Z"
    },
    "tongKet": {
      "tongHoKhau": 10,
      "tongTienDuKien": 27520000,
      "tongTienDaThu": 4700000,
      "tyLeThuTienTongQuat": 17
    },
    "khoanThuList": [
      {
        "khoanThuId": 1,
        "tenKhoanThu": "Phí quản lý chung cư",
        "batBuoc": true,
        "ghiChu": "Phí quản lý chung cư hàng tháng theo diện tích căn hộ",
        "thongKe": {
          "tongHoKhau": 10,
          "hoDaNop": 1,
          "hoNopMotPhan": 0,
          "hoChuaNop": 9,
          "tyLeHoanThanh": 10
        },
        "taiChinh": {
          "tongTienDuKien": 10500000,
          "tongTienDaThu": 4200000,
          "tyLeThuTien": 40
        }
      }
    ]
  }
}
```

**Ví dụ sử dụng:**
```bash
curl -X GET "http://localhost:8000/api/household-fees/dashboard/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Danh sách hộ gia đình theo khoản thu
```http
GET /api/household-fees/dot-thu/:dotThuId/khoan-thu/:khoanThuId/households
```

**Mô tả:** Lấy danh sách chi tiết các hộ gia đình cho một khoản thu cụ thể

**Parameters:**
- `dotThuId` (path): ID của đợt thu phí
- `khoanThuId` (path): ID của khoản thu
- `page` (query, optional): Trang hiện tại (default: 0)
- `size` (query, optional): Số items per page (default: 20)
- `sortBy` (query, optional): Trường sắp xếp (default: 'createdAt')
- `sortDir` (query, optional): Hướng sắp xếp 'asc' | 'desc' (default: 'desc')

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "khoanThu": {
      "id": 1,
      "tenkhoanthu": "Phí quản lý chung cư",
      "batbuoc": true
    },
    "households": [
      {
        "id": 1,
        "hoKhau": {
          "soHoKhau": 1,
          "chuHo": "Nguyễn Văn A",
          "diaChi": "101 Tòa A, Chung cư BlueMoon",
          "soDienThoai": "0987654321"
        },
        "soTien": "1050000.00",
        "soTienDaNop": "1050000.00",
        "soTienConLai": 0,
        "trangThai": "da_nop_du",
        "trangThaiText": "Đã nộp đủ",
        "ghiChu": "Căn hộ 70m², phí quản lý 15,000đ/m²",
        "chiTietTinhPhi": {
          "dienTich": 70,
          "donGia": 15000,
          "thanhTien": 1050000
        },
        "createdAt": "2025-06-14T16:03:29.617Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 0,
    "pageSize": 20,
    "totalItems": 10,
    "totalPages": 1
  }
}
```

**Ví dụ sử dụng:**
```bash
curl -X GET "http://localhost:8000/api/household-fees/dot-thu/1/khoan-thu/1/households?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Cập nhật thanh toán
```http
PUT /api/household-fees/:id/payment
```

**Mô tả:** Cập nhật thông tin thanh toán cho một khoản phí hộ gia đình

**Parameters:**
- `id` (path): ID của household fee record

**Request Body:**
```json
{
  "soTienThanhToan": 500000,
  "ghiChu": "Thanh toán một phần qua chuyển khoản"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật thanh toán thành công",
  "data": {
    "householdFee": {
      "id": 1,
      "soTien": "1050000.00",
      "soTienDaNop": "1550000.00",
      "trangThai": "da_nop_du",
      "ghiChu": "Thanh toán một phần qua chuyển khoản",
      "updatedAt": "2025-06-15T10:30:00.000Z"
    },
    "paymentRecord": {
      "id": 5,
      "soTien": 500000,
      "ngayNop": "2025-06-15T10:30:00.000Z",
      "hinhThucNop": "TIEN_MAT"
    }
  }
}
```

**Validation Rules:**
- `soTienThanhToan`: Bắt buộc, phải > 0
- `ghiChu`: Tùy chọn, tối đa 500 ký tự

**Ví dụ sử dụng:**
```bash
curl -X PUT "http://localhost:8000/api/household-fees/1/payment" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "soTienThanhToan": 500000,
    "ghiChu": "Thanh toán một phần"
  }'
```

---

## 🔄 Workflow sử dụng API

### Bước 1: Xem dashboard tổng quan
```javascript
const dashboard = await fetch('/api/household-fees/dashboard/1');
// Hiển thị tổng quan: tỷ lệ thu phí, số tiền, progress bars
```

### Bước 2: Chọn khoản thu để xem chi tiết
```javascript
const households = await fetch('/api/household-fees/dot-thu/1/khoan-thu/1/households');
// Hiển thị danh sách hộ gia đình với trạng thái thanh toán
```

### Bước 3: Cập nhật thanh toán
```javascript
await fetch('/api/household-fees/1/payment', {
  method: 'PUT',
  body: JSON.stringify({
    soTienThanhToan: 500000,
    ghiChu: 'Chuyển khoản'
  })
});
// Refresh data để hiển thị cập nhật mới
```

---

## 📊 Status Codes và Error Handling

### Success Responses
- `200 OK`: Request thành công
- `201 Created`: Tạo mới thành công

### Error Responses
- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `401 Unauthorized`: Chưa đăng nhập hoặc token hết hạn
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy resource
- `500 Internal Server Error`: Lỗi server

### Error Response Format
```json
{
  "success": false,
  "message": "Mô tả lỗi chi tiết",
  "error": "Technical error details (dev mode only)"
}
```

---

## 🔧 Implementation Notes

### Database Queries Optimization
- Sử dụng JOIN thay vì N+1 queries
- Index trên các trường thường được query
- Pagination để tránh load quá nhiều data

### Real-time Updates
- Mỗi payment update sẽ trigger recalculation
- Dashboard cache 30 seconds để improve performance
- WebSocket support cho real-time notifications (future)

### Security Considerations
- Validate tất cả input data
- Check user permissions trước khi thực hiện operations
- Log tất cả payment transactions
- Rate limiting cho payment endpoints

---

## 🧪 Testing Examples

### Jest Test Suite
```javascript
describe('Household Fee API', () => {
  test('Should get dashboard data', async () => {
    const response = await request(app)
      .get('/api/household-fees/dashboard/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.tongKet).toBeDefined();
  });
  
  test('Should update payment successfully', async () => {
    const response = await request(app)
      .put('/api/household-fees/1/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        soTienThanhToan: 500000,
        ghiChu: 'Test payment'
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

---

*Last updated: 15/06/2025*  
*API Version: 1.0*  
*Base URL: http://localhost:8000*
