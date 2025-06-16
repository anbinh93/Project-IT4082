# 🏠 Household Management API Testing Documentation

## 📋 Overview

This document provides comprehensive documentation for the Household Management API testing suite. The test suite covers all aspects of household management functionality including CRUD operations, member management, fee collection, and housing assignments.

## 🎯 Test Objectives

### Primary Objectives
- Validate all household management API endpoints
- Ensure data integrity and business rule compliance
- Test error handling and edge cases
- Verify authentication and authorization
- Validate response formats and status codes

### Coverage Areas
1. **Household CRUD Operations**
2. **Member Management**
3. **Fee Collection & Payment**
4. **Housing Assignment**
5. **Search & Filtering**
6. **Statistics & Reporting**
7. **Error Handling**

## 📁 Test Suite Structure

```
04_Testing/
├── test-household-management-api.js      # Core household CRUD operations
├── test-household-member-api.js          # Member management & separation
├── test-household-fee-api.js             # Fee collection & payment
├── test-household-housing-api.js         # Room & apartment assignment
├── test-household-comprehensive.js      # Master test runner
└── household-api-test-documentation.md  # This documentation
```

## 🧪 Test Cases Detail

### 1. Household Management API Tests (`test-household-management-api.js`)

#### Test Categories:
- **Household CRUD Operations**
- **Household Search and Filtering**
- **Household Head Assignment**
- **Error Handling**

#### Specific Test Cases:

##### 1.1 Create Household
```javascript
// Test: Create household without head
POST /api/households
{
  "diaChi": "Test Address, Test Street, Test Ward, Test District, Test City",
  "ngayLap": "2024-01-01T00:00:00.000Z",
  "chuHoId": null
}
Expected: 201 Created
```

##### 1.2 Get All Households
```javascript
// Test: Get all households with pagination
GET /api/households?page=1&limit=10
Expected: 200 OK with household list and pagination info
```

##### 1.3 Get Household by ID
```javascript
// Test: Get specific household details
GET /api/households/{id}
Expected: 200 OK with household details including members
```

##### 1.4 Update Household
```javascript
// Test: Update household information
PUT /api/households/{id}
{
  "diaChi": "Updated Address"
}
Expected: 200 OK with updated data
```

##### 1.5 Search Households
```javascript
// Test: Search households by keyword
GET /api/households?search=Test
Expected: 200 OK with filtered results
```

### 2. Household Member Management Tests (`test-household-member-api.js`)

#### Test Categories:
- **Adding Members to Households**
- **Household Separation (Tách hộ)**
- **Member Relationship Management**
- **Change History Tracking**

#### Specific Test Cases:

##### 2.1 Add Member to Household
```javascript
// Test: Add resident to household
POST /api/residents/add-to-household
{
  "residentId": 1,
  "householdId": 1,
  "quanHeVoiChuHo": "con",
  "ngayThem": "2024-01-01T00:00:00.000Z"
}
Expected: 200 OK with membership confirmation
```

##### 2.2 Household Separation - Create New
```javascript
// Test: Separate resident to new household
POST /api/residents/separate-household
{
  "residentId": 1,
  "targetType": "new",
  "newHouseholdAddress": "New Address - Street - Ward - District - City",
  "reason": "Test separation"
}
Expected: 200 OK with new household creation
```

##### 2.3 Household Separation - Move to Existing
```javascript
// Test: Move resident to existing household
POST /api/residents/separate-household
{
  "residentId": 1,
  "targetType": "existing",
  "targetHouseholdId": 2,
  "quanHeVoiChuHoMoi": "khác",
  "reason": "Test move"
}
Expected: 200 OK with successful transfer
```

##### 2.4 Remove from Household
```javascript
// Test: Remove resident from household
POST /api/residents/separate-household
{
  "residentId": 1,
  "targetType": "remove",
  "reason": "Test removal"
}
Expected: 200 OK with removal confirmation
```

### 3. Household Fee Management Tests (`test-household-fee-api.js`)

#### Test Categories:
- **Fee Collection Dashboard**
- **Payment Status Updates**
- **Fee Calculation & Recalculation**
- **Fee Statistics & Reporting**

#### Specific Test Cases:

##### 3.1 Get Fee Collection Dashboard
```javascript
// Test: Get dashboard for fee collection period
GET /api/household-fees/dashboard/{dotThuId}
Expected: 200 OK with dashboard statistics
```

##### 3.2 Get Household Fees by Period
```javascript
// Test: Get all household fees for a collection period
GET /api/household-fees/dot-thu/{dotThuId}
Expected: 200 OK with fee list and pagination
```

##### 3.3 Update Payment Status
```javascript
// Test: Update payment for household fee
PUT /api/household-fees/{feeId}/payment
{
  "soTienThanhToan": 50000,
  "ghiChu": "Test payment"
}
Expected: 200 OK with updated payment status
```

##### 3.4 Recalculate Fee
```javascript
// Test: Recalculate fee for specific household
PUT /api/household-fees/recalculate/{dotThuId}/{hoKhauId}/{khoanThuId}
Expected: 200 OK with recalculated fee amount
```

##### 3.5 Get Households by Fee Type
```javascript
// Test: Get households for specific fee type
GET /api/household-fees/dot-thu/{dotThuId}/khoan-thu/{khoanThuId}/households
Expected: 200 OK with household list for fee type
```

### 4. Household Housing Management Tests (`test-household-housing-api.js`)

#### Test Categories:
- **Room-Household Assignment**
- **Apartment-Household Assignment**
- **Housing Availability Queries**
- **Housing Statistics**

#### Specific Test Cases:

##### 4.1 Assign Room to Household
```javascript
// Test: Assign room to household
POST /api/rooms/{roomId}/assign
{
  "hoKhauId": 1,
  "ngayBatDau": "2024-01-01T00:00:00.000Z"
}
Expected: 200 OK with room assignment confirmation
```

##### 4.2 Release Room from Household
```javascript
// Test: Release room from household
POST /api/rooms/{roomId}/release
Expected: 200 OK with release confirmation
```

##### 4.3 Assign Apartment to Household
```javascript
// Test: Assign apartment to household
POST /api/canho/assign
{
  "apartmentId": 1,
  "hoKhauId": 1
}
Expected: 200 OK with apartment assignment
```

##### 4.4 Remove Household from Apartment
```javascript
// Test: Remove household from apartment
PUT /api/canho/{apartmentId}/remove-hokhau
Expected: 200 OK with removal confirmation
```

##### 4.5 Get Available Housing
```javascript
// Test: Get available rooms
GET /api/rooms?trangThai=trong
Expected: 200 OK with available room list

// Test: Get available apartments
GET /api/canho?trangThai=trong
Expected: 200 OK with available apartment list
```

## 🔧 Running the Tests

### Prerequisites
1. Backend server running on `http://localhost:8000`
2. Database with test data
3. Valid admin credentials (`admin`/`admin123`)

### Running Individual Test Suites

```bash
# Run household management tests
node test-household-management-api.js

# Run member management tests
node test-household-member-api.js

# Run fee management tests
node test-household-fee-api.js

# Run housing management tests
node test-household-housing-api.js
```

### Running Comprehensive Test Suite

```bash
# Run all tests together
node test-household-comprehensive.js
```

## 📊 Test Results Format

### Individual Test Result
```javascript
{
  name: "Test Name",
  passed: true/false,
  details: "Additional information or error message"
}
```

### Suite Summary
```javascript
{
  passed: 15,
  failed: 2,
  total: 17,
  details: [/* individual test results */]
}
```

### Comprehensive Report
```javascript
{
  testRun: {
    date: "2024-01-01T00:00:00.000Z",
    environment: "development",
    apiBaseUrl: "http://localhost:8000/api"
  },
  summary: {
    totalSuites: 4,
    passedSuites: 3,
    failedSuites: 1,
    totalTests: 50,
    passedTests: 45,
    failedTests: 5,
    successRate: "90.00"
  },
  suites: [/* individual suite results */]
}
```

## ⚡ Error Scenarios Tested

### 1. Authentication Errors
- Missing authentication token (401)
- Invalid authentication token (401)
- Insufficient permissions (403)

### 2. Validation Errors
- Missing required fields (400)
- Invalid data types (400)
- Business rule violations (400)

### 3. Resource Not Found
- Non-existent household ID (404)
- Non-existent resident ID (404)
- Non-existent fee collection period (404)

### 4. Business Logic Violations
- Adding resident to multiple households
- Assigning room to multiple households
- Head of household constraints
- Payment amount validation

### 5. Server Errors
- Database connection issues (500)
- Internal server errors (500)

## 🎯 Test Coverage

### API Endpoints Covered

#### Household Management
- ✅ `GET /api/households` - Get all households
- ✅ `GET /api/households/{id}` - Get household by ID
- ✅ `POST /api/households` - Create household
- ✅ `PUT /api/households/{id}` - Update household
- ✅ `GET /api/households/available` - Get available households
- ✅ `POST /api/households/assign-head` - Assign household head

#### Member Management
- ✅ `GET /api/residents/available` - Get available residents
- ✅ `GET /api/residents/{id}/household-info` - Get resident household info
- ✅ `POST /api/residents/add-to-household` - Add member to household
- ✅ `POST /api/residents/separate-household` - Household separation
- ✅ `GET /api/residents/household-changes` - Get change history

#### Fee Management
- ✅ `GET /api/household-fees/dashboard/{dotThuId}` - Fee dashboard
- ✅ `GET /api/household-fees/dot-thu/{dotThuId}` - Get fees by period
- ✅ `PUT /api/household-fees/{id}/payment` - Update payment
- ✅ `PUT /api/household-fees/recalculate/{dotThuId}/{hoKhauId}/{khoanThuId}` - Recalculate fee
- ✅ `GET /api/household-fees/dot-thu/{dotThuId}/khoan-thu/{khoanThuId}/households` - Get households by fee

#### Housing Management
- ✅ `POST /api/rooms/{id}/assign` - Assign room
- ✅ `POST /api/rooms/{id}/release` - Release room
- ✅ `POST /api/canho/assign` - Assign apartment
- ✅ `PUT /api/canho/{id}/remove-hokhau` - Remove from apartment
- ✅ `GET /api/rooms/statistics` - Room statistics
- ✅ `GET /api/canho/statistics` - Apartment statistics

## 📈 Performance Considerations

### Response Time Expectations
- Simple GET requests: < 200ms
- Complex queries with joins: < 500ms
- Update operations: < 300ms
- Bulk operations: < 1000ms

### Load Testing (Future Enhancement)
- Concurrent user simulation
- Database performance under load
- Memory usage monitoring
- Response time degradation analysis

## 🔮 Future Enhancements

### Additional Test Scenarios
1. **Concurrency Testing**
   - Multiple users modifying same household
   - Race condition handling
   - Database transaction integrity

2. **Data Migration Testing**
   - Household data import/export
   - Data format validation
   - Backup and restore procedures

3. **Integration Testing**
   - Cross-module functionality
   - External system integration
   - API versioning compatibility

4. **Security Testing**
   - SQL injection prevention
   - XSS attack prevention
   - Data encryption validation

### Test Infrastructure Improvements
1. **Automated Test Execution**
   - CI/CD pipeline integration
   - Scheduled test runs
   - Automatic reporting

2. **Test Data Management**
   - Dynamic test data generation
   - Test data cleanup automation
   - Environment-specific configurations

3. **Enhanced Reporting**
   - HTML test reports
   - Performance metrics
   - Trend analysis

## 📞 Support and Maintenance

### Test Maintenance Guidelines
1. Update tests when API changes
2. Add new tests for new features
3. Review and update test data regularly
4. Monitor test execution performance

### Troubleshooting Common Issues
1. **Authentication Failures**: Check token validity and server status
2. **Network Timeouts**: Verify server accessibility and response times
3. **Test Data Issues**: Ensure test database is properly seeded
4. **Environment Differences**: Verify configuration matches target environment

## 📝 Conclusion

This comprehensive test suite provides thorough coverage of the Household Management API functionality. Regular execution of these tests ensures API reliability, data integrity, and proper error handling. The modular structure allows for easy maintenance and extension as new features are added to the system.

For questions or issues with the test suite, please refer to the development team or create an issue in the project repository.
