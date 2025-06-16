const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

/**
 * 💰 HOUSEHOLD FEE MANAGEMENT API TESTING SUITE
 * 
 * This test suite covers household fee related endpoints:
 * 1. Fee collection period management
 * 2. Household fee queries and filtering
 * 3. Payment status updates
 * 4. Fee calculation and recalculation
 * 5. Dashboard statistics
 * 6. Fee collection reporting
 */

class HouseholdFeeAPITester {
  constructor() {
    this.token = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.testData = {
      dotThuId: null,
      khoanThuId: null,
      hoKhauId: null,
      householdFeeId: null
    };
  }

  async setup() {
    try {
      console.log('🔐 Setting up authentication...');
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        username: 'admin',
        password: 'admin123'
      });
      
      this.token = loginResponse.data.token;
      console.log('✅ Authentication successful');
      
      // Get test data
      await this.loadTestData();
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      return false;
    }
  }

  async loadTestData() {
    try {
      // Get available fee collection periods
      const dotThuResponse = await axios.get(`${API_BASE}/dot-thu`, {
        headers: this.getAuthHeaders()
      });

      if (dotThuResponse.data.success && dotThuResponse.data.data.length > 0) {
        this.testData.dotThuId = dotThuResponse.data.data[0].id;
        console.log(`📅 Using fee collection period: ${this.testData.dotThuId}`);
      }

      // Get available households
      const householdsResponse = await axios.get(`${API_BASE}/households`, {
        headers: this.getAuthHeaders()
      });

      if (householdsResponse.data.success && householdsResponse.data.data.households.length > 0) {
        this.testData.hoKhauId = householdsResponse.data.data.households[0].id;
        console.log(`🏠 Using household: ${this.testData.hoKhauId}`);
      }

    } catch (error) {
      console.log('⚠️ Could not load all test data, some tests may be skipped');
    }
  }

  async logTestResult(testName, passed, details = null) {
    this.testResults.total++;
    if (passed) {
      this.testResults.passed++;
      console.log(`✅ ${testName}`);
    } else {
      this.testResults.failed++;
      console.log(`❌ ${testName}`);
      if (details) {
        console.log(`   Details: ${details}`);
      }
    }
    
    this.testResults.details.push({
      name: testName,
      passed,
      details
    });
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async runAllTests() {
    console.log('\n🚀 Starting Household Fee Management API Tests...\n');
    
    if (!(await this.setup())) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Run test suites
    await this.testFeeCollectionDashboard();
    await this.testHouseholdFeeQueries();
    await this.testPaymentStatusUpdate();
    await this.testFeeCalculation();
    await this.testHouseholdsByFeeType();
    await this.testFeeStatistics();
    await this.testErrorHandling();

    // Print summary
    this.printSummary();
  }

  async testFeeCollectionDashboard() {
    console.log('\n📊 Testing Fee Collection Dashboard...');

    if (!this.testData.dotThuId) {
      await this.logTestResult('Dashboard tests', false, 'No fee collection period available');
      return;
    }

    // Test 1: Get dashboard by collection period
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dashboard/${this.testData.dotThuId}`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     response.data.data.dotThu &&
                     response.data.data.tongKet;
      
      await this.logTestResult(
        'Get fee collection dashboard', 
        success,
        success ? `Dashboard loaded for period ${this.testData.dotThuId}` : 'Invalid dashboard response'
      );
    } catch (error) {
      await this.logTestResult('Get fee collection dashboard', false, error.response?.data?.message || error.message);
    }

    // Test 2: Dashboard with invalid period
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dashboard/99999`, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Dashboard with invalid period', false, 'Should have returned 404');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Dashboard with invalid period', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  async testHouseholdFeeQueries() {
    console.log('\n🔍 Testing Household Fee Queries...');

    if (!this.testData.dotThuId) {
      await this.logTestResult('Fee query tests', false, 'No fee collection period available');
      return;
    }

    // Test 1: Get household fees by collection period
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dot-thu/${this.testData.dotThuId}`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     Array.isArray(response.data.data);
      
      if (success && response.data.data.length > 0) {
        this.testData.householdFeeId = response.data.data[0].id;
        this.testData.khoanThuId = response.data.data[0].khoanThu?.id;
      }

      await this.logTestResult(
        'Get household fees by period', 
        success,
        success ? `Found ${response.data.data.length} household fees` : 'Invalid response format'
      );
    } catch (error) {
      await this.logTestResult('Get household fees by period', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get fees with pagination
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dot-thu/${this.testData.dotThuId}?page=0&size=5`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     response.data.pagination;
      
      await this.logTestResult(
        'Get fees with pagination', 
        success,
        success ? `Page 0 with ${response.data.data.length} items` : 'Pagination failed'
      );
    } catch (error) {
      await this.logTestResult('Get fees with pagination', false, error.response?.data?.message || error.message);
    }

    // Test 3: Get fees with status filter
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dot-thu/${this.testData.dotThuId}?trangThai=chua_nop`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Get fees with status filter', 
        success,
        success ? 'Successfully filtered by status' : 'Status filter failed'
      );
    } catch (error) {
      await this.logTestResult('Get fees with status filter', false, error.response?.data?.message || error.message);
    }

    // Test 4: Get fees by household
    if (this.testData.hoKhauId) {
      try {
        const response = await axios.get(`${API_BASE}/household-fees/ho-khau/${this.testData.hoKhauId}/dot-thu/${this.testData.dotThuId}`, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && 
                       response.data.success && 
                       Array.isArray(response.data.data);
        
        await this.logTestResult(
          'Get fees by household', 
          success,
          success ? `Found ${response.data.data.length} fees for household` : 'Failed to get household fees'
        );
      } catch (error) {
        await this.logTestResult('Get fees by household', false, error.response?.data?.message || error.message);
      }
    }
  }

  async testPaymentStatusUpdate() {
    console.log('\n💳 Testing Payment Status Update...');

    if (!this.testData.householdFeeId) {
      await this.logTestResult('Payment update tests', false, 'No household fee ID available for testing');
      return;
    }

    // Test 1: Update payment status
    try {
      const paymentData = {
        soTienThanhToan: 50000,
        ghiChu: 'Test payment update'
      };

      const response = await axios.put(`${API_BASE}/household-fees/${this.testData.householdFeeId}/payment`, paymentData, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Update payment status', 
        success,
        success ? 'Payment status updated successfully' : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Update payment status', false, error.response?.data?.message || error.message);
    }

    // Test 2: Update with invalid amount
    try {
      const invalidPaymentData = {
        soTienThanhToan: -1000, // Negative amount
        ghiChu: 'Test negative payment'
      };

      const response = await axios.put(`${API_BASE}/household-fees/${this.testData.householdFeeId}/payment`, invalidPaymentData, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Update with negative amount', false, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 400;
      await this.logTestResult(
        'Update with negative amount', 
        success,
        success ? 'Correctly rejected negative amount' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 3: Update non-existent fee
    try {
      const paymentData = {
        soTienThanhToan: 10000,
        ghiChu: 'Test payment for non-existent fee'
      };

      const response = await axios.put(`${API_BASE}/household-fees/99999/payment`, paymentData, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Update non-existent fee', false, 'Should have returned 404');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Update non-existent fee', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  async testFeeCalculation() {
    console.log('\n🧮 Testing Fee Calculation...');

    if (!this.testData.dotThuId || !this.testData.hoKhauId || !this.testData.khoanThuId) {
      await this.logTestResult('Fee calculation tests', false, 'Missing test data for fee calculation');
      return;
    }

    // Test 1: Recalculate fee for household
    try {
      const response = await axios.put(`${API_BASE}/household-fees/recalculate/${this.testData.dotThuId}/${this.testData.hoKhauId}/${this.testData.khoanThuId}`, {}, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Recalculate household fee', 
        success,
        success ? 'Fee recalculated successfully' : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Recalculate household fee', false, error.response?.data?.message || error.message);
    }

    // Test 2: Recalculate with invalid data
    try {
      const response = await axios.put(`${API_BASE}/household-fees/recalculate/99999/99999/99999`, {}, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Recalculate with invalid data', false, 'Should have returned 404');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Recalculate with invalid data', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  async testHouseholdsByFeeType() {
    console.log('\n🏠 Testing Households by Fee Type...');

    if (!this.testData.dotThuId || !this.testData.khoanThuId) {
      await this.logTestResult('Households by fee type tests', false, 'Missing test data');
      return;
    }

    // Test 1: Get households by fee type
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dot-thu/${this.testData.dotThuId}/khoan-thu/${this.testData.khoanThuId}/households`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     response.data.data.households;
      
      await this.logTestResult(
        'Get households by fee type', 
        success,
        success ? `Found ${response.data.data.households.length} households` : 'Invalid response format'
      );
    } catch (error) {
      await this.logTestResult('Get households by fee type', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get households with pagination
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dot-thu/${this.testData.dotThuId}/khoan-thu/${this.testData.khoanThuId}/households?page=0&size=5`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     response.data.pagination;
      
      await this.logTestResult(
        'Get households with pagination', 
        success,
        success ? 'Pagination working correctly' : 'Pagination failed'
      );
    } catch (error) {
      await this.logTestResult('Get households with pagination', false, error.response?.data?.message || error.message);
    }

    // Test 3: Get households with status filter
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dot-thu/${this.testData.dotThuId}/khoan-thu/${this.testData.khoanThuId}/households?trangThai=da_nop_du`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Get households with status filter', 
        success,
        success ? 'Status filter working' : 'Status filter failed'
      );
    } catch (error) {
      await this.logTestResult('Get households with status filter', false, error.response?.data?.message || error.message);
    }
  }

  async testFeeStatistics() {
    console.log('\n📈 Testing Fee Statistics...');

    if (!this.testData.dotThuId) {
      await this.logTestResult('Fee statistics tests', false, 'No fee collection period available');
      return;
    }

    // Test 1: Get collection period statistics
    try {
      const response = await axios.get(`${API_BASE}/dot-thu/statistics`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && Array.isArray(response.data.data);
      
      await this.logTestResult(
        'Get collection period statistics', 
        success,
        success ? 'Statistics retrieved successfully' : 'Invalid statistics format'
      );
    } catch (error) {
      await this.logTestResult('Get collection period statistics', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get payment statistics for specific period
    try {
      const response = await axios.get(`${API_BASE}/dot-thu/${this.testData.dotThuId}/payment-statistics`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Get payment statistics', 
        success,
        success ? 'Payment statistics retrieved' : 'Failed to get payment statistics'
      );
    } catch (error) {
      await this.logTestResult('Get payment statistics', false, error.response?.data?.message || error.message);
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');

    // Test 1: Access without authentication
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dashboard/1`, {
        headers: { 'Content-Type': 'application/json' } // No auth token
      });

      await this.logTestResult('Access without authentication', false, 'Should have returned 401');
    } catch (error) {
      const success = error.response?.status === 401;
      await this.logTestResult(
        'Access without authentication', 
        success,
        success ? 'Correctly returned 401' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 2: Invalid endpoints
    try {
      const response = await axios.get(`${API_BASE}/household-fees/invalid-endpoint`, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Access invalid endpoint', false, 'Should have returned 404');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Access invalid endpoint', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 3: Invalid parameters
    try {
      const response = await axios.get(`${API_BASE}/household-fees/dot-thu/invalid`, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Invalid parameter types', false, 'Should have returned 400 or 500');
    } catch (error) {
      const success = error.response?.status === 400 || error.response?.status === 500;
      await this.logTestResult(
        'Invalid parameter types', 
        success,
        success ? 'Correctly handled invalid parameters' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HOUSEHOLD FEE MANAGEMENT API TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`Passed: ${this.testResults.passed} ✅`);
    console.log(`Failed: ${this.testResults.failed} ❌`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(2)}%`);
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.details
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.details}`);
        });
    }

    console.log('\n📋 Test Coverage Summary:');
    console.log('   • Fee Collection Dashboard ✓');
    console.log('   • Household Fee Queries ✓');
    console.log('   • Payment Status Updates ✓');
    console.log('   • Fee Calculation & Recalculation ✓');
    console.log('   • Households by Fee Type ✓');
    console.log('   • Fee Statistics ✓');
    console.log('   • Error Handling ✓');
    
    console.log('\n' + '='.repeat(60));
  }
}

// Main execution
async function runHouseholdFeeAPITests() {
  const tester = new HouseholdFeeAPITester();
  await tester.runAllTests();
}

// Export for use in other test files
module.exports = { HouseholdFeeAPITester };

// Run tests if this file is executed directly
if (require.main === module) {
  runHouseholdFeeAPITests().catch(console.error);
}
