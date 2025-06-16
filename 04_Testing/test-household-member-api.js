const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

/**
 * 👥 HOUSEHOLD MEMBER MANAGEMENT API TESTING SUITE
 * 
 * This test suite focuses on household member operations:
 * 1. Adding residents to households
 * 2. Removing residents from households
 * 3. Household separation (tách hộ)
 * 4. Member relationship management
 * 5. Household change history
 */

class HouseholdMemberAPITester {
  constructor() {
    this.token = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.testData = {
      createdResidents: [],
      createdHouseholds: [],
      testMemberships: []
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
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
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

  async createTestResident(name, cccd) {
    try {
      const residentData = {
        hoTen: name,
        cccd: cccd,
        ngaySinh: '1990-01-01',
        gioiTinh: 'Nam',
        danToc: 'Kinh',
        ngheNghiep: 'Test Job',
        noiCap: 'Test Location',
        ngayCap: '2020-01-01'
      };

      const response = await axios.post(`${API_BASE}/residents`, residentData, {
        headers: this.getAuthHeaders()
      });

      if (response.status === 201 && response.data.success) {
        this.testData.createdResidents.push(response.data.data.id);
        return response.data.data.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to create test resident:', error.response?.data?.message || error.message);
      return null;
    }
  }

  async createTestHousehold(address) {
    try {
      const householdData = {
        diaChi: address,
        ngayLap: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE}/households`, householdData, {
        headers: this.getAuthHeaders()
      });

      if (response.status === 201 && response.data.success) {
        this.testData.createdHouseholds.push(response.data.data.id);
        return response.data.data.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to create test household:', error.response?.data?.message || error.message);
      return null;
    }
  }

  async runAllTests() {
    console.log('\n🚀 Starting Household Member Management API Tests...\n');
    
    if (!(await this.setup())) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Create test data
    await this.setupTestData();

    // Run test suites
    await this.testAddMemberToHousehold();
    await this.testResidentHouseholdInfo();
    await this.testHouseholdSeparationScenarios();
    await this.testMemberRelationshipManagement();
    await this.testHouseholdChangeHistory();
    await this.testEdgeCases();

    // Cleanup test data
    await this.cleanup();

    // Print summary
    this.printSummary();
  }

  async setupTestData() {
    console.log('\n🏗️ Setting up test data...');

    // Create test residents
    const resident1 = await this.createTestResident('Test Resident 1', '123456789001');
    const resident2 = await this.createTestResident('Test Resident 2', '123456789002');
    const resident3 = await this.createTestResident('Test Resident 3', '123456789003');

    // Create test households
    const household1 = await this.createTestHousehold('Test Address 1, Test Street, Test Ward, Test District, Test City');
    const household2 = await this.createTestHousehold('Test Address 2, Test Street, Test Ward, Test District, Test City');

    console.log(`✅ Created ${this.testData.createdResidents.length} test residents and ${this.testData.createdHouseholds.length} test households`);
  }

  async testAddMemberToHousehold() {
    console.log('\n👥 Testing Add Member to Household...');

    if (this.testData.createdResidents.length === 0 || this.testData.createdHouseholds.length === 0) {
      await this.logTestResult('Add member to household', false, 'No test data available');
      return;
    }

    const residentId = this.testData.createdResidents[0];
    const householdId = this.testData.createdHouseholds[0];

    // Test 1: Add resident to household
    try {
      const membershipData = {
        residentId: residentId,
        householdId: householdId,
        quanHeVoiChuHo: 'con',
        ngayThem: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE}/residents/add-to-household`, membershipData, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      if (success) {
        this.testData.testMemberships.push({ residentId, householdId });
      }

      await this.logTestResult(
        'Add resident to household', 
        success,
        success ? `Added resident ${residentId} to household ${householdId}` : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Add resident to household', false, error.response?.data?.message || error.message);
    }

    // Test 2: Try to add same resident to another household (should fail)
    if (this.testData.createdHouseholds.length > 1) {
      try {
        const duplicateData = {
          residentId: residentId,
          householdId: this.testData.createdHouseholds[1],
          quanHeVoiChuHo: 'khác',
          ngayThem: new Date().toISOString()
        };

        const response = await axios.post(`${API_BASE}/residents/add-to-household`, duplicateData, {
          headers: this.getAuthHeaders()
        });

        // Should fail
        await this.logTestResult('Add resident to multiple households', false, 'Should have failed but succeeded');
      } catch (error) {
        const success = error.response?.status === 400;
        await this.logTestResult(
          'Add resident to multiple households', 
          success,
          success ? 'Correctly prevented duplicate membership' : `Unexpected error: ${error.response?.data?.message}`
        );
      }
    }

    // Test 3: Add non-existent resident
    try {
      const invalidData = {
        residentId: 99999,
        householdId: householdId,
        quanHeVoiChuHo: 'khác',
        ngayThem: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE}/residents/add-to-household`, invalidData, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Add non-existent resident', false, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Add non-existent resident', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  async testResidentHouseholdInfo() {
    console.log('\n🏠 Testing Resident Household Info...');

    if (this.testData.createdResidents.length === 0) {
      await this.logTestResult('Get resident household info', false, 'No test residents available');
      return;
    }

    const residentId = this.testData.createdResidents[0];

    // Test 1: Get household info for resident
    try {
      const response = await axios.get(`${API_BASE}/residents/${residentId}/household-info`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Get resident household info', 
        success,
        success ? 'Retrieved household info successfully' : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Get resident household info', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get household info for non-existent resident
    try {
      const response = await axios.get(`${API_BASE}/residents/99999/household-info`, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Get info for non-existent resident', false, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Get info for non-existent resident', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  async testHouseholdSeparationScenarios() {
    console.log('\n🏘️ Testing Household Separation Scenarios...');

    if (this.testData.createdResidents.length < 2) {
      await this.logTestResult('Household separation tests', false, 'Need at least 2 test residents');
      return;
    }

    const residentId = this.testData.createdResidents[1]; // Use second resident

    // Test 1: Separate to new household
    try {
      const separationData = {
        residentId: residentId,
        targetType: 'new',
        newHouseholdAddress: 'Separated Address - New Street - New Ward - New District - New City',
        reason: 'Test separation to create new household'
      };

      const response = await axios.post(`${API_BASE}/residents/separate-household`, separationData, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.success;
      
      await this.logTestResult(
        'Separate to new household', 
        success,
        success ? 'Successfully created new household' : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Separate to new household', false, error.response?.data?.message || error.message);
    }

    // Test 2: Separate to existing household
    if (this.testData.createdHouseholds.length > 1 && this.testData.createdResidents.length > 2) {
      try {
        const residentId2 = this.testData.createdResidents[2];
        const targetHouseholdId = this.testData.createdHouseholds[1];

        const separationData = {
          residentId: residentId2,
          targetType: 'existing',
          targetHouseholdId: targetHouseholdId,
          quanHeVoiChuHoMoi: 'khác',
          reason: 'Test separation to existing household'
        };

        const response = await axios.post(`${API_BASE}/residents/separate-household`, separationData, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && response.data.success;
        
        await this.logTestResult(
          'Separate to existing household', 
          success,
          success ? 'Successfully moved to existing household' : response.data.message
        );
      } catch (error) {
        await this.logTestResult('Separate to existing household', false, error.response?.data?.message || error.message);
      }
    }

    // Test 3: Remove from household
    try {
      // First, add a resident to household for testing removal
      if (this.testData.createdResidents.length > 0 && this.testData.createdHouseholds.length > 0) {
        const testResidentId = this.testData.createdResidents[0];

        const removeData = {
          residentId: testResidentId,
          targetType: 'remove',
          reason: 'Test removal from household'
        };

        const response = await axios.post(`${API_BASE}/residents/separate-household`, removeData, {
          headers: this.getAuthHeaders()
        });

        const success = response.status === 200 && response.data.success;
        
        await this.logTestResult(
          'Remove from household', 
          success,
          success ? 'Successfully removed from household' : response.data.message
        );
      }
    } catch (error) {
      await this.logTestResult('Remove from household', false, error.response?.data?.message || error.message);
    }
  }

  async testMemberRelationshipManagement() {
    console.log('\n👨‍👩‍👧‍👦 Testing Member Relationship Management...');

    if (this.testData.createdHouseholds.length === 0 || this.testData.createdResidents.length === 0) {
      await this.logTestResult('Assign household head', false, 'No test data available');
      return;
    }

    // Test 1: Assign household head
    try {
      const householdId = this.testData.createdHouseholds[0];
      const residentId = this.testData.createdResidents[0];

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
    } catch (error) {
      await this.logTestResult('Assign household head', false, error.response?.data?.message || error.message);
    }

    // Test 2: Try to assign non-existent resident as head
    try {
      const householdId = this.testData.createdHouseholds[0];

      const invalidData = {
        householdId: householdId,
        newHeadId: 99999
      };

      const response = await axios.post(`${API_BASE}/households/assign-head`, invalidData, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Assign non-existent head', false, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Assign non-existent head', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  async testHouseholdChangeHistory() {
    console.log('\n📜 Testing Household Change History...');

    // Test 1: Get household change history
    try {
      const response = await axios.get(`${API_BASE}/residents/household-changes`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && Array.isArray(response.data.data);
      
      await this.logTestResult(
        'Get household change history', 
        success,
        success ? `Retrieved ${response.data.data.length} history records` : 'Invalid response format'
      );
    } catch (error) {
      await this.logTestResult('Get household change history', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get history with pagination
    try {
      const response = await axios.get(`${API_BASE}/residents/household-changes?page=1&limit=5`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200;
      
      await this.logTestResult(
        'Get paginated history', 
        success,
        success ? 'Successfully retrieved paginated history' : 'Failed to get paginated history'
      );
    } catch (error) {
      await this.logTestResult('Get paginated history', false, error.response?.data?.message || error.message);
    }
  }

  async testEdgeCases() {
    console.log('\n⚠️ Testing Edge Cases...');

    // Test 1: Add resident with missing data
    try {
      const incompleteData = {
        residentId: this.testData.createdResidents[0],
        householdId: this.testData.createdHouseholds[0]
        // Missing quanHeVoiChuHo and ngayThem
      };

      const response = await axios.post(`${API_BASE}/residents/add-to-household`, incompleteData, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Add member with incomplete data', false, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 400;
      await this.logTestResult(
        'Add member with incomplete data', 
        success,
        success ? 'Correctly returned 400' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 2: Separate household with missing reason
    try {
      const incompleteData = {
        residentId: this.testData.createdResidents[0],
        targetType: 'new',
        newHouseholdAddress: 'Some address'
        // Missing reason
      };

      const response = await axios.post(`${API_BASE}/residents/separate-household`, incompleteData, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Separate without reason', false, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 400;
      await this.logTestResult(
        'Separate without reason', 
        success,
        success ? 'Correctly returned 400' : `Unexpected status: ${error.response?.status}`
      );
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up test data...');

    // Note: In a real scenario, you might want to clean up created test data
    // For now, we'll just log what would be cleaned up
    console.log(`Would clean up ${this.testData.createdResidents.length} test residents`);
    console.log(`Would clean up ${this.testData.createdHouseholds.length} test households`);
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HOUSEHOLD MEMBER MANAGEMENT API TEST SUMMARY');
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
async function runHouseholdMemberAPITests() {
  const tester = new HouseholdMemberAPITester();
  await tester.runAllTests();
}

// Export for use in other test files
module.exports = { HouseholdMemberAPITester };

// Run tests if this file is executed directly
if (require.main === module) {
  runHouseholdMemberAPITests().catch(console.error);
}
