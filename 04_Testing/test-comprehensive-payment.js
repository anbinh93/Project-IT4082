const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function comprehensivePaymentTest() {
  try {
    console.log('🚀 Running comprehensive payment update test...');

    // Step 1: Login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Get household fees
    const feesResponse = await axios.get(`${API_BASE}/household-fees/dot-thu/2`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!feesResponse.data.success || !feesResponse.data.data.length) {
      console.log('❌ No household fees found');
      return;
    }

    console.log(`✅ Found ${feesResponse.data.data.length} household fees`);

    // Step 3: Test multiple payment updates
    const testFees = feesResponse.data.data.slice(0, 3); // Test first 3 fees
    
    for (const fee of testFees) {
      console.log(`\n💰 Testing payment for fee ID ${fee.id} - ${fee.tenKhoan || 'Unknown'}`);
      console.log(`   Current: ${fee.soTienDaNop}/${fee.soTien} - Status: ${fee.trangThai}`);
      
      try {
        const paymentAmount = Math.min(50000, parseInt(fee.soTien) - parseInt(fee.soTienDaNop));
        
        if (paymentAmount <= 0) {
          console.log(`   ⏭️  Skipping - already fully paid`);
          continue;
        }

        const paymentResponse = await axios.put(
          `${API_BASE}/household-fees/${fee.id}/payment`,
          {
            soTienThanhToan: paymentAmount,
            ghiChu: `Test payment ${paymentAmount} VND`
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log(`   ✅ Payment successful: ${paymentResponse.data.message}`);
        console.log(`   📊 Updated: ${paymentResponse.data.data.soTienDaNop} paid, status: ${paymentResponse.data.data.trangThai}`);
        
      } catch (paymentError) {
        console.log(`   ❌ Payment failed: ${paymentError.response?.data?.message || paymentError.message}`);
      }
    }

    console.log('\n🎉 Comprehensive payment test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

comprehensivePaymentTest();
