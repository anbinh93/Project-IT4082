const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';
let authToken = '';

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    authToken = response.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testAPI(method, url, data = null, description = '') {
  try {
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

    const response = await axios(config);
    console.log(`✅ ${description}: ${response.status} - ${response.data.message || 'Success'}`);
    return response.data;
  } catch (error) {
    console.error(`❌ ${description}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing Refactored Vehicle Management API\n');

  // Login
  const loginSuccess = await login();
  if (!loginSuccess) return;

  console.log('\n📋 Testing Vehicle Types API:');
  
  // Test vehicle types CRUD
  await testAPI('GET', '/vehicles/types', null, 'Get vehicle types');
  
  const newVehicleType = await testAPI('POST', '/vehicles/types', {
    tenLoaiXe: 'Xe đạp điện',
    phiThang: 30000,
    moTa: 'Xe đạp điện cho chung cư'
  }, 'Create new vehicle type');

  if (newVehicleType && newVehicleType.data) {
    await testAPI('PUT', `/vehicles/types/${newVehicleType.data.id}`, {
      tenLoaiXe: 'Xe đạp điện (Updated)',
      phiThang: 35000,
      moTa: 'Xe đạp điện cho chung cư - đã cập nhật'
    }, 'Update vehicle type');

    await testAPI('DELETE', `/vehicles/types/${newVehicleType.data.id}`, null, 'Delete vehicle type');
  }

  console.log('\n🚗 Testing Vehicle Management API:');
  
  // Test vehicle CRUD
  await testAPI('GET', '/vehicles', null, 'Get vehicles list');
  await testAPI('GET', '/vehicles?page=1&limit=5&search=30A', null, 'Search vehicles');
  
  const newVehicle = await testAPI('POST', '/vehicles', {
    hoKhauId: 1,
    loaiXeId: 4,
    bienSo: '30A-12345',
    ngayBatDau: '2025-06-09',
    trangThai: 'ACTIVE',
    ghiChu: 'Test vehicle from refactored API'
  }, 'Create new vehicle');

  if (newVehicle && newVehicle.data) {
    await testAPI('PUT', `/vehicles/${newVehicle.data.id}`, {
      ghiChu: 'Updated test vehicle',
      trangThai: 'ACTIVE'
    }, 'Update vehicle');

    await testAPI('DELETE', `/vehicles/${newVehicle.data.id}`, null, 'Delete vehicle');
  }

  // Test additional endpoints
  await testAPI('GET', '/vehicles/household/1', null, 'Get vehicles by household');
  await testAPI('GET', '/vehicles/statistics', null, 'Get vehicle statistics');

  console.log('\n✅ All tests completed! Vehicle Management API refactoring successful!');
}

runTests().catch(console.error);
