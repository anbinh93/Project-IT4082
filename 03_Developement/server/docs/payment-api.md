# Payment API Documentation

## Base URL
```
/api/payments
```

## Authentication
Tất cả endpoints yêu cầu:
- Bearer token trong header Authorization
- Role: `accountant`

## Endpoints

### 1. Ghi nhận khoản nộp phí mới (Create Payment)

**POST** `/api/payments`

#### Request Body
```json
{
  "householdId": "integer",        // ID hộ khẩu (bắt buộc)
  "feeTypeId": "integer",          // ID khoản thu (bắt buộc)
  "amountPaid": "number",          // Số tiền nộp (bắt buộc)
  "paymentDate": "string",         // Ngày nộp (YYYY-MM-DD, tùy chọn)
  "paymentMethod": "string",       // Phương thức thanh toán (tùy chọn)
  "notes": "string",               // Ghi chú (tùy chọn)
  "nguoinop": "string"             // Tên người nộp (tùy chọn)
}
```

#### Response (201 Created)
```json
{
  "paymentId": "integer",
  "householdId": "integer",
  "feeTypeId": "integer",
  "amountPaid": "number",
  "paymentDate": "string",
  "paymentMethod": "string",
  "notes": "string",
  "nguoinop": "string",
  "createdAt": "string",
  "household": {
    "sohokhau": "integer",
    "chuHo": {
      "id": "integer",
      "hoten": "string"
    }
  },
  "feeType": {
    "id": "integer",
    "tenkhoanthu": "string",
    "ngaytao": "string",
    "thoihan": "string"
  }
}
```

### 2. Lấy danh sách khoản nộp phí (Get Payments)

**GET** `/api/payments`

#### Query Parameters
- `householdId` (integer, optional): Lọc theo hộ khẩu
- `feeTypeId` (integer, optional): Lọc theo khoản thu
- `startDate` (string, optional): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (string, optional): Ngày kết thúc (YYYY-MM-DD)
- `paymentMethod` (string, optional): Phương thức thanh toán
- `page` (integer, default: 0): Số trang
- `size` (integer, default: 20): Số bản ghi mỗi trang
- `sortBy` (string, default: "ngaynop"): Trường sắp xếp
- `sortDir` (string, default: "desc"): Hướng sắp xếp (asc/desc)

#### Response (200 OK)
```json
{
  "payments": [
    {
      "paymentId": "integer",
      "householdId": "integer",
      "feeTypeId": "integer",
      "amountPaid": "number",
      "paymentDate": "string",
      "paymentMethod": "string",
      "notes": "string",
      "nguoinop": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "household": { /* household info */ },
      "feeType": { /* fee type info */ }
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "pageSize": "integer",
    "totalItems": "integer",
    "totalPages": "integer"
  }
}
```

### 3. Lấy chi tiết khoản nộp phí (Get Payment Detail)

**GET** `/api/payments/{paymentId}`

#### Response (200 OK)
```json
{
  "paymentId": "integer",
  "householdId": "integer",
  "feeTypeId": "integer",
  "amountPaid": "number",
  "paymentDate": "string",
  "paymentMethod": "string",
  "notes": "string",
  "nguoinop": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "household": { /* household info */ },
  "feeType": { /* fee type info */ }
}
```

### 4. Cập nhật khoản nộp phí (Update Payment)

**PUT** `/api/payments/{paymentId}`

#### Request Body
```json
{
  "amountPaid": "number",          // Số tiền nộp (tùy chọn)
  "paymentDate": "string",         // Ngày nộp (tùy chọn)
  "paymentMethod": "string",       // Phương thức thanh toán (tùy chọn)
  "notes": "string",               // Ghi chú (tùy chọn)
  "nguoinop": "string"             // Tên người nộp (tùy chọn)
}
```

#### Response (200 OK)
Tương tự như response của GET payment detail

### 5. Xóa khoản nộp phí (Soft Delete Payment)

**DELETE** `/api/payments/{paymentId}`

#### Request Body (Optional)
```json
{
  "cancelReason": "string"  // Lý do hủy (tùy chọn)
}
```

#### Response (204 No Content)
Không có nội dung trả về. Status code 204 cho biết thao tác thành công.

#### Đặc điểm:
- **Soft Delete**: Giao dịch không bị xóa vĩnh viễn, chỉ được đánh dấu là đã hủy
- **Idempotency**: Gọi nhiều lần với cùng ID sẽ trả về cùng kết quả
- **Transaction**: Sử dụng database transaction để đảm bảo tính toàn vẹn
- **Audit Trail**: Lưu thông tin người hủy và lý do hủy

### 6. Thống kê thanh toán (Payment Statistics)

**GET** `/api/payments/statistics`

#### Query Parameters
- `feeTypeId` (integer, optional): Lọc theo khoản thu
- `startDate` (string, optional): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (string, optional): Ngày kết thúc (YYYY-MM-DD)

#### Response (200 OK)
```json
{
  "totalTransactions": "integer",
  "totalAmount": "number",
  "paymentMethodBreakdown": [
    {
      "method": "string",
      "count": "integer",
      "amount": "number"
    }
  ]
}
```

### 7. Khôi phục khoản nộp phí đã bị xóa (Restore Payment)

**POST** `/api/payments/{paymentId}/restore`

#### Request Body (Optional)
```json
{
  "restoreReason": "string"  // Lý do khôi phục (tùy chọn)
}
```

#### Response (200 OK)
```json
{
  "message": "Đã khôi phục giao dịch nộp phí thành công",
  "payment": {
    "paymentId": "integer",
    "householdId": "integer",
    "feeTypeId": "integer",
    "amountPaid": "number",
    "paymentDate": "string",
    "paymentMethod": "string",
    "status": "ACTIVE",
    "notes": "string",
    "nguoinop": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "household": { /* household info */ },
    "feeType": { /* fee type info */ }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Thiếu thông tin bắt buộc: householdId, feeTypeId, amountPaid"
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy giao dịch nộp phí"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message"
}
```

## Payment Methods
- `CASH`: Tiền mặt
- `BANK_TRANSFER`: Chuyển khoản ngân hàng
- `ONLINE`: Thanh toán online
- `CHECK`: Séc

## Use Cases

### KT004: CRUD thông tin nộp khoản thu
1. **Create**: POST `/api/payments` - Ghi nhận khoản nộp phí mới
2. **Read**: GET `/api/payments` - Xem danh sách các giao dịch
3. **Read Detail**: GET `/api/payments/{id}` - Xem chi tiết giao dịch
4. **Update**: PUT `/api/payments/{id}` - Chỉnh sửa thông tin giao dịch
5. **Delete**: DELETE `/api/payments/{id}` - Xóa giao dịch

### KT005: Truy vấn đợt thu phí
- Sử dụng GET `/api/payments` với filter `feeTypeId`
- Sử dụng GET `/api/payments/statistics` để xem tổng quan

### KT006: Thống kê
- Sử dụng GET `/api/payments/statistics` với các filter khác nhau 