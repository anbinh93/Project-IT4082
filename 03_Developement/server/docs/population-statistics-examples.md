# Population Statistics API Test Examples

## Prerequisites
1. Server đang chạy trên port 8000
2. Có token authentication hợp lệ với role 'admin', 'manager', hoặc 'accountant'
3. Database đã có dữ liệu mẫu về nhân khẩu và thay đổi

## Use Cases Testing

### TT006 - Thống kê nhân khẩu theo giới tính

#### 1. Test cơ bản - Lấy thống kê theo giới tính

```bash
curl -X GET http://localhost:8000/api/statistics/population/gender \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Test với Postman

**Request:**
```
Method: GET
URL: {{baseUrl}}/api/statistics/population/gender
Headers:
  Authorization: Bearer {{token}}
```

**Test Script:**
```javascript
pm.test("Gender statistics retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('statistics');
    pm.expect(jsonData.statistics).to.have.property('total');
    pm.expect(jsonData.statistics).to.have.property('byGender');
    pm.expect(jsonData.statistics).to.have.property('chartData');
    pm.expect(jsonData).to.have.property('summary');
});

pm.test("Gender data is valid", function () {
    var stats = pm.response.json().statistics;
    pm.expect(stats.byGender).to.be.an('array');
    
    if (stats.byGender.length > 0) {
        stats.byGender.forEach(function(item) {
            pm.expect(item).to.have.property('gender');
            pm.expect(item).to.have.property('count');
            pm.expect(item).to.have.property('percentage');
            pm.expect(item.count).to.be.a('number');
            pm.expect(item.percentage).to.be.a('number');
        });
    }
});

pm.test("Chart data matches gender data", function () {
    var stats = pm.response.json().statistics;
    pm.expect(stats.chartData.length).to.equal(stats.byGender.length);
});
```

### TT007 - Thống kê nhân khẩu theo độ tuổi

#### 1. Test với nhóm tuổi mặc định

```bash
curl -X GET http://localhost:8000/api/statistics/population/age \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Test với nhóm tuổi tùy chỉnh

```bash
curl -X GET "http://localhost:8000/api/statistics/population/age?customAgeGroups=%5B%7B%22name%22%3A%22Tr%E1%BA%BB%20em%22%2C%22min%22%3A0%2C%22max%22%3A15%7D%2C%7B%22name%22%3A%22Thanh%20ni%C3%AAn%22%2C%22min%22%3A16%2C%22max%22%3A35%7D%2C%7B%22name%22%3A%22Trung%20ni%C3%AAn%22%2C%22min%22%3A36%2C%22max%22%3A60%7D%2C%7B%22name%22%3A%22Cao%20tu%E1%BB%95i%22%2C%22min%22%3A61%2C%22max%22%3A100%7D%5D" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Decoded customAgeGroups:**
```json
[
  {"name": "Trẻ em", "min": 0, "max": 15},
  {"name": "Thanh niên", "min": 16, "max": 35},
  {"name": "Trung niên", "min": 36, "max": 60},
  {"name": "Cao tuổi", "min": 61, "max": 100}
]
```

#### 3. Test với Postman

**Request 1: Default Age Groups**
```
Method: GET
URL: {{baseUrl}}/api/statistics/population/age
Headers:
  Authorization: Bearer {{token}}
```

**Request 2: Custom Age Groups**
```
Method: GET
URL: {{baseUrl}}/api/statistics/population/age
Headers:
  Authorization: Bearer {{token}}
Query Params:
  customAgeGroups: [{"name": "Trẻ em", "min": 0, "max": 15}, {"name": "Thanh niên", "min": 16, "max": 35}]
```

**Test Script:**
```javascript
pm.test("Age statistics retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Age groups data is valid", function () {
    var stats = pm.response.json().statistics;
    pm.expect(stats).to.have.property('byAgeGroup');
    pm.expect(stats.byAgeGroup).to.be.an('array');
    
    if (stats.byAgeGroup.length > 0) {
        stats.byAgeGroup.forEach(function(group) {
            pm.expect(group).to.have.property('ageGroup');
            pm.expect(group).to.have.property('minAge');
            pm.expect(group).to.have.property('maxAge');
            pm.expect(group).to.have.property('count');
            pm.expect(group).to.have.property('percentage');
            pm.expect(group.minAge).to.be.at.most(group.maxAge);
        });
    }
});

pm.test("Total percentage should be approximately 100%", function () {
    var stats = pm.response.json().statistics;
    if (stats.byAgeGroup.length > 0) {
        var totalPercentage = stats.byAgeGroup.reduce(function(sum, group) {
            return sum + group.percentage;
        }, 0);
        pm.expect(totalPercentage).to.be.closeTo(100, 1); // Allow 1% tolerance
    }
});
```

#### 4. Test lỗi nhóm tuổi không hợp lệ

```bash
curl -X GET "http://localhost:8000/api/statistics/population/age?customAgeGroups=%5B%7B%22name%22%3A%22Invalid%22%2C%22min%22%3A30%2C%22max%22%3A20%7D%5D" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "INVALID_AGE_GROUPS",
    "message": "Khoảng tuổi không hợp lệ. Tuổi bắt đầu phải nhỏ hơn hoặc bằng tuổi kết thúc."
  }
}
```

### TT008 - Thống kê biến động nhân khẩu theo khoảng thời gian

#### 1. Test với khoảng thời gian hợp lệ

```bash
curl -X GET "http://localhost:8000/api/statistics/population/movement?fromDate=2024-01-01&toDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Test với khoảng thời gian khác

```bash
curl -X GET "http://localhost:8000/api/statistics/population/movement?fromDate=2023-12-01&toDate=2023-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Test với Postman

**Request:**
```
Method: GET
URL: {{baseUrl}}/api/statistics/population/movement
Headers:
  Authorization: Bearer {{token}}
Query Params:
  fromDate: 2024-01-01
  toDate: 2024-01-31
```

**Test Script:**
```javascript
pm.test("Movement statistics retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Movement data structure is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('statistics');
    pm.expect(jsonData.statistics).to.have.property('period');
    pm.expect(jsonData.statistics).to.have.property('movements');
    pm.expect(jsonData.statistics.movements).to.have.property('moveIn');
    pm.expect(jsonData.statistics.movements).to.have.property('moveOut');
    pm.expect(jsonData.statistics.movements).to.have.property('netChange');
});

pm.test("Net change calculation is correct", function () {
    var movements = pm.response.json().statistics.movements;
    var expectedNetChange = movements.moveIn - movements.moveOut;
    pm.expect(movements.netChange).to.equal(expectedNetChange);
});

pm.test("Summary data is consistent", function () {
    var data = pm.response.json();
    var movements = data.statistics.movements;
    var summary = data.summary;
    
    pm.expect(summary.totalMovements).to.equal(movements.moveIn + movements.moveOut);
    pm.expect(summary.netPopulationChange).to.equal(movements.netChange);
    
    if (movements.netChange > 0) {
        pm.expect(summary.changeType).to.equal('Tăng');
    } else if (movements.netChange < 0) {
        pm.expect(summary.changeType).to.equal('Giảm');
    } else {
        pm.expect(summary.changeType).to.equal('Không đổi');
    }
});
```

#### 4. Test lỗi thiếu tham số

```bash
curl -X GET "http://localhost:8000/api/statistics/population/movement?fromDate=2024-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "MISSING_DATE_RANGE",
    "message": "Vui lòng cung cấp ngày bắt đầu và ngày kết thúc"
  }
}
```

#### 5. Test lỗi khoảng thời gian không hợp lệ

```bash
curl -X GET "http://localhost:8000/api/statistics/population/movement?fromDate=2024-01-31&toDate=2024-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu"
  }
}
```

### TT009 - Thống kê nhân khẩu theo tình trạng tạm trú, tạm vắng

#### 1. Test tình trạng hiện tại (mặc định)

```bash
curl -X GET http://localhost:8000/api/statistics/population/temporary-status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Test tình trạng hiện tại với chi tiết

```bash
curl -X GET "http://localhost:8000/api/statistics/population/temporary-status?includeDetails=true" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Test theo khoảng thời gian

```bash
curl -X GET "http://localhost:8000/api/statistics/population/temporary-status?mode=period&fromDate=2024-01-01&toDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Test theo khoảng thời gian với chi tiết

```bash
curl -X GET "http://localhost:8000/api/statistics/population/temporary-status?mode=period&fromDate=2024-01-01&toDate=2024-01-31&includeDetails=true" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 5. Test với Postman

**Request 1: Current Status**
```
Method: GET
URL: {{baseUrl}}/api/statistics/population/temporary-status
Headers:
  Authorization: Bearer {{token}}
```

**Request 2: Period with Details**
```
Method: GET
URL: {{baseUrl}}/api/statistics/population/temporary-status
Headers:
  Authorization: Bearer {{token}}
Query Params:
  mode: period
  fromDate: 2024-01-01
  toDate: 2024-01-31
  includeDetails: true
```

**Test Script:**
```javascript
pm.test("Temporary status statistics retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Temporary status data structure is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('statistics');
    pm.expect(jsonData.statistics).to.have.property('mode');
    pm.expect(jsonData.statistics).to.have.property('temporaryStatus');
    pm.expect(jsonData.statistics.temporaryStatus).to.have.property('temporaryResidence');
    pm.expect(jsonData.statistics.temporaryStatus).to.have.property('temporaryAbsence');
    pm.expect(jsonData.statistics.temporaryStatus).to.have.property('total');
});

pm.test("Total calculation is correct", function () {
    var tempStatus = pm.response.json().statistics.temporaryStatus;
    var expectedTotal = tempStatus.temporaryResidence + tempStatus.temporaryAbsence;
    pm.expect(tempStatus.total).to.equal(expectedTotal);
});

pm.test("Chart data percentages are correct", function () {
    var stats = pm.response.json().statistics;
    if (stats.temporaryStatus.total > 0) {
        pm.expect(stats).to.have.property('chartData');
        pm.expect(stats.chartData).to.be.an('array');
        
        var totalPercentage = stats.chartData.reduce(function(sum, item) {
            return sum + parseFloat(item.percentage);
        }, 0);
        pm.expect(totalPercentage).to.be.closeTo(100, 1);
    }
});

pm.test("Details included when requested", function () {
    var includeDetails = pm.request.url.query.get('includeDetails');
    var jsonData = pm.response.json();
    
    if (includeDetails === 'true') {
        pm.expect(jsonData).to.have.property('details');
        if (jsonData.details) {
            pm.expect(jsonData.details).to.have.property('temporaryResidence');
            pm.expect(jsonData.details).to.have.property('temporaryAbsence');
        }
    }
});
```

## Tổng quan thống kê nhân khẩu

### Test Population Overview

```bash
curl -X GET http://localhost:8000/api/statistics/population/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Test Script:**
```javascript
pm.test("Population overview retrieved successfully", function () {
    pm.response.to.have.status(200);
});

pm.test("Overview contains all sections", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('overview');
    pm.expect(jsonData.overview).to.have.property('gender');
    pm.expect(jsonData.overview).to.have.property('age');
    pm.expect(jsonData.overview).to.have.property('temporaryStatus');
    pm.expect(jsonData).to.have.property('availableReports');
});

pm.test("Available reports are complete", function () {
    var reports = pm.response.json().availableReports;
    pm.expect(reports).to.be.an('array');
    pm.expect(reports.length).to.be.at.least(4);
    
    var expectedReports = ['gender-statistics', 'age-statistics', 'movement-statistics', 'temporary-status'];
    var reportIds = reports.map(r => r.id);
    
    expectedReports.forEach(function(expectedId) {
        pm.expect(reportIds).to.include(expectedId);
    });
});
```

## Performance Testing

### Load Test cho Gender Statistics

```bash
# Using Apache Bench
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
   http://localhost:8000/api/statistics/population/gender

# Using curl with time measurement
time curl -X GET http://localhost:8000/api/statistics/population/gender \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Concurrent Testing

```bash
# Test multiple endpoints simultaneously
curl -X GET http://localhost:8000/api/statistics/population/gender \
  -H "Authorization: Bearer YOUR_TOKEN" &

curl -X GET http://localhost:8000/api/statistics/population/age \
  -H "Authorization: Bearer YOUR_TOKEN" &

curl -X GET "http://localhost:8000/api/statistics/population/movement?fromDate=2024-01-01&toDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN" &

curl -X GET http://localhost:8000/api/statistics/population/temporary-status \
  -H "Authorization: Bearer YOUR_TOKEN" &

wait
```

## Integration Testing Checklist

### TT006 - Thống kê theo giới tính
- [ ] ✅ API trả về đúng cấu trúc dữ liệu
- [ ] ✅ Tính toán tỷ lệ phần trăm chính xác
- [ ] ✅ Chart data khớp với dữ liệu thống kê
- [ ] ✅ Xử lý trường hợp không có dữ liệu
- [ ] ✅ Response time < 2 giây

### TT007 - Thống kê theo độ tuổi
- [ ] ✅ Nhóm tuổi mặc định hoạt động đúng
- [ ] ✅ Nhóm tuổi tùy chỉnh hoạt động đúng
- [ ] ✅ Validation nhóm tuổi không hợp lệ
- [ ] ✅ Tính toán tuổi chính xác
- [ ] ✅ Tổng tỷ lệ phần trăm = 100%

### TT008 - Thống kê biến động
- [ ] ✅ Validation khoảng thời gian
- [ ] ✅ Tính toán biến động ròng chính xác
- [ ] ✅ Phân loại loại biến động đúng
- [ ] ✅ Xử lý trường hợp không có biến động
- [ ] ✅ Breakdown dữ liệu chi tiết

### TT009 - Thống kê tạm trú/tạm vắng
- [ ] ✅ Mode hiện tại hoạt động đúng
- [ ] ✅ Mode theo khoảng thời gian hoạt động đúng
- [ ] ✅ Include details hoạt động đúng
- [ ] ✅ Chart data tính toán chính xác
- [ ] ✅ Xử lý trường hợp không có dữ liệu

## Error Handling Testing

### Test Unauthorized Access

```bash
curl -X GET http://localhost:8000/api/statistics/population/gender \
  -H "Authorization: Bearer invalid_token"
```

### Test Missing Token

```bash
curl -X GET http://localhost:8000/api/statistics/population/gender
```

### Test Wrong Role

```bash
# Assuming you have a token with wrong role
curl -X GET http://localhost:8000/api/statistics/population/gender \
  -H "Authorization: Bearer WRONG_ROLE_TOKEN"
```

## Database State Testing

### Test với database trống

1. Backup dữ liệu hiện tại
2. Clear tables: `nhankhau`, `thaydoi`
3. Run tests - should return appropriate "no data" messages
4. Restore dữ liệu

### Test với dữ liệu edge cases

1. Nhân khẩu không có ngày sinh
2. Thay đổi không có ngày kết thúc
3. Dữ liệu với ngày trong tương lai
4. Dữ liệu với ngày rất cũ

## Automation Testing Script

```bash
#!/bin/bash

# Population Statistics API Test Suite
BASE_URL="http://localhost:8000"
TOKEN="YOUR_TOKEN_HERE"

echo "Testing Population Statistics API..."

# Test TT006 - Gender Statistics
echo "Testing TT006 - Gender Statistics..."
curl -s -X GET "$BASE_URL/api/statistics/population/gender" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test TT007 - Age Statistics
echo "Testing TT007 - Age Statistics..."
curl -s -X GET "$BASE_URL/api/statistics/population/age" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test TT008 - Movement Statistics
echo "Testing TT008 - Movement Statistics..."
curl -s -X GET "$BASE_URL/api/statistics/population/movement?fromDate=2024-01-01&toDate=2024-01-31" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test TT009 - Temporary Status
echo "Testing TT009 - Temporary Status..."
curl -s -X GET "$BASE_URL/api/statistics/population/temporary-status" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test Overview
echo "Testing Population Overview..."
curl -s -X GET "$BASE_URL/api/statistics/population/overview" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "All tests completed!"
``` 