# 🚀 Hướng Dẫn Sử Dụng Test Suite API Quản Lý Hộ Khẩu

## 🎯 Tổng Quan

Bộ test suite này được thiết kế để kiểm tra toàn diện các API liên quan đến quản lý hộ khẩu trong hệ thống quản lý chung cư. Test suite bao gồm 4 modules chính với 50+ test cases.

## 📁 Cấu Trúc Files

```
04_Testing/
├── 🏠 test-household-management-api.js      # Test CRUD hộ khẩu cơ bản
├── 👥 test-household-member-api.js          # Test quản lý thành viên  
├── 💰 test-household-fee-api.js             # Test quản lý phí
├── 🏢 test-household-housing-api.js         # Test phân bổ nhà ở
├── 📊 test-household-comprehensive.js       # Chạy tất cả test
├── 🔧 run-household-tests.sh               # Script shell tiện lợi
├── 📚 household-api-test-documentation.md   # Tài liệu chi tiết
├── 📊 test-results-report.md               # Báo cáo kết quả
└── 📖 quick-start-guide.md                 # File này
```

## ⚡ Quick Start

### 1. Kiểm Tra Môi Trường
```bash
# Đảm bảo server đang chạy
curl http://localhost:8000/api/auth/login

# Kiểm tra Node.js
node --version
```

### 2. Chạy Test Nhanh
```bash
# Di chuyển vào thư mục test
cd /Users/nguyenbinhan/Workspace/Project-IT4082/04_Testing

# Chạy script interactive (KHUYẾN NGHỊ)
./run-household-tests.sh

# Hoặc chạy trực tiếp test tổng hợp
node test-household-comprehensive.js
```

### 3. Chạy Test Riêng Lẻ
```bash
# Test quản lý hộ khẩu cơ bản (14 test cases)
node test-household-management-api.js

# Test quản lý thành viên (14 test cases) 
node test-household-member-api.js

# Test quản lý phí (9 test cases)
node test-household-fee-api.js

# Test quản lý nhà ở (13 test cases)
node test-household-housing-api.js
```

## 📊 Hiểu Kết Quả Test

### Format Kết Quả
```
✅ Test Name - PASSED
❌ Test Name - FAILED
   Details: Mô tả lỗi chi tiết
```

### Ý Nghĩa Status Codes
- **✅ PASSED**: Test thành công, API hoạt động đúng
- **❌ FAILED**: Test thất bại, cần kiểm tra API

### Tóm Tắt Cuối Test
```
📊 TEST SUMMARY
===============
Total Tests: 50
Passed: 28 ✅  
Failed: 22 ❌
Success Rate: 56.00%
```

## 🔧 Troubleshooting

### Lỗi Thường Gặp

#### 1. "Authentication failed"
```bash
❌ Authentication failed: Request failed with status code 500
```
**Nguyên nhân**: Server không chạy hoặc database có vấn đề  
**Giải pháp**: 
```bash
# Kiểm tra server
curl http://localhost:8000/health

# Restart server nếu cần
cd ../03_Developement/server
npm start
```

#### 2. "No test data available"
```bash
❌ Dashboard tests: No fee collection period available
```
**Nguyên nhân**: Database thiếu dữ liệu test  
**Giải pháp**:
```bash
# Chạy seed data
cd ../03_Developement/server
npm run seed
```

#### 3. "Server error" (500)
```bash
❌ Search households: Lỗi server khi lấy danh sách hộ khẩu
```
**Nguyên nhân**: Lỗi logic trong API  
**Giải pháp**: Kiểm tra server logs và debug API

#### 4. "Unexpected status: 403"
```bash
❌ Unauthorized access: Unexpected status: 403
```
**Nguyên nhân**: Role-based permissions  
**Giải pháp**: Kiểm tra user role và permissions

### Debug Mode

Để debug chi tiết hơn, thêm logs:
```javascript
// Trong test file, uncomment:
console.log('Request:', requestData);
console.log('Response:', response.data);
console.log('Error:', error.response?.data);
```

## 📋 Checklist Trước Khi Test

### ✅ Chuẩn Bị Môi Trường
- [ ] Server backend đang chạy (port 8000)
- [ ] Database có dữ liệu cơ bản
- [ ] Tài khoản admin hoạt động (`admin`/`admin123`)
- [ ] Node.js version >= 14

### ✅ Data Requirements
- [ ] Có ít nhất 1 đợt thu phí
- [ ] Có ít nhất 2-3 residents
- [ ] Có ít nhất 2 households  
- [ ] Có ít nhất 1 room/apartment

### ✅ API Endpoints Hoạt Động
- [ ] `POST /api/auth/login` - Authentication
- [ ] `GET /api/households` - Household listing
- [ ] `GET /api/residents` - Resident listing
- [ ] `GET /api/dot-thu` - Fee periods

## 📈 Phân Tích Kết Quả

### Success Rate Benchmarks
- **90-100%**: Excellent - API production ready
- **75-89%**: Good - Minor issues to fix
- **60-74%**: Fair - Several issues need attention  
- **< 60%**: Poor - Major issues require fixes

### Ưu Tiên Fix Theo Module
1. **🏠 Household Management** (64% pass) - Core functionality
2. **👥 Member Management** (79% pass) - Business logic
3. **🏢 Housing Management** (46% pass) - Integration issues
4. **💰 Fee Management** (22% pass) - Data dependencies

## 🎨 Tùy Chỉnh Test

### Thêm Test Case Mới
```javascript
// Trong test file phù hợp
async testNewFeature() {
  console.log('\n🆕 Testing New Feature...');
  
  try {
    const response = await axios.get(`${API_BASE}/new-endpoint`, {
      headers: this.getAuthHeaders()
    });
    
    const success = response.status === 200;
    await this.logTestResult('New feature test', success);
  } catch (error) {
    await this.logTestResult('New feature test', false, error.message);
  }
}

// Thêm vào runAllTests()
await this.testNewFeature();
```

### Thay Đổi Test Data
```javascript
// Sửa trong constructor hoặc setup()
this.testData = {
  username: 'your-test-user',
  password: 'your-test-password',
  apiBase: 'http://your-server:port/api'
};
```

### Custom Assertions
```javascript
// Thêm validation logic
const validateHouseholdStructure = (household) => {
  return household.id && 
         household.maHoKhau && 
         household.diaChi &&
         Array.isArray(household.thanhVien);
};

const success = response.status === 200 && 
               validateHouseholdStructure(response.data.data);
```

## 📊 Monitoring & Reporting

### Chạy Test Định Kỳ
```bash
# Tạo cron job chạy test hàng ngày
# Thêm vào crontab:
0 2 * * * cd /path/to/tests && node test-household-comprehensive.js >> test-log.txt 2>&1
```

### Export Kết Quả
```javascript
// Trong test-household-comprehensive.js, uncomment:
const fs = require('fs');
const reportPath = `./test-report-${Date.now()}.json`;
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
```

### Tích Hợp CI/CD
```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
    - run: npm install
    - run: npm start &
    - run: sleep 10
    - run: cd 04_Testing && node test-household-comprehensive.js
```

## 🔮 Next Steps

### Nâng Cao Test Suite
1. **Performance Testing**: Đo response time, load testing
2. **Security Testing**: Authentication, authorization, injection
3. **Integration Testing**: Cross-module functionality
4. **E2E Testing**: Full user workflow simulation

### Automation
1. **Auto Test Data Generation**: Dynamic test data creation
2. **Auto Report Generation**: HTML reports, dashboards
3. **Auto Issue Detection**: AI-powered issue analysis
4. **Auto Regression Testing**: Detect breaking changes

## 💡 Tips & Best Practices

### 🎯 Test Writing
- ✅ Test một chức năng cụ thể mỗi test case
- ✅ Sử dụng tên test mô tả rõ ràng
- ✅ Cleanup test data sau khi test
- ✅ Handle cả positive và negative scenarios

### 🔧 Debugging
- ✅ Log request/response chi tiết
- ✅ Use descriptive error messages
- ✅ Test isolation - mỗi test độc lập
- ✅ Reproducible test results

### 📊 Reporting  
- ✅ Clear pass/fail indicators
- ✅ Detailed failure reasons
- ✅ Performance metrics
- ✅ Trend analysis over time

## 📞 Support

### Khi Cần Hỗ Trợ
1. **Đọc documentation** chi tiết
2. **Check server logs** để hiểu lỗi
3. **Review test results** để tìm pattern
4. **Contact team** nếu vẫn có vấn đề

### Báo Cáo Issues
Include thông tin:
- Test command đã chạy
- Full error log
- Environment details (OS, Node version)
- Expected vs actual behavior

---

**🎉 Happy Testing!** Test suite này sẽ giúp đảm bảo quality và reliability của API quản lý hộ khẩu.
