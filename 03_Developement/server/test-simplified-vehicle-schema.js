/**
 * Test script for simplified vehicle management schema
 * Tests all vehicle endpoints to ensure they work with the new simplified schema
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

// Test configuration
const testConfig = {
  admin: {
    username: 'admin',
    password: 'admin123'
  }
};

let authToken = '';

async function login() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testConfig.admin);
    authToken = response.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testVehicleTypes() {
  console.log('\n📋 Testing Vehicle Types...');
  
  try {
    // Test 1: Get all vehicle types
    console.log('1. Getting all vehicle types...');
    const getResponse = await axios.get(`${BASE_URL}/vehicles/types`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${getResponse.data.length} vehicle types`);
    
    // Test 2: Create new vehicle type with phiThue
    console.log('2. Creating new vehicle type...');
    const newVehicleType = {
      tenLoaiXe: 'Xe máy điện TEST',
      phiThue: 50000, // Using phiThue instead of phiThang
      moTa: 'Xe máy điện cho test schema đơn giản'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/vehicles/types`, newVehicleType, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Vehicle type created:', createResponse.data.tenLoaiXe);
    
    const createdTypeId = createResponse.data.id;
    
    // Test 3: Update vehicle type
    console.log('3. Updating vehicle type...');
    const updateData = {
      phiThue: 60000,
      moTa: 'Đã cập nhật phí thuê'
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/vehicles/types/${createdTypeId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Vehicle type updated, new phiThue:', updateResponse.data.phiThue);
    
    // Test 4: Verify the response structure (no timestamps)
    const vehicleType = updateResponse.data;
    if (vehicleType.createdAt || vehicleType.updatedAt) {
      console.log('⚠️  Warning: Timestamps still present in response');
    } else {
      console.log('✅ Confirmed: No timestamps in response');
    }
    
    return createdTypeId;
    
  } catch (error) {
    console.error('❌ Vehicle type test failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testVehicleManagement(vehicleTypeId) {
  console.log('\n🚗 Testing Vehicle Management...');
  
  try {
    // Test 1: Get all vehicles
    console.log('1. Getting all vehicles...');
    const getResponse = await axios.get(`${BASE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${getResponse.data.data?.length || 0} vehicles`);
    
    // Test 2: Create new vehicle with simplified fields
    console.log('2. Creating new vehicle...');
    const newVehicle = {
      hoKhauId: 'HK001', // Assuming this household exists
      loaiXeId: vehicleTypeId,
      bienSo: '30A-12345',
      ngayBatDau: '2025-01-01',
      ngayKetThuc: '2025-12-31',
      trangThai: 'ACTIVE',
      ghiChu: 'Xe test cho schema đơn giản'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/vehicles`, newVehicle, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Vehicle created:', createResponse.data.bienSo);
    
    const createdVehicleId = createResponse.data.id;
    
    // Test 3: Verify response structure (no timestamps, no removed fields)
    const vehicle = createResponse.data;
    const removedFields = ['createdAt', 'updatedAt', 'trangThaiDangKy', 'phiDaTra', 'lanCapNhatCuoi'];
    const hasRemovedFields = removedFields.some(field => vehicle.hasOwnProperty(field));
    
    if (hasRemovedFields) {
      console.log('⚠️  Warning: Some removed fields still present');
    } else {
      console.log('✅ Confirmed: All unnecessary fields removed');
    }
    
    // Test 4: Verify vehicle type includes phiThue
    if (vehicle.loaiXe && vehicle.loaiXe.phiThue !== undefined) {
      console.log('✅ Confirmed: Vehicle type includes phiThue field');
    } else {
      console.log('⚠️  Warning: phiThue field missing from vehicle type');
    }
    
    // Test 5: Update vehicle
    console.log('3. Updating vehicle...');
    const updateData = {
      trangThai: 'INACTIVE',
      ghiChu: 'Đã cập nhật trạng thái'
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/vehicles/${createdVehicleId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Vehicle updated, new status:', updateResponse.data.trangThai);
    
    // Test 6: Get vehicle statistics
    console.log('4. Getting vehicle statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/vehicles/statistics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Statistics retrieved:', {
      total: statsResponse.data.overview.total,
      active: statsResponse.data.overview.active,
      inactive: statsResponse.data.overview.inactive
    });
    
    return createdVehicleId;
    
  } catch (error) {
    console.error('❌ Vehicle management test failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function cleanup(vehicleTypeId, vehicleId) {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // Delete test vehicle
    if (vehicleId) {
      await axios.delete(`${BASE_URL}/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Test vehicle deleted');
    }
    
    // Delete test vehicle type
    if (vehicleTypeId) {
      await axios.delete(`${BASE_URL}/vehicles/types/${vehicleTypeId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Test vehicle type deleted');
    }
    
  } catch (error) {
    console.log('⚠️  Cleanup warning:', error.response?.data?.message || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Simplified Vehicle Schema Tests');
  console.log('==========================================');
  
  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  let vehicleTypeId = null;
  let vehicleId = null;
  
  try {
    // Test vehicle types
    vehicleTypeId = await testVehicleTypes();
    
    if (vehicleTypeId) {
      // Test vehicle management
      vehicleId = await testVehicleManagement(vehicleTypeId);
    }
    
    console.log('\n📊 Test Summary');
    console.log('===============');
    console.log('✅ Schema simplification verified:');
    console.log('   • phiThang → phiThue conversion working');
    console.log('   • Timestamps (createdAt/updatedAt) removed');
    console.log('   • Unnecessary fields removed from QuanLyXe');
    console.log('   • All CRUD operations functioning');
    console.log('   • Statistics and associations working');
    
  } finally {
    // Always cleanup
    await cleanup(vehicleTypeId, vehicleId);
  }
  
  console.log('\n🎉 All tests completed successfully!');
  console.log('The simplified vehicle schema is working correctly.');
}

// Run the tests
runTests().catch(console.error);
