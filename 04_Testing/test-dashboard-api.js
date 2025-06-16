const axios = require('axios');

async function testDashboardAPI() {
    console.log('🔄 Testing Dashboard API response...');
    
    try {
        // 1. Login first
        const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });
        
        console.log('Login response:', loginResponse.data);
        const token = loginResponse.data.token;
        console.log('✅ Login successful, token obtained');
        
        // 2. Get DotThu list to find one with KhoanThu
        const dotThuResponse = await axios.get('http://localhost:8000/api/dot-thu/with-khoan-thu', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('DotThu Response:', JSON.stringify(dotThuResponse.data, null, 2));
        
        if (dotThuResponse.data.success && dotThuResponse.data.dotThus.length > 0) {
            const dotThuWithKhoanThu = dotThuResponse.data.dotThus.find(dt => dt.khoanThu && dt.khoanThu.length > 0);
            
            if (dotThuWithKhoanThu) {
                console.log(`\n📊 Testing dashboard for DotThu ID: ${dotThuWithKhoanThu.id}`);
                console.log(`DotThu Name: ${dotThuWithKhoanThu.tenDotThu}`);
                console.log(`KhoanThu count: ${dotThuWithKhoanThu.khoanThu.length}`);
                
                // 3. Test dashboard API
                const dashboardResponse = await axios.get(`http://localhost:8000/api/household-fees/dashboard/${dotThuWithKhoanThu.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('\n=== Dashboard API Response ===');
                console.log('Full response:', JSON.stringify(dashboardResponse.data, null, 2));
                console.log('Success:', dashboardResponse.data.success);
                console.log('Data count:', dashboardResponse.data.data ? dashboardResponse.data.data.length : 0);
                
                if (dashboardResponse.data.data && dashboardResponse.data.data.length > 0) {
                    dashboardResponse.data.data.forEach((fee, index) => {
                        console.log(`\nFee #${index + 1}:`);
                        console.log(`  - ID: ${fee.id}`);
                        console.log(`  - Name: ${fee.tenkhoanthu}`);
                        console.log(`  - Required: ${fee.batbuoc}`);
                        console.log(`  - Default Amount: ${fee.soTienMacDinh}`);
                        console.log(`  - Total Collected: ${fee.totalCollected || 0}`);
                        console.log(`  - Total Households: ${fee.totalHouseholds || 0}`);
                        console.log(`  - Paid Households: ${fee.paidHouseholds || 0}`);
                        console.log(`  - Unpaid Households: ${fee.unpaidHouseholds || 0}`);
                    });
                } else {
                    console.log('❌ No fee data found in dashboard response');
                }
                
            } else {
                console.log('❌ No DotThu with KhoanThu found');
            }
        } else {
            console.log('❌ No DotThu data found');
        }
        
    } catch (error) {
        console.error('❌ Error testing dashboard API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testDashboardAPI();
