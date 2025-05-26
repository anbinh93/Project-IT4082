# Statistics API Test Examples

## Prerequisites
1. Server đang chạy trên port 8000
2. Có token authentication hợp lệ với role 'admin', 'manager', hoặc 'accountant'
3. Database đã có dữ liệu mẫu

## Use Case KT006 - Truy cập chức năng Thống kê

### 1. Đăng nhập để lấy token (với role phù hợp)

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "password": "password"
  }'
```

### 2. Lấy tổng quan thống kê (Main Dashboard - KT006)

```bash
curl -X GET http://localhost:8000/api/statistics/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Lấy danh sách báo cáo có sẵn

```bash
curl -X GET http://localhost:8000/api/statistics/reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Test với Postman cho KT006

### Collection Setup cho Statistics
1. Tạo collection mới: "Statistics API - KT006"
2. Sử dụng environment variable:
   - `baseUrl`: http://localhost:8000
   - `token`: (token của user có role admin/manager/accountant)

### Request 1: Statistics Overview (KT006 Main)
```
Method: GET
URL: {{baseUrl}}/api/statistics/overview
Headers:
  Authorization: Bearer {{token}}
```

**Test Script**:
```javascript
pm.test("Statistics overview loaded successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Overview has required sections", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('overview');
    pm.expect(jsonData).to.have.property('availableReports');
    
    // Check overview sections
    pm.expect(jsonData.overview).to.have.property('population');
    pm.expect(jsonData.overview).to.have.property('feeCollection');
    pm.expect(jsonData.overview).to.have.property('households');
    pm.expect(jsonData.overview).to.have.property('recentActivities');
});

pm.test("Population stats are complete", function () {
    var population = pm.response.json().overview.population;
    pm.expect(population).to.have.property('total');
    pm.expect(population).to.have.property('byGender');
    pm.expect(population).to.have.property('byAgeGroup');
    pm.expect(population.byGender).to.be.an('array');
    pm.expect(population.byAgeGroup).to.be.an('array');
});

pm.test("Fee collection stats are complete", function () {
    var feeCollection = pm.response.json().overview.feeCollection;
    pm.expect(feeCollection).to.have.property('yearly');
    pm.expect(feeCollection).to.have.property('monthly');
    pm.expect(feeCollection).to.have.property('activeFeeTypes');
    pm.expect(feeCollection.yearly).to.have.property('total');
    pm.expect(feeCollection.yearly).to.have.property('transactions');
});

pm.test("Available reports are provided", function () {
    var reports = pm.response.json().availableReports;
    pm.expect(reports).to.have.property('population');
    pm.expect(reports).to.have.property('feeCollection');
    pm.expect(reports).to.have.property('households');
    pm.expect(reports).to.have.property('temporaryResidence');
});
```

### Request 2: Available Reports List
```
Method: GET
URL: {{baseUrl}}/api/statistics/reports
Headers:
  Authorization: Bearer {{token}}
```

**Test Script**:
```javascript
pm.test("Reports list retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Reports structure is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('reports');
    pm.expect(jsonData).to.have.property('categories');
    pm.expect(jsonData.reports).to.be.an('array');
    pm.expect(jsonData.categories).to.be.an('array');
});

pm.test("Each report has required fields", function () {
    var reports = pm.response.json().reports;
    reports.forEach(function(report) {
        pm.expect(report).to.have.property('id');
        pm.expect(report).to.have.property('title');
        pm.expect(report).to.have.property('category');
        pm.expect(report).to.have.property('description');
        pm.expect(report).to.have.property('endpoint');
    });
});

pm.test("Categories have required fields", function () {
    var categories = pm.response.json().categories;
    categories.forEach(function(category) {
        pm.expect(category).to.have.property('id');
        pm.expect(category).to.have.property('name');
        pm.expect(category).to.have.property('icon');
    });
});
```

### Request 3: Test Unauthorized Access
```
Method: GET
URL: {{baseUrl}}/api/statistics/overview
Headers:
  Authorization: Bearer invalid_token
```

**Test Script**:
```javascript
pm.test("Unauthorized access rejected", function () {
    pm.response.to.have.status(401);
});

pm.test("Error response format is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('error');
    pm.expect(jsonData.error).to.have.property('code');
    pm.expect(jsonData.error).to.have.property('message');
});
```

## Expected Responses

### Successful Statistics Overview (200)
```json
{
  "overview": {
    "population": {
      "total": 1250,
      "byGender": [
        {"gender": "Nam", "count": 630},
        {"gender": "Nữ", "count": 620}
      ],
      "byAgeGroup": [
        {"ageGroup": "Dưới 18", "count": 280},
        {"ageGroup": "18-60", "count": 820},
        {"ageGroup": "Trên 60", "count": 150}
      ]
    },
    "feeCollection": {
      "yearly": {"total": 150000000, "transactions": 450},
      "monthly": {"total": 12500000, "transactions": 38},
      "activeFeeTypes": 5
    },
    "households": {
      "total": 320,
      "byDistrict": [
        {"district": "Ba Đình", "count": 85},
        {"district": "Hoàn Kiếm", "count": 72}
      ],
      "bySizeGroup": [
        {"sizeGroup": "2-4 người", "count": 180},
        {"sizeGroup": "1 người", "count": 65}
      ]
    },
    "recentActivities": {
      "recentPayments": [...],
      "recentHouseholds": [...]
    }
  },
  "availableReports": {
    "population": {
      "title": "Thống kê Nhân khẩu",
      "description": "Báo cáo về dân số, độ tuổi, giới tính, nghề nghiệp",
      "endpoint": "/api/statistics/population",
      "icon": "users"
    },
    "feeCollection": {
      "title": "Thống kê Thu phí",
      "description": "Báo cáo về các khoản thu, tình hình nộp phí", 
      "endpoint": "/api/statistics/fee-collection",
      "icon": "dollar-sign"
    },
    "households": {
      "title": "Thống kê Hộ khẩu",
      "description": "Báo cáo về số lượng hộ khẩu, phân bố địa lý",
      "endpoint": "/api/statistics/households",
      "icon": "home"
    },
    "temporaryResidence": {
      "title": "Thống kê Tạm trú/Tạm vắng",
      "description": "Báo cáo về tình hình tạm trú, tạm vắng",
      "endpoint": "/api/statistics/temporary-residence",
      "icon": "map-pin"
    }
  }
}
```

### Successful Reports List (200)
```json
{
  "reports": [
    {
      "id": "population-overview",
      "title": "Tổng quan Nhân khẩu",
      "category": "population",
      "description": "Thống kê tổng quan về dân số trong khu vực",
      "endpoint": "/api/statistics/population/overview"
    }
    // ... more reports
  ],
  "categories": [
    {
      "id": "population",
      "name": "Nhân khẩu", 
      "icon": "users"
    }
    // ... more categories
  ]
}
```

## Performance Testing

### Load Test for Statistics Overview
```bash
# Using Apache Bench
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
   http://localhost:8000/api/statistics/overview

# Using curl with time measurement
time curl -X GET http://localhost:8000/api/statistics/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## KT006 Use Case Testing Checklist

- [ ] ✅ BQT có thể đăng nhập với role phù hợp
- [ ] ✅ Giao diện tổng quan hiển thị đầy đủ thông tin
- [ ] ✅ Thống kê nhân khẩu hiển thị chính xác
- [ ] ✅ Thống kê thu phí hiển thị chính xác  
- [ ] ✅ Thống kê hộ khẩu hiển thị chính xác
- [ ] ✅ Hoạt động gần đây được hiển thị
- [ ] ✅ Danh sách báo cáo có sẵn được hiển thị
- [ ] ✅ Mỗi báo cáo có đầy đủ thông tin (title, description, endpoint)
- [ ] ✅ API trả về lỗi phù hợp khi không có quyền
- [ ] ✅ API hoạt động nhanh và ổn định

## Integration Testing

### Frontend Integration Test Flow
1. **Login** với role admin/manager/accountant
2. **Navigate** đến trang thống kê
3. **Verify** giao diện tổng quan load thành công
4. **Check** tất cả số liệu hiển thị đúng
5. **Verify** các nút báo cáo hoạt động
6. **Test** navigation đến báo cáo chi tiết

### Backend Integration Test
```javascript
// Jest test example
describe('KT006 - Statistics Overview', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login and get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password' });
    authToken = loginResponse.body.token;
  });

  test('should return statistics overview for authorized user', async () => {
    const response = await request(app)
      .get('/api/statistics/overview')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('overview');
    expect(response.body).toHaveProperty('availableReports');
    expect(response.body.overview).toHaveProperty('population');
    expect(response.body.overview).toHaveProperty('feeCollection');
  });

  test('should reject unauthorized access', async () => {
    await request(app)
      .get('/api/statistics/overview')
      .expect(401);
  });
});
``` 