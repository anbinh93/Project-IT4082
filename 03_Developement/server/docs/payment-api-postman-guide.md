# Payment API - Postman Testing Guide

## Prerequisites

### 1. Environment Setup
```
baseUrl: http://localhost:8000
token: YOUR_JWT_TOKEN_HERE (role: accountant)
```

### 2. Authentication
Payment API yêu cầu role `accountant`. Tạo user accountant:

**Login Request:**
```
Method: POST
URL: {{baseUrl}}/api/auth/login
Body:
{
  "username": "accountant",
  "password": "accountant123"
}
```

## Payment API Endpoints

### A. Tạo khoản nộp phí mới

**Request:**
```
Method: POST
URL: {{baseUrl}}/api/payments
Headers:
  Authorization: Bearer {{token}}
  Content-Type: application/json
Body:
{
  "householdId": 1,
  "feeTypeId": 1,
  "amountPaid": 500000,
  "paymentDate": "2024-01-15",
  "paymentMethod": "CASH",
  "notes": "Nộp phí quản lý tháng 1",
  "nguoinop": "Nguyễn Văn A"
}
```

**Tests Script:**
```javascript
pm.test("Payment created successfully", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has payment details", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('paymentId');
    pm.expect(jsonData).to.have.property('householdId');
    pm.expect(jsonData).to.have.property('feeTypeId');
    pm.expect(jsonData).to.have.property('amountPaid');
    pm.expect(jsonData).to.have.property('paymentDate');
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData.status).to.equal('ACTIVE');
});

pm.test("Amount is correct", function () {
    var jsonData = pm.response.json();
    var requestBody = JSON.parse(pm.request.body.raw);
    pm.expect(jsonData.amountPaid).to.equal(requestBody.amountPaid);
});

pm.test("Household and fee type included", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('household');
    pm.expect(jsonData).to.have.property('feeType');
});

// Save payment ID for other tests
if (pm.response.code === 201) {
    var paymentId = pm.response.json().paymentId;
    pm.environment.set("lastPaymentId", paymentId);
    console.log("Created payment ID:", paymentId);
}
```

### B. Lấy danh sách khoản nộp phí

**Request 1: Basic List**
```
Method: GET
URL: {{baseUrl}}/api/payments
Headers:
  Authorization: Bearer {{token}}
```

**Request 2: With Filters**
```
Method: GET
URL: {{baseUrl}}/api/payments
Headers:
  Authorization: Bearer {{token}}
Query Params:
  householdId: 1
  startDate: 2024-01-01
  endDate: 2024-01-31
  page: 0
  size: 10
  sortBy: ngaynop
  sortDir: desc
```

**Tests Script:**
```javascript
pm.test("Payments list retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has pagination structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('payments');
    pm.expect(jsonData).to.have.property('pagination');
    pm.expect(jsonData.pagination).to.have.property('currentPage');
    pm.expect(jsonData.pagination).to.have.property('totalPages');
    pm.expect(jsonData.pagination).to.have.property('totalItems');
    pm.expect(jsonData.pagination).to.have.property('pageSize');
});

pm.test("Payments array structure is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.payments).to.be.an('array');
    
    if (jsonData.payments.length > 0) {
        var payment = jsonData.payments[0];
        pm.expect(payment).to.have.property('id');
        pm.expect(payment).to.have.property('sotien');
        pm.expect(payment).to.have.property('ngaynop');
        pm.expect(payment).to.have.property('phuongthuc');
        pm.expect(payment).to.have.property('status');
        pm.expect(payment).to.have.property('hoKhau');
        pm.expect(payment).to.have.property('khoanThu');
    }
});

pm.test("Filters are applied correctly", function () {
    var householdId = pm.request.url.query.get('householdId');
    if (householdId) {
        var jsonData = pm.response.json();
        jsonData.payments.forEach(function(payment) {
            pm.expect(payment.hokhau_id).to.equal(parseInt(householdId));
        });
    }
});

pm.test("Sorting is applied correctly", function () {
    var sortBy = pm.request.url.query.get('sortBy') || 'ngaynop';
    var sortDir = pm.request.url.query.get('sortDir') || 'desc';
    var jsonData = pm.response.json();
    
    if (jsonData.payments.length > 1) {
        for (let i = 0; i < jsonData.payments.length - 1; i++) {
            var current = new Date(jsonData.payments[i][sortBy]);
            var next = new Date(jsonData.payments[i + 1][sortBy]);
            
            if (sortDir === 'desc') {
                pm.expect(current.getTime()).to.be.at.least(next.getTime());
            } else {
                pm.expect(current.getTime()).to.be.at.most(next.getTime());
            }
        }
    }
});

console.log("Total payments found:", pm.response.json().pagination.totalItems);
```

### C. Lấy chi tiết khoản nộp phí

**Request:**
```
Method: GET
URL: {{baseUrl}}/api/payments/{{lastPaymentId}}
Headers:
  Authorization: Bearer {{token}}
```

**Tests Script:**
```javascript
pm.test("Payment detail retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Payment detail has complete information", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('sotien');
    pm.expect(jsonData).to.have.property('ngaynop');
    pm.expect(jsonData).to.have.property('nguoinop');
    pm.expect(jsonData).to.have.property('phuongthuc');
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData).to.have.property('hoKhau');
    pm.expect(jsonData).to.have.property('khoanThu');
});

pm.test("Household information is complete", function () {
    var household = pm.response.json().hoKhau;
    pm.expect(household).to.have.property('id');
    pm.expect(household).to.have.property('diachi');
    pm.expect(household).to.have.property('chuHo');
    if (household.chuHo) {
        pm.expect(household.chuHo).to.have.property('hoten');
    }
});

pm.test("Fee type information is complete", function () {
    var feeType = pm.response.json().khoanThu;
    pm.expect(feeType).to.have.property('id');
    pm.expect(feeType).to.have.property('ten');
    pm.expect(feeType).to.have.property('mota');
    pm.expect(feeType).to.have.property('sotien');
});

console.log("Payment details:", pm.response.json());
```

### D. Cập nhật khoản nộp phí

**Request:**
```
Method: PUT
URL: {{baseUrl}}/api/payments/{{lastPaymentId}}
Headers:
  Authorization: Bearer {{token}}
  Content-Type: application/json
Body:
{
  "amountPaid": 600000,
  "paymentMethod": "BANK_TRANSFER",
  "notes": "Cập nhật phương thức thanh toán",
  "nguoinop": "Nguyễn Văn A (đã cập nhật)"
}
```

**Tests Script:**
```javascript
pm.test("Payment updated successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Updated fields are correct", function () {
    var jsonData = pm.response.json();
    var requestBody = JSON.parse(pm.request.body.raw);
    
    pm.expect(jsonData.sotien).to.equal(requestBody.amountPaid);
    pm.expect(jsonData.phuongthuc).to.equal(requestBody.paymentMethod);
    pm.expect(jsonData.ghichu).to.equal(requestBody.notes);
    pm.expect(jsonData.nguoinop).to.equal(requestBody.nguoinop);
});

pm.test("Update timestamp is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('updatedAt');
    pm.expect(new Date(jsonData.updatedAt)).to.be.a('date');
});

console.log("Payment updated:", pm.response.json());
```

### E. Xóa khoản nộp phí (Soft Delete)

**Request:**
```
Method: DELETE
URL: {{baseUrl}}/api/payments/{{lastPaymentId}}
Headers:
  Authorization: Bearer {{token}}
```

**Tests Script:**
```javascript
pm.test("Payment deleted successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Delete response is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData.message).to.include('xóa thành công');
    pm.expect(jsonData).to.have.property('paymentId');
});

console.log("Payment deleted:", pm.response.json());
```

### F. Khôi phục khoản nộp phí

**Request:**
```
Method: POST
URL: {{baseUrl}}/api/payments/{{lastPaymentId}}/restore
Headers:
  Authorization: Bearer {{token}}
```

**Tests Script:**
```javascript
pm.test("Payment restored successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Restore response is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData.message).to.include('khôi phục thành công');
    pm.expect(jsonData).to.have.property('paymentId');
});

pm.test("Payment status is ACTIVE", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData.status).to.equal('ACTIVE');
});

console.log("Payment restored:", pm.response.json());
```

### G. Thống kê khoản nộp phí

**Request:**
```
Method: GET
URL: {{baseUrl}}/api/payments/statistics
Headers:
  Authorization: Bearer {{token}}
Query Params:
  startDate: 2024-01-01
  endDate: 2024-01-31
  groupBy: month
```

**Tests Script:**
```javascript
pm.test("Payment statistics retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Statistics structure is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('summary');
    pm.expect(jsonData).to.have.property('byFeeType');
    pm.expect(jsonData).to.have.property('byPaymentMethod');
    pm.expect(jsonData).to.have.property('timeline');
});

pm.test("Summary data is valid", function () {
    var summary = pm.response.json().summary;
    pm.expect(summary).to.have.property('totalPayments');
    pm.expect(summary).to.have.property('totalAmount');
    pm.expect(summary).to.have.property('averageAmount');
    pm.expect(summary.totalPayments).to.be.a('number');
    pm.expect(summary.totalAmount).to.be.a('number');
    pm.expect(summary.averageAmount).to.be.a('number');
});

console.log("Payment statistics:", pm.response.json().summary);
```

## Error Testing

### Test Invalid Data

**Request: Invalid Household ID**
```
Method: POST
URL: {{baseUrl}}/api/payments
Body:
{
  "householdId": 99999,
  "feeTypeId": 1,
  "amountPaid": 500000
}
```

**Expected Response (404):**
```json
{
  "error": {
    "code": "HOUSEHOLD_NOT_FOUND",
    "message": "Không tìm thấy hộ khẩu"
  }
}
```

**Test Script:**
```javascript
pm.test("Invalid household returns 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Error response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('error');
    pm.expect(jsonData.error).to.have.property('code');
    pm.expect(jsonData.error).to.have.property('message');
    pm.expect(jsonData.error.code).to.equal('HOUSEHOLD_NOT_FOUND');
});
```

### Test Duplicate Payment

**Request: Duplicate Payment**
```
Method: POST
URL: {{baseUrl}}/api/payments
Body:
{
  "householdId": 1,
  "feeTypeId": 1,
  "amountPaid": 500000
}
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "PAYMENT_ALREADY_EXISTS",
    "message": "Hộ khẩu này đã nộp khoản thu này rồi",
    "existingPaymentId": 123
  }
}
```

### Test Validation Errors

**Request: Invalid Amount**
```
Method: POST
URL: {{baseUrl}}/api/payments
Body:
{
  "householdId": 1,
  "feeTypeId": 1,
  "amountPaid": -500000
}
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu đầu vào không hợp lệ",
    "details": ["amountPaid phải là số dương hợp lệ"]
  }
}
```

## Collection Setup

### Pre-request Script (Collection Level)
```javascript
// Verify environment variables
if (!pm.environment.get("baseUrl")) {
    throw new Error("baseUrl is required in environment");
}

if (!pm.environment.get("token")) {
    throw new Error("token is required in environment");
}

console.log("Testing Payment API endpoint:", pm.request.url.toString());
```

### Tests Script (Collection Level)
```javascript
// Common tests for all requests
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(3000);
});

pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

pm.test("No server errors", function () {
    pm.response.to.not.have.status(500);
});

// Log response for debugging
if (pm.response.code >= 400) {
    console.log("Error Response:", pm.response.json());
}
```

## Running the Collection

### Sequential Testing Order
1. **Create Payment** - Tạo payment mới
2. **Get Payments List** - Kiểm tra payment xuất hiện trong list
3. **Get Payment Detail** - Lấy chi tiết payment vừa tạo
4. **Update Payment** - Cập nhật thông tin
5. **Get Payment Detail** - Verify cập nhật thành công
6. **Delete Payment** - Soft delete
7. **Restore Payment** - Khôi phục
8. **Get Statistics** - Kiểm tra thống kê

### Data-Driven Testing
Tạo CSV file với test data:
```csv
householdId,feeTypeId,amountPaid,paymentMethod,notes
1,1,500000,CASH,Test payment 1
1,2,300000,BANK_TRANSFER,Test payment 2
2,1,500000,ONLINE,Test payment 3
```

Sử dụng trong Collection Runner để test với nhiều bộ dữ liệu.

## Performance Testing

### Load Testing với Newman
```bash
newman run payment-api-collection.json -e payment-env.json -n 50 --delay-request 100
```

### Monitoring Response Times
Thêm vào Tests:
```javascript
// Track performance
var responseTime = pm.response.responseTime;
console.log("Response time:", responseTime + "ms");

if (responseTime > 2000) {
    console.warn("Slow response detected:", responseTime + "ms");
}
```

Với hướng dẫn này, bạn có thể test toàn diện Payment API trong Postman! 