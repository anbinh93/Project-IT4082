// Debug API call for creating voluntary fee with soTienToiThieu
const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testAPICall() {
  try {
    console.log('🚀 Testing API call for creating voluntary fee...');

    // 1. Login first
    console.log('\n🔐 Step 1: Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 2. Create voluntary fee with soTienToiThieu
    console.log('\n📝 Step 2: Creating voluntary fee with API...');
    const requestData = {
      tenKhoan: 'API Test Voluntary Fee',
      batBuoc: false,
      ghiChu: 'API test for voluntary contribution',
      soTienToiThieu: 75000
    };

    console.log('Request data:', JSON.stringify(requestData, null, 2));

    const response = await axios.post(`${API_BASE}/khoan-thu`, requestData);

    console.log('\n✅ API Response:');
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.data) {
      const createdFee = response.data.data;
      console.log('\n📊 Analysis:');
      console.log('  - ID:', createdFee.id);
      console.log('  - Name:', createdFee.tenKhoan);
      console.log('  - Mandatory:', createdFee.batBuoc);
      console.log('  - Minimum amount:', createdFee.soTienToiThieu, typeof createdFee.soTienToiThieu);
      
      if (createdFee.soTienToiThieu !== undefined && createdFee.soTienToiThieu !== null) {
        console.log('✅ soTienToiThieu is properly returned!');
        
        // Test with fee collection period
        console.log('\n📝 Step 3: Creating fee collection period...');
        const dotThuResponse = await axios.post(`${API_BASE}/dot-thu`, {
          tenDotThu: 'API Test Collection Period',
          ngayTao: new Date().toISOString(),
          thoiHan: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          khoanThu: [{
            khoanThuId: createdFee.id,
            soTien: createdFee.soTienToiThieu // Use soTienToiThieu as amount
          }]
        });

        if (dotThuResponse.data.success) {
          console.log('✅ Fee collection period created successfully!');
          console.log('  - ID:', dotThuResponse.data.data.id);
          
          // Check dashboard
          console.log('\n📝 Step 4: Checking dashboard...');
          const dashboardResponse = await axios.get(`${API_BASE}/household-fees/dashboard/${dotThuResponse.data.data.id}`);
          
          if (dashboardResponse.data.success) {
            const dashboardData = dashboardResponse.data.data;
            console.log('✅ Dashboard loaded successfully!');
            console.log('  - Number of fee types:', dashboardData.khoanThuList.length);
            
            const voluntaryFee = dashboardData.khoanThuList.find(fee => fee.khoanThuId === createdFee.id);
            if (voluntaryFee) {
              console.log('✅ Voluntary fee found in dashboard!');
              console.log('  - Name:', voluntaryFee.tenKhoanThu);
              console.log('  - Expected total:', voluntaryFee.taiChinh.tongTienDuKien);
            } else {
              console.log('❌ Voluntary fee not found in dashboard');
            }
          } else {
            console.log('❌ Dashboard failed:', dashboardResponse.data.message);
          }
        } else {
          console.log('❌ Fee collection period creation failed:', dotThuResponse.data.message);
        }
      } else {
        console.log('❌ soTienToiThieu is missing or null in API response!');
      }
    } else {
      console.log('❌ API call failed');
    }

    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPICall();
