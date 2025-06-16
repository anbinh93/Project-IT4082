const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

/**
 * 🏢 HOUSEHOLD ROOM & APARTMENT MANAGEMENT API TESTING SUITE
 * 
 * This test suite covers room and apartment management related to households:
 * 1. Room-household assignment and release
 * 2. Apartment-household assignment and removal  
 * 3. Room and apartment availability checks
 * 4. Household housing status management
 * 5. Housing statistics and reporting
 */

class HouseholdHousingAPITester {
  constructor() {
    this.token = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.testData = {
      roomId: null,
      apartmentId: null,
      hoKhauId: null,
      createdRooms: [],
      createdApartments: []
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
      
      // Load test data
      await this.loadTestData();
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      return false;
    }
  }

  async loadTestData() {
    try {
      // Get available rooms
      const roomsResponse = await axios.get(`${API_BASE}/rooms`, {
        headers: this.getAuthHeaders()
      });

      if (roomsResponse.data && roomsResponse.data.length > 0) {
        this.testData.roomId = roomsResponse.data[0].id;
        console.log(`🏠 Using room: ${this.testData.roomId}`);
      }

      // Get available apartments
      const apartmentsResponse = await axios.get(`${API_BASE}/canho`, {
        headers: this.getAuthHeaders()
      });

      if (apartmentsResponse.data && apartmentsResponse.data.length > 0) {
        this.testData.apartmentId = apartmentsResponse.data[0].id;
        console.log(`🏢 Using apartment: ${this.testData.apartmentId}`);
      }

      // Get available households
      const householdsResponse = await axios.get(`${API_BASE}/households`, {
        headers: this.getAuthHeaders()
      });

      if (householdsResponse.data.success && householdsResponse.data.data.households.length > 0) {
        this.testData.hoKhauId = householdsResponse.data.data.households[0].id;
        console.log(`👨‍👩‍👧‍👦 Using household: ${this.testData.hoKhauId}`);
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

  async createTestRoom(roomNumber) {
    try {
      const roomData = {
        soPhong: roomNumber,
        loaiPhong: 'Standard',
        dienTich: 50,
        giaThue: 5000000,
        trangThai: 'trong'
      };

      const response = await axios.post(`${API_BASE}/rooms`, roomData, {
        headers: this.getAuthHeaders()
      });

      if (response.status === 201 && response.data.id) {
        this.testData.createdRooms.push(response.data.id);
        return response.data.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to create test room:', error.response?.data?.message || error.message);
      return null;
    }
  }

  async createTestApartment(apartmentNumber) {
    try {
      const apartmentData = {
        soPhong: apartmentNumber,
        dienTich: 75,
        soPhongNgu: 2,
        soPhongTam: 1,
        giaThue: 8000000,
        trangThai: 'trong'
      };

      const response = await axios.post(`${API_BASE}/canho`, apartmentData, {
        headers: this.getAuthHeaders()
      });

      if (response.status === 201 && response.data.id) {
        this.testData.createdApartments.push(response.data.id);
        return response.data.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to create test apartment:', error.response?.data?.message || error.message);
      return null;
    }
  }

  async runAllTests() {
    console.log('\n🚀 Starting Household Housing Management API Tests...\n');
    
    if (!(await this.setup())) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Create test housing units
    await this.setupTestHousing();

    // Run test suites
    await this.testRoomHouseholdAssignment();
    await this.testApartmentHouseholdAssignment();
    await this.testHousingAvailability();
    await this.testHousingStatistics();
    await this.testHousingConstraints();
    await this.testErrorHandling();

    // Cleanup
    await this.cleanup();

    // Print summary
    this.printSummary();
  }

  async setupTestHousing() {
    console.log('\n🏗️ Setting up test housing units...');

    // Create test room
    const testRoom = await this.createTestRoom('TEST001');
    if (testRoom) {
      this.testData.roomId = testRoom;
    }

    // Create test apartment
    const testApartment = await this.createTestApartment('TESTA01');
    if (testApartment) {
      this.testData.apartmentId = testApartment;
    }

    console.log(`✅ Created ${this.testData.createdRooms.length} test rooms and ${this.testData.createdApartments.length} test apartments`);
  }

  async testRoomHouseholdAssignment() {
    console.log('\n🏠 Testing Room-Household Assignment...');

    if (!this.testData.roomId || !this.testData.hoKhauId) {
      await this.logTestResult('Room assignment tests', false, 'Missing room or household data');
      return;
    }

    // Test 1: Assign room to household
    try {
      const assignmentData = {
        hoKhauId: this.testData.hoKhauId,
        ngayBatDau: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE}/rooms/${this.testData.roomId}/assign`, assignmentData, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.room;
      
      await this.logTestResult(
        'Assign room to household', 
        success,
        success ? `Room ${this.testData.roomId} assigned to household ${this.testData.hoKhauId}` : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Assign room to household', false, error.response?.data?.message || error.message);
    }

    // Test 2: Try to assign already assigned room to another household
    if (this.testData.createdRooms.length > 1) {
      try {
        const duplicateData = {
          hoKhauId: this.testData.hoKhauId,
          ngayBatDau: new Date().toISOString()
        };

        const response = await axios.post(`${API_BASE}/rooms/${this.testData.roomId}/assign`, duplicateData, {
          headers: this.getAuthHeaders()
        });

        await this.logTestResult('Assign room to multiple households', false, 'Should have failed but succeeded');
      } catch (error) {
        const success = error.response?.status === 400;
        await this.logTestResult(
          'Assign room to multiple households', 
          success,
          success ? 'Correctly prevented duplicate assignment' : `Unexpected status: ${error.response?.status}`
        );
      }
    }

    // Test 3: Release room from household
    try {
      const response = await axios.post(`${API_BASE}/rooms/${this.testData.roomId}/release`, {}, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200;
      
      await this.logTestResult(
        'Release room from household', 
        success,
        success ? 'Room released successfully' : 'Failed to release room'
      );
    } catch (error) {
      await this.logTestResult('Release room from household', false, error.response?.data?.message || error.message);
    }

    // Test 4: Get room details
    try {
      const response = await axios.get(`${API_BASE}/rooms/${this.testData.roomId}`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.id;
      
      await this.logTestResult(
        'Get room details', 
        success,
        success ? 'Room details retrieved' : 'Failed to get room details'
      );
    } catch (error) {
      await this.logTestResult('Get room details', false, error.response?.data?.message || error.message);
    }
  }

  async testApartmentHouseholdAssignment() {
    console.log('\n🏢 Testing Apartment-Household Assignment...');

    if (!this.testData.apartmentId || !this.testData.hoKhauId) {
      await this.logTestResult('Apartment assignment tests', false, 'Missing apartment or household data');
      return;
    }

    // Test 1: Assign apartment to household
    try {
      const assignmentData = {
        apartmentId: this.testData.apartmentId,
        hoKhauId: this.testData.hoKhauId
      };

      const response = await axios.post(`${API_BASE}/canho/assign`, assignmentData, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.apartment;
      
      await this.logTestResult(
        'Assign apartment to household', 
        success,
        success ? `Apartment ${this.testData.apartmentId} assigned to household ${this.testData.hoKhauId}` : response.data.message
      );
    } catch (error) {
      await this.logTestResult('Assign apartment to household', false, error.response?.data?.message || error.message);
    }

    // Test 2: Try to assign household to multiple apartments
    if (this.testData.createdApartments.length > 1) {
      try {
        const duplicateData = {
          apartmentId: this.testData.createdApartments[1],
          hoKhauId: this.testData.hoKhauId
        };

        const response = await axios.post(`${API_BASE}/canho/assign`, duplicateData, {
          headers: this.getAuthHeaders()
        });

        await this.logTestResult('Assign household to multiple apartments', false, 'Should have failed but succeeded');
      } catch (error) {
        const success = error.response?.status === 400;
        await this.logTestResult(
          'Assign household to multiple apartments', 
          success,
          success ? 'Correctly prevented multiple apartment assignment' : `Unexpected status: ${error.response?.status}`
        );
      }
    }

    // Test 3: Remove household from apartment
    try {
      const response = await axios.put(`${API_BASE}/canho/${this.testData.apartmentId}/remove-hokhau`, {}, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200;
      
      await this.logTestResult(
        'Remove household from apartment', 
        success,
        success ? 'Household removed from apartment' : 'Failed to remove household'
      );
    } catch (error) {
      await this.logTestResult('Remove household from apartment', false, error.response?.data?.message || error.message);
    }

    // Test 4: Get apartment details
    try {
      const response = await axios.get(`${API_BASE}/canho/${this.testData.apartmentId}`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.id;
      
      await this.logTestResult(
        'Get apartment details', 
        success,
        success ? 'Apartment details retrieved' : 'Failed to get apartment details'
      );
    } catch (error) {
      await this.logTestResult('Get apartment details', false, error.response?.data?.message || error.message);
    }
  }

  async testHousingAvailability() {
    console.log('\n🔍 Testing Housing Availability...');

    // Test 1: Get all rooms with filters
    try {
      const response = await axios.get(`${API_BASE}/rooms?trangThai=trong`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && Array.isArray(response.data);
      
      await this.logTestResult(
        'Get available rooms', 
        success,
        success ? `Found ${response.data.length} available rooms` : 'Failed to get available rooms'
      );
    } catch (error) {
      await this.logTestResult('Get available rooms', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get all apartments with filters
    try {
      const response = await axios.get(`${API_BASE}/canho?trangThai=trong`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && Array.isArray(response.data);
      
      await this.logTestResult(
        'Get available apartments', 
        success,
        success ? `Found ${response.data.length} available apartments` : 'Failed to get available apartments'
      );
    } catch (error) {
      await this.logTestResult('Get available apartments', false, error.response?.data?.message || error.message);
    }

    // Test 3: Search rooms by criteria
    try {
      const response = await axios.get(`${API_BASE}/rooms?search=TEST`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200;
      
      await this.logTestResult(
        'Search rooms by criteria', 
        success,
        success ? 'Room search working' : 'Room search failed'
      );
    } catch (error) {
      await this.logTestResult('Search rooms by criteria', false, error.response?.data?.message || error.message);
    }

    // Test 4: Search apartments by criteria
    try {
      const response = await axios.get(`${API_BASE}/canho?search=TEST`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200;
      
      await this.logTestResult(
        'Search apartments by criteria', 
        success,
        success ? 'Apartment search working' : 'Apartment search failed'
      );
    } catch (error) {
      await this.logTestResult('Search apartments by criteria', false, error.response?.data?.message || error.message);
    }
  }

  async testHousingStatistics() {
    console.log('\n📊 Testing Housing Statistics...');

    // Test 1: Get room statistics
    try {
      const response = await axios.get(`${API_BASE}/rooms/statistics`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.totalRooms !== undefined;
      
      await this.logTestResult(
        'Get room statistics', 
        success,
        success ? 'Room statistics retrieved' : 'Failed to get room statistics'
      );
    } catch (error) {
      await this.logTestResult('Get room statistics', false, error.response?.data?.message || error.message);
    }

    // Test 2: Get apartment statistics
    try {
      const response = await axios.get(`${API_BASE}/canho/statistics`, {
        headers: this.getAuthHeaders()
      });

      const success = response.status === 200 && response.data.totalApartments !== undefined;
      
      await this.logTestResult(
        'Get apartment statistics', 
        success,
        success ? 'Apartment statistics retrieved' : 'Failed to get apartment statistics'
      );
    } catch (error) {
      await this.logTestResult('Get apartment statistics', false, error.response?.data?.message || error.message);
    }
  }

  async testHousingConstraints() {
    console.log('\n⚖️ Testing Housing Business Rules...');

    // Test 1: Create room with duplicate number
    try {
      const duplicateRoom = await this.createTestRoom('TEST001'); // Same as existing

      await this.logTestResult('Create room with duplicate number', !duplicateRoom, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 400;
      await this.logTestResult(
        'Create room with duplicate number', 
        success,
        success ? 'Correctly prevented duplicate room number' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 2: Create apartment with duplicate number
    try {
      const duplicateApartment = await this.createTestApartment('TESTA01'); // Same as existing

      await this.logTestResult('Create apartment with duplicate number', !duplicateApartment, 'Should have failed but succeeded');
    } catch (error) {
      const success = error.response?.status === 400;
      await this.logTestResult(
        'Create apartment with duplicate number', 
        success,
        success ? 'Correctly prevented duplicate apartment number' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 3: Assign non-existent household to room
    if (this.testData.roomId) {
      try {
        const invalidData = {
          hoKhauId: 99999,
          ngayBatDau: new Date().toISOString()
        };

        const response = await axios.post(`${API_BASE}/rooms/${this.testData.roomId}/assign`, invalidData, {
          headers: this.getAuthHeaders()
        });

        await this.logTestResult('Assign non-existent household to room', false, 'Should have failed but succeeded');
      } catch (error) {
        const success = error.response?.status === 404;
        await this.logTestResult(
          'Assign non-existent household to room', 
          success,
          success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
        );
      }
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');

    // Test 1: Access without authentication
    try {
      const response = await axios.get(`${API_BASE}/rooms`, {
        headers: { 'Content-Type': 'application/json' } // No auth token
      });

      await this.logTestResult('Access rooms without authentication', false, 'Should have returned 401');
    } catch (error) {
      const success = error.response?.status === 401;
      await this.logTestResult(
        'Access rooms without authentication', 
        success,
        success ? 'Correctly returned 401' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 2: Get non-existent room
    try {
      const response = await axios.get(`${API_BASE}/rooms/99999`, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Get non-existent room', false, 'Should have returned 404');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Get non-existent room', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 3: Get non-existent apartment
    try {
      const response = await axios.get(`${API_BASE}/canho/99999`, {
        headers: this.getAuthHeaders()
      });

      await this.logTestResult('Get non-existent apartment', false, 'Should have returned 404');
    } catch (error) {
      const success = error.response?.status === 404;
      await this.logTestResult(
        'Get non-existent apartment', 
        success,
        success ? 'Correctly returned 404' : `Unexpected status: ${error.response?.status}`
      );
    }

    // Test 4: Invalid assignment data
    if (this.testData.roomId) {
      try {
        const invalidData = {
          // Missing required hoKhauId
          ngayBatDau: new Date().toISOString()
        };

        const response = await axios.post(`${API_BASE}/rooms/${this.testData.roomId}/assign`, invalidData, {
          headers: this.getAuthHeaders()
        });

        await this.logTestResult('Room assignment with invalid data', false, 'Should have returned 400');
      } catch (error) {
        const success = error.response?.status === 400;
        await this.logTestResult(
          'Room assignment with invalid data', 
          success,
          success ? 'Correctly returned 400' : `Unexpected status: ${error.response?.status}`
        );
      }
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up test data...');

    // Cleanup test rooms
    for (const roomId of this.testData.createdRooms) {
      try {
        await axios.delete(`${API_BASE}/rooms/${roomId}`, {
          headers: this.getAuthHeaders()
        });
      } catch (error) {
        console.log(`⚠️ Could not delete room ${roomId}`);
      }
    }

    // Cleanup test apartments
    for (const apartmentId of this.testData.createdApartments) {
      try {
        await axios.delete(`${API_BASE}/canho/${apartmentId}`, {
          headers: this.getAuthHeaders()
        });
      } catch (error) {
        console.log(`⚠️ Could not delete apartment ${apartmentId}`);
      }
    }

    console.log(`✅ Cleaned up ${this.testData.createdRooms.length} rooms and ${this.testData.createdApartments.length} apartments`);
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HOUSEHOLD HOUSING MANAGEMENT API TEST SUMMARY');
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
    console.log('   • Room-Household Assignment ✓');
    console.log('   • Apartment-Household Assignment ✓');
    console.log('   • Housing Availability Queries ✓');
    console.log('   • Housing Statistics ✓');
    console.log('   • Business Rule Constraints ✓');
    console.log('   • Error Handling ✓');
    
    console.log('\n' + '='.repeat(60));
  }
}

// Main execution
async function runHouseholdHousingAPITests() {
  const tester = new HouseholdHousingAPITester();
  await tester.runAllTests();
}

// Export for use in other test files
module.exports = { HouseholdHousingAPITester };

// Run tests if this file is executed directly
if (require.main === module) {
  runHouseholdHousingAPITests().catch(console.error);
}
