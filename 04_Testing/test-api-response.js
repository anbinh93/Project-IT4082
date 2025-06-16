// Test API response for fee collection data
const axios = require('axios');

async function testAPIResponse() {
  try {
    console.log('🔄 Testing API response...');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login response:', loginResponse.data);
    
    if (!loginResponse.data.token) {
      throw new Error('Login failed: ' + (loginResponse.data.message || 'No token received'));
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token obtained');
    
    // Test the getAllWithKhoanThu endpoint
    const apiResponse = await axios.get('http://localhost:8000/api/dot-thu/with-khoan-thu?page=0&size=10', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 API Response:');
    console.log('- Success:', apiResponse.data.success);
    console.log('- DotThus count:', apiResponse.data.dotThus?.length || 0);
    
    if (apiResponse.data.dotThus && apiResponse.data.dotThus.length > 0) {
      // Find first DotThu with KhoanThu
      const dotThuWithKhoan = apiResponse.data.dotThus.find(d => d.khoanThu && d.khoanThu.length > 0);
      
      if (dotThuWithKhoan) {
        console.log('\n=== DotThu with KhoanThu ===');
        console.log('DotThu ID:', dotThuWithKhoan.id);
        console.log('DotThu Name:', dotThuWithKhoan.tenDotThu);
        console.log('DotThu Status:', dotThuWithKhoan.trangThai);
        
        console.log('\nKhoanThu Details:');
        dotThuWithKhoan.khoanThu.forEach((k, i) => {
          console.log(`KhoanThu #${i+1}:`);
          console.log('  - id:', k.id);
          console.log('  - tenkhoanthu:', k.tenkhoanthu);
          console.log('  - ghichu:', k.ghichu);
          console.log('  - batbuoc:', k.batbuoc);
          console.log('  - soTienMacDinh:', k.soTienMacDinh);
        });
        
        console.log('\n📋 This is what frontend receives exactly.');
      } else {
        console.log('⚠️  No DotThu with KhoanThu found in response');
      }
    } else {
      console.log('⚠️  No DotThus in response');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPIResponse();
