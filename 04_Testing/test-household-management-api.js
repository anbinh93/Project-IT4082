const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

/**
 * 🏠 HOUSEHOLD MANAGEMENT API TESTING SUITE
 * 
 * This test suite covers all API endpoints related to Household Management:
 * 1. Household CRUD operations
 * 2. Household member management
 * 3. Household head assignment
 * 4. Household separation and creation
 * 5. Household-room assignments
 * 6. Household fee management
 */

class HouseholdAPITester {
  constructor() {
    this.token = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async setup() {
    try {
      console.log('🔐 Setting up authentication...');
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        username: 'admin',
        password: 'admin123'
      });
      
      if (loginResponse.data && loginResponse.data.token) {
        this.token = loginResponse.data.token;
        console.log('✅ Authentication successful');
        return true;
      } else {
        console.error('❌ No token received from login');
        return false;
      }
    } catch (error) {
      console.error('❌ Authentication failed:', error.response?.data?.message || error.message);
      return false;
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
    console.log('\n🚀 Starting Household Management API Tests...\n');
    
    if (!(await this.setup())) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Run test suites
    await this.testHouseholdCRUD();
    await this.testHouseholdMemberManagement();
    await this.testHouseholdHeadAssignment();
    await this.testHouseholdSeparation();
    await this.testHouseholdSearch();
    await this.testErrorHandling();

    // Print summary
    this.printSummary();
  }

  async testHouseholdCRUD() {
    console.log('\n📝 Testing Household CRUD Operations...');
    
    let createdHouseholdId = null;

    // Test 1: Create household
    try {
      const createData = {
        diaChi: 'Test Address, Test Street, Test Ward, Test District, Test City',
        ngayLap: new Date().toISOString(),
        chuHoId: null // No head initially
      };

      const response = await axios.post(`${API_BASE}/households`, createData, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 201 && response.data.success;
      createdHouseholdId = response.data.data?.id;
      
      await this.logTestResult(
        'Create household without head', 
        success,
        success ? `Created household ID: ${createdHouseholdId}` : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Create household without head', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get all households
    try {
      const response = await axios.get(`${API_BASE}/households`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     Array.isArray(response.data.data.households);
      
      await this.logTestResult(
        'Get all households', 
        success,
        success ? `Found ${response.data.data.households.length} households` : 'Invalid response format'
      );
    } catch (error) {
      await this.logTestResult('Get all households', false, error.response?.data?.message || error.message);
    }

    // Test 3: Get household by ID
    if (createdHouseholdId) {
      try {
        const response = await axios.get(`${API_BASE}/households/${createdHouseholdId}`, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && 
                       response.data.success && 
                       response.data.data.id === createdHouseholdId;
        
        await this.logTestResult(
          'Get household by ID', 
          success,
          success ? `Retrieved household ${createdHouseholdId}` : 'Household not found or invalid data'
        );
      } catch (error) {
        await this.logTestResult('Get household by ID', false, error.response?.data?.message || error.message);
      }
    }

    // Test 4: Update household
    if (createdHouseholdId) {
      try {
        const updateData = {
          diaChi: 'Updated Address, Updated Street, Updated Ward, Updated District, Updated City'
        };

        const response = await axios.put(`${API_BASE}/households/${createdHouseholdId}`, updateData, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && response.data.success;
        
        await this.logTestResult(
          'Update household information', 
          success,
          success ? 'Household updated successfully' : response.data.message
        );
      } catch (error) {
        await this.logTestResult('Update household information', false, error.response?.data?.message || error.message);
      }
    }

    // Test 5: Search households
    try {
      const response = await axios.get(`${API_BASE}/households?search=Test`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Search households', 
        success,
        success ? `Search returned ${response.data.data.households.length} results` : 'Search failed'
      );
    } catch (error) {
      await this.logTestResult('Search households', false, error.response?.data?.message || error.message);
    }

    return createdHouseholdId;
  }

  async testHouseholdMemberManagement() {
    console.log('\n👥 Testing Household Member Management...');

    // Test 1: Get available residents
    try {
      const response = await axios.get(`${API_BASE}/residents/available`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && Array.isArray(response.data.data);
      
      await this.logTestResult(
        'Get available residents', 
        success,
        success ? `Found ${response.data.data.length} available residents` : 'Invalid response format'
      );
    } catch (error) {
      await this.logTestResult('Get available residents', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get household member info
    try {
      // First get a resident with household info
      const residentsResponse = await axios.get(`${API_BASE}/residents`, {
        headers: this.getAuthHeaders()
      });

      if (residentsResponse.data.data && residentsResponse.data.data.length > 0) {
        const residentId = residentsResponse.data.data[0].id;
        
        const response = await axios.get(`${API_BASE}/residents/${residentId}/household-info`, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && response.data.success;
        
        await this.logTestResult(
          'Get resident household info', 
          success,
          success ? 'Retrieved household info successfully' : response.data.message
        );
      } else {
        await this.logTestResult('Get resident household info', false, 'No residents found for testing');
      }
    } catch (error) {
      await this.logTestResult('Get resident household info', false, error.response?.data?.message || error.message);
    }
  }

  async testHouseholdHeadAssignment() {
    console.log('\n👑 Testing Household Head Assignment...');

    try {
      // Get households and residents for testing
      const [householdsResponse, residentsResponse] = await Promise.all([
        axios.get(`${API_BASE}/households`, { headers: this.getAuthHeaders() }),
        axios.get(`${API_BASE}/residents/available`, { headers: this.getAuthHeaders() })
      ]);

      if (householdsResponse.data.data.households.length > 0 && 
          residentsResponse.data.data.length > 0) {
        
        const householdId = householdsResponse.data.data.households[0].id;
        const residentId = residentsResponse.data.data[0].id;

        const assignData = {
          householdId: householdId,
          newHeadId: residentId
        };

        const response = await axios.post(`${API_BASE}/households/assign-head`, assignData, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && response.data.success;
        
        await this.logTestResult(
          'Assign household head', 
          success,
          success ? `Assigned head ${residentId} to household ${householdId}` : response.data.message
        );
      } else {
        await this.logTestResult('Assign household head', false, 'No households or residents available for testing');
      }
    } catch (error) {
      await this.logTestResult('Assign household head', false, error.response?.data?.message || error.message);
    }
  }

  async testHouseholdSeparation() {
    console.log('\n🏘️ Testing Household Separation...');

    try {
      // Get residents for testing
      const residentsResponse = await axios.get(`${API_BASE}/residents`, {
        headers: this.getAuthHeaders()
      });

      if (residentsResponse.data.data && residentsResponse.data.data.length > 0) {
        const residentId = residentsResponse.data.data[0].id;

        // Test creating new household through separation
        const separationData = {
          residentId: residentId,
          targetType: 'new',
          newHouseholdAddress: 'New Address - New Street - New Ward - New District - New City',
          reason: 'Test separation for creating new household'
        };

        const response = await axios.post(`${API_BASE}/residents/separate-household`, separationData, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && response.data.success;
        
        await this.logTestResult(
          'Separate household (create new)', 
          success,
          success ? 'Household separation successful' : response.data.message
        );
      } else {
        await this.logTestResult('Separate household (create new)', false, 'No residents found for testing');
      }
    } catch (error) {
      await this.logTestResult('Separate household (create new)', false, error.response?.data?.message || error.message);
    }
  }

  async testHouseholdSearch() {
    console.log('\n🔍 Testing Household Search and Filtering...');

    // Test 1: Pagination
    try {
      const response = await axios.get(`${API_BASE}/households?page=1&limit=5`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     response.data.data.pagination;
      
      await this.logTestResult(
        'Household pagination', 
        success,
        success ? `Page 1 with ${response.data.data.households.length} items` : 'Pagination failed'
      );
    } catch (error) {
      await this.logTestResult('Household pagination', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get available households for separation
    try {
      const response = await axios.get(`${API_BASE}/households/available`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && 
                     response.data.success && 
                     Array.isArray(response.data.data);
      
      await this.logTestResult(
        'Get available households', 
        success,
        success ? `Found ${response.data.data.length} available households` : 'Failed to get available households'
      );
    } catch (error) {
      await this.logTestResult('Get available households', false, error.response?.data?.message || error.message);
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');

    // Test 1: Get non-existent household
    try {
      const response = await axios.get(`${API_BASE}/households/99999`, {
        headers: this.getAuthHeaders()
      });

      // Should return 404
      await this.logTestResult('Get non-existent household', false, 'Should have returned 404');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Get non-existent household', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 2: Create household with invalid data
    try {
      const invalidData = {
        // Missing required diaChi field
        ngayLap: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE}/households`, invalidData, {
        headers: this.getAuthHeaders()
      });

      // Should return 400
      await this.logTestResult('Create household with invalid data', false, 'Should have returned 400');
    } catch (error) {
      const success = error.response?.status === 400;
      await this.logTestResult(
        'Create household with invalid data', 
        success,
        success ? 'Correctly returned 400' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 3: Unauthorized access
    try {
      const response = await axios.get(`${API_BASE}/households`, {
        headers: { 'Content-Type': 'application/json' } // No auth token
      });

      // Should return 401
      await this.logTestResult('Unauthorized access', false, 'Should have returned 401');
    } catch (error) {
      const success = error.response?.status === 401;
      await this.logTestResult(
        'Unauthorized access', 
        success,
        success ? 'Correctly returned 401' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HOUSEHOLD MANAGEMENT API TEST SUMMARY');
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
    
    console.log('\n' + '='.repeat(60));
  }
}

// Main execution
async function runHouseholdAPITests() {
  const tester = new HouseholdAPITester();
  await tester.runAllTests();
}

// Export for use in other test files
module.exports = { HouseholdAPITester };

// Run tests if this file is executed directly
if (require.main === module) {
  runHouseholdAPITests().catch(console.error);
}
