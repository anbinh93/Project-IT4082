#!/usr/bin/env node
/**
 * Quick Integration Test - Basic Frontend-Backend Connectivity
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8000/api';
const FRONTEND_URL = 'http://localhost:5173';

async function testBasicIntegration() {
    console.log('🚀 Quick Integration Test - Frontend-Backend Connectivity');
    console.log('=' .repeat(60));
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Backend Health Check
    try {
        console.log('\n1. Testing Backend Health...');
        const healthResponse = await axios.get(`${BACKEND_URL.replace('/api', '')}/health`);
        console.log('   ✅ Backend is responding');
        passed++;
    } catch (error) {
        console.log('   ❌ Backend health check failed:', error.message);
        failed++;
    }
    
    // Test 2: Authentication API
    try {
        console.log('\n2. Testing Authentication API...');
        const authResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        
        if (authResponse.data.token) {
            console.log('   ✅ Authentication successful - Token received');
            
            // Test 3: Protected Vehicle API
            try {
                console.log('\n3. Testing Vehicle API with Authentication...');
                const vehiclesResponse = await axios.get(`${BACKEND_URL}/vehicles`, {
                    headers: { Authorization: `Bearer ${authResponse.data.token}` }
                });
                
                const vehicleCount = vehiclesResponse.data.data.vehicles.length;
                console.log(`   ✅ Vehicle API working - ${vehicleCount} vehicles found`);
                passed += 2;
            } catch (error) {
                console.log('   ❌ Vehicle API failed:', error.message);
                failed++;
            }
        } else {
            console.log('   ❌ Authentication failed - No token received');
            failed++;
        }
    } catch (error) {
        console.log('   ❌ Authentication API failed:', error.message);
        failed += 2;
    }
    
    // Test 4: Frontend Accessibility
    try {
        console.log('\n4. Testing Frontend Accessibility...');
        const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
        if (frontendResponse.status === 200) {
            console.log('   ✅ Frontend is accessible');
            passed++;
        } else {
            console.log('   ❌ Frontend returned non-200 status:', frontendResponse.status);
            failed++;
        }
    } catch (error) {
        console.log('   ❌ Frontend accessibility failed:', error.message);
        failed++;
    }
    
    // Test 5: CORS Configuration
    try {
        console.log('\n5. Testing CORS Configuration...');
        const corsResponse = await axios.options(`${BACKEND_URL}/vehicles`, {
            headers: {
                'Origin': FRONTEND_URL,
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Authorization'
            }
        });
        console.log('   ✅ CORS configuration is working');
        passed++;
    } catch (error) {
        console.log('   ❌ CORS test failed:', error.message);
        failed++;
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 INTEGRATION TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Tests Passed: ${passed}`);
    console.log(`❌ Tests Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! Frontend-Backend integration is working correctly.');
        console.log('🌐 You can now test the application in the browser at: http://localhost:5173');
        console.log('🔑 Login with: admin / admin123');
    } else {
        console.log(`\n⚠️  ${failed} test(s) failed. Please check the issues above.`);
    }
    
    return { passed, failed };
}

// Run the test
if (require.main === module) {
    testBasicIntegration().catch(console.error);
}

module.exports = { testBasicIntegration };
