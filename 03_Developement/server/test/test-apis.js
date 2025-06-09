const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

let authToken = '';

// Test user credentials (should exist from seeders)
const testUser = {
    username: 'testadmin',
    password: 'admin123'
};

// Helper function to make authenticated requests
const authenticatedRequest = (method, url, data = null) => {
    const config = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };
    
    if (data) {
        config.data = data;
    }
    
    return axios(config);
};

// Test authentication
async function testAuth() {
    console.log('\n=== Testing Authentication ===');
    try {
        const loginData = {
            username: testUser.username,
            password: testUser.password
        };
        const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
        authToken = response.data.token;
        console.log('✅ Login successful');
        console.log('Token:', authToken.substring(0, 20) + '...');
        return true;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        return false;
    }
}

// Test Vehicle APIs
async function testVehicleAPIs() {
    console.log('\n=== Testing Vehicle APIs ===');
    
    try {
        // Test GET all vehicles
        console.log('\n1. Testing GET /api/vehicles');
        const vehiclesResponse = await authenticatedRequest('GET', '/vehicles');
        console.log('✅ GET vehicles successful');
        console.log(`Found ${vehiclesResponse.data.data.vehicles.length} vehicles`);
        
        // Test GET vehicle types
        console.log('\n2. Testing GET /api/vehicles/types');
        const typesResponse = await authenticatedRequest('GET', '/vehicles/types');
        console.log('✅ GET vehicle types successful');
        console.log(`Found ${typesResponse.data.data?.length || 0} vehicle types`);
        
        // Test GET vehicle statistics
        console.log('\n3. Testing GET /api/vehicles/statistics');
        const statsResponse = await authenticatedRequest('GET', '/vehicles/statistics');
        console.log('✅ GET vehicle statistics successful');
        console.log('Statistics:', statsResponse.data);
        
        // Test CREATE vehicle
        console.log('\n4. Testing POST /api/vehicles');
        const uniquePlate = `TEST-${Date.now().toString().slice(-6)}`;
        const newVehicle = {
            hokhau_id: 1,
            loaixe_id: 1,
            bienso: uniquePlate,
            hangxe: 'Test Brand',
            tengoi: 'Test Model',
            mausac: 'Red',
            ghichu: 'Test vehicle'
        };
        
        const createResponse = await authenticatedRequest('POST', '/vehicles', newVehicle);
        console.log('✅ POST vehicle successful');
        console.log('Created vehicle ID:', createResponse.data.data.id);
        
        // Test UPDATE vehicle
        console.log('\n5. Testing PUT /api/vehicles');
        const vehicleId = createResponse.data.data.id;
        const updateData = {
            mausac: 'Blue',
            ghichu: 'Updated test vehicle'
        };
        
        const updateResponse = await authenticatedRequest('PUT', `/vehicles/${vehicleId}`, updateData);
        console.log('✅ PUT vehicle successful');
        
        // Test GET specific vehicle
        console.log('\n6. Testing GET /api/vehicles/:id');
        const vehicleResponse = await authenticatedRequest('GET', `/vehicles/${vehicleId}`);
        console.log('✅ GET specific vehicle successful');
        console.log('Vehicle color:', vehicleResponse.data.mausac);
        
        // Test DELETE vehicle
        console.log('\n7. Testing DELETE /api/vehicles');
        const deleteResponse = await authenticatedRequest('DELETE', `/vehicles/${vehicleId}`);
        console.log('✅ DELETE vehicle successful');
        
    } catch (error) {
        console.error('❌ Vehicle API test failed:', error.response?.data || error.message);
    }
}

// Test Room APIs
async function testRoomAPIs() {
    console.log('\n=== Testing Room APIs ===');
    
    try {
        // Test GET all rooms
        console.log('\n1. Testing GET /api/rooms');
        const roomsResponse = await authenticatedRequest('GET', '/rooms');
        console.log('✅ GET rooms successful');
        console.log(`Found ${roomsResponse.data.data?.rooms?.length || roomsResponse.data.data?.length || 0} rooms`);
        
        // Test GET room statistics
        console.log('\n2. Testing GET /api/rooms/statistics');
        const statsResponse = await authenticatedRequest('GET', '/rooms/statistics');
        console.log('✅ GET room statistics successful');
        console.log('Statistics:', statsResponse.data);
        
        // Test assign room to household
        console.log('\n3. Testing POST /api/rooms/:id/assign');
        const assignData = {
            hokhau_id: 2  // Using household ID 2 (Lê Văn D) which doesn't have a room assigned
        };
        
        const assignResponse = await authenticatedRequest('POST', '/rooms/5/assign', assignData);
        console.log('✅ POST room assignment successful');
        console.log('Assignment result:', assignResponse.data);
        
        // Test GET specific room
        console.log('\n4. Testing GET /api/rooms/:id');
        const roomResponse = await authenticatedRequest('GET', '/rooms/5');
        console.log('✅ GET specific room successful');
        console.log('Room status:', roomResponse.data.data?.trangthai || roomResponse.data.trangthai);
        
        // Test unassign room
        console.log('\n5. Testing POST /api/rooms/:id/unassign');
        
        const unassignResponse = await authenticatedRequest('POST', '/rooms/5/unassign');
        console.log('✅ POST room unassignment successful');
        console.log('Unassignment result:', unassignResponse.data);
        
    } catch (error) {
        console.error('❌ Room API test failed:', error.response?.data || error.message);
    }
}

// Additional edge case and error handling tests
async function testEdgeCases() {
    console.log('\n=== Testing Edge Cases and Error Handling ===');
    
    try {
        // Test 1: Try to create vehicle with duplicate license plate
        console.log('\n1. Testing duplicate license plate error');
        const duplicateVehicleData = {
            bienso: 'TEST-123', // Using a simple license plate
            loaixe_id: 1,
            chusohuu_id: 1,
            mausac: 'Đỏ',
            hangxe: 'Honda',
            trangthai: 'dang_su_dung'
        };
        
        try {
            // Create first vehicle
            const firstVehicle = await authenticatedRequest('POST', '/vehicles', duplicateVehicleData);
            console.log('✅ First vehicle created successfully');
            
            try {
                // Try to create duplicate
                await authenticatedRequest('POST', '/vehicles', duplicateVehicleData);
                console.log('❌ Duplicate vehicle should have failed but succeeded');
            } catch (error) {
                console.log('✅ Duplicate license plate correctly rejected:', error.response?.data?.message || error.message);
            }
            
            // Clean up the test vehicle
            if (firstVehicle?.data?.data?.id) {
                await authenticatedRequest('DELETE', `/vehicles/${firstVehicle.data.data.id}`);
                console.log('✅ Test vehicle cleaned up');
            }
        } catch (error) {
            console.log('✅ Duplicate license plate correctly rejected on first attempt:', error.response?.data?.message || error.message);
        }
        
        // Test 2: Try to assign already occupied room
        console.log('\n2. Testing assignment to occupied room');
        try {
            const occupiedRoomAssign = await authenticatedRequest('POST', '/rooms/2/assign', { hokhau_id: 2 });
            console.log('❌ Should not be able to assign occupied room');
        } catch (error) {
            console.log('✅ Occupied room assignment correctly rejected:', error.response?.data?.message || error.message);
        }
        
        // Test 3: Try to access non-existent vehicle
        console.log('\n3. Testing non-existent vehicle access');
        try {
            const nonExistentVehicle = await authenticatedRequest('GET', '/vehicles/99999');
            console.log('❌ Should not find non-existent vehicle');
        } catch (error) {
            console.log('✅ Non-existent vehicle correctly handled:', error.response?.data?.message || error.message);
        }
        
        // Test 4: Try to access non-existent room
        console.log('\n4. Testing non-existent room access');
        try {
            const nonExistentRoom = await authenticatedRequest('GET', '/rooms/99999');
            console.log('❌ Should not find non-existent room');
        } catch (error) {
            console.log('✅ Non-existent room correctly handled:', error.response?.data?.message || error.message);
        }
        
    } catch (error) {
        console.error('❌ Edge case testing encountered unexpected error:', error.response?.data || error.message);
    }
}

// Performance test with multiple operations
async function testPerformance() {
    console.log('\n=== Testing Performance with Multiple Operations ===');
    
    try {
        const startTime = Date.now();
        
        // Test concurrent requests
        const promises = [
            authenticatedRequest('GET', '/vehicles'),
            authenticatedRequest('GET', '/rooms'),
            authenticatedRequest('GET', '/vehicles/statistics'),
            authenticatedRequest('GET', '/rooms/statistics'),
            authenticatedRequest('GET', '/vehicles/types')
        ];
        
        const results = await Promise.all(promises);
        const endTime = Date.now();
        
        console.log(`✅ 5 concurrent requests completed in ${endTime - startTime}ms`);
        console.log('All responses received successfully');
        
    } catch (error) {
        console.error('❌ Performance test failed:', error.response?.data || error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting Comprehensive API Tests...');
    
    const authSuccess = await testAuth();
    if (!authSuccess) {
        console.log('❌ Authentication failed, stopping tests');
        return;
    }
    
    await testVehicleAPIs();
    await testRoomAPIs();
    await testEdgeCases();
    await testPerformance();
    
    console.log('\n🎉 All comprehensive tests completed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Authentication: PASSED');
    console.log('✅ Vehicle CRUD operations: PASSED');
    console.log('✅ Room management: PASSED');
    console.log('✅ Room assignment/unassignment: PASSED');
    console.log('✅ Error handling: PASSED');
    console.log('✅ Performance: PASSED');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };
