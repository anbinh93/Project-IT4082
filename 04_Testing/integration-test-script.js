/**
 * Frontend-Backend Integration Test Script
 * Tests the complete integration between React frontend and Node.js backend
 * 
 * Run this script with: node integration-test-script.js
 */

const axios = require('axios');
const puppeteer = require('puppeteer');

// Configuration
const BACKEND_URL = 'http://localhost:8000/api';
const FRONTEND_URL = 'http://localhost:5173';
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

// Test results
let testResults = {
    backend: { passed: 0, failed: 0, tests: [] },
    frontend: { passed: 0, failed: 0, tests: [] },
    integration: { passed: 0, failed: 0, tests: [] }
};

// Utility functions
function logTest(category, testName, passed, details = '') {
    const result = { testName, passed, details, timestamp: new Date().toISOString() };
    testResults[category].tests.push(result);
    testResults[category][passed ? 'passed' : 'failed']++;
    
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} [${category.toUpperCase()}] ${testName}`);
    if (details) console.log(`    ${details}`);
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Backend API Tests
async function testBackendAPIs() {
    console.log('\n🔧 Testing Backend APIs...');
    
    let authToken = '';
    
    try {
        // Test 1: Authentication
        const authResponse = await axios.post(`${BACKEND_URL}/auth/login`, ADMIN_CREDENTIALS);
        authToken = authResponse.data.token;
        logTest('backend', 'Authentication Login', true, `Token received: ${authToken.substring(0, 20)}...`);
    } catch (error) {
        logTest('backend', 'Authentication Login', false, `Error: ${error.message}`);
        return; // Can't continue without auth
    }
    
    const authHeaders = { Authorization: `Bearer ${authToken}` };
    
    try {
        // Test 2: Vehicle API - Get All
        const vehiclesResponse = await axios.get(`${BACKEND_URL}/vehicles`, { headers: authHeaders });
        const vehicleCount = vehiclesResponse.data.data.vehicles.length;
        logTest('backend', 'Vehicles - Get All', true, `Retrieved ${vehicleCount} vehicles`);
    } catch (error) {
        logTest('backend', 'Vehicles - Get All', false, `Error: ${error.message}`);
    }
    
    try {
        // Test 3: Vehicle API - Create
        const newVehicle = {
            hokhau_id: 1,
            loaixe_id: 1,
            bienso: `TEST-INT-${Date.now()}`,
            tengoi: 'Integration Test Vehicle',
            mausac: 'Blue',
            hangxe: 'Test Brand',
            namsx: 2024,
            ghichu: 'Created during integration test'
        };
        
        const createResponse = await axios.post(`${BACKEND_URL}/vehicles`, newVehicle, { headers: authHeaders });
        const createdId = createResponse.data.data.id;
        logTest('backend', 'Vehicles - Create', true, `Created vehicle with ID: ${createdId}`);
        
        // Test 4: Vehicle API - Delete (cleanup)
        await axios.delete(`${BACKEND_URL}/vehicles/${createdId}`, { headers: authHeaders });
        logTest('backend', 'Vehicles - Delete', true, `Deleted vehicle ID: ${createdId}`);
    } catch (error) {
        logTest('backend', 'Vehicles - Create/Delete', false, `Error: ${error.message}`);
    }
    
    try {
        // Test 5: Rooms API - Get All
        const roomsResponse = await axios.get(`${BACKEND_URL}/rooms`, { headers: authHeaders });
        const roomCount = roomsResponse.data.data.rooms.length;
        logTest('backend', 'Rooms - Get All', true, `Retrieved ${roomCount} rooms`);
    } catch (error) {
        logTest('backend', 'Rooms - Get All', false, `Error: ${error.message}`);
    }
    
    try {
        // Test 6: Room Assignment/Unassignment
        // Find an available room
        const roomsResponse = await axios.get(`${BACKEND_URL}/rooms`, { headers: authHeaders });
        const availableRoom = roomsResponse.data.data.rooms.find(room => room.trangthai === 'trong');
        
        if (availableRoom) {
            // Assign room
            await axios.put(`${BACKEND_URL}/rooms/${availableRoom.id}/assign`, 
                { hokhau_id: 2 }, { headers: authHeaders });
            logTest('backend', 'Room Assignment', true, `Assigned room ${availableRoom.sophong} to household 2`);
            
            // Unassign room
            await axios.put(`${BACKEND_URL}/rooms/${availableRoom.id}/unassign`, {}, { headers: authHeaders });
            logTest('backend', 'Room Unassignment', true, `Unassigned room ${availableRoom.sophong}`);
        } else {
            logTest('backend', 'Room Assignment/Unassignment', false, 'No available rooms found for testing');
        }
    } catch (error) {
        logTest('backend', 'Room Assignment/Unassignment', false, `Error: ${error.message}`);
    }
}

// Frontend Tests
async function testFrontend() {
    console.log('\n🌐 Testing Frontend...');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        // Test 1: Frontend loads
        try {
            await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 10000 });
            const title = await page.title();
            logTest('frontend', 'Page Load', true, `Page title: "${title}"`);
        } catch (error) {
            logTest('frontend', 'Page Load', false, `Error: ${error.message}`);
            return;
        }
        
        // Test 2: Login form exists
        try {
            const loginForm = await page.$('form');
            const usernameInput = await page.$('input[type="text"], input[placeholder*="ên"], input[placeholder*="username"]');
            const passwordInput = await page.$('input[type="password"]');
            
            if (loginForm && usernameInput && passwordInput) {
                logTest('frontend', 'Login Form Elements', true, 'Username and password inputs found');
            } else {
                logTest('frontend', 'Login Form Elements', false, 'Missing form elements');
            }
        } catch (error) {
            logTest('frontend', 'Login Form Elements', false, `Error: ${error.message}`);
        }
        
    } catch (error) {
        logTest('frontend', 'Browser Setup', false, `Error: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Integration Tests
async function testIntegration() {
    console.log('\n🔗 Testing Frontend-Backend Integration...');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false, // Show browser for integration testing
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null
        });
        const page = await browser.newPage();
        
        // Navigate to frontend
        await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
        
        // Test 1: Login Integration
        try {
            // Fill login form
            const usernameSelector = 'input[type="text"], input[placeholder*="ên"], input[placeholder*="username"]';
            const passwordSelector = 'input[type="password"]';
            const submitSelector = 'button[type="submit"], button:contains("Đăng nhập")';
            
            await page.waitForSelector(usernameSelector, { timeout: 5000 });
            await page.type(usernameSelector, ADMIN_CREDENTIALS.username);
            await page.type(passwordSelector, ADMIN_CREDENTIALS.password);
            
            // Submit form
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
                page.click(submitSelector)
            ]);
            
            // Check if redirected to dashboard
            const currentUrl = page.url();
            if (currentUrl !== FRONTEND_URL && !currentUrl.includes('login')) {
                logTest('integration', 'Login Flow', true, `Successfully logged in and redirected to: ${currentUrl}`);
                
                // Test 2: Navigate to Vehicle Management
                try {
                    // Look for vehicle management link/button
                    const vehicleLink = await page.$('a:contains("Xe"), button:contains("Xe"), [href*="xe"]');
                    if (vehicleLink) {
                        await vehicleLink.click();
                        await page.waitForTimeout(2000);
                        
                        // Check if vehicle data loads
                        const vehicleElements = await page.$$('tr, .vehicle-item, [data-testid*="vehicle"]');
                        if (vehicleElements.length > 0) {
                            logTest('integration', 'Vehicle Page Load', true, `Found ${vehicleElements.length} vehicle elements`);
                        } else {
                            logTest('integration', 'Vehicle Page Load', false, 'No vehicle elements found');
                        }
                    } else {
                        logTest('integration', 'Vehicle Navigation', false, 'Vehicle management link not found');
                    }
                } catch (error) {
                    logTest('integration', 'Vehicle Management', false, `Error: ${error.message}`);
                }
                
                // Test 3: Navigate to Room Management
                try {
                    // Look for room management link/button
                    const roomLink = await page.$('a:contains("Phòng"), button:contains("Phòng"), [href*="phong"]');
                    if (roomLink) {
                        await roomLink.click();
                        await page.waitForTimeout(2000);
                        
                        // Check if room data loads
                        const roomElements = await page.$$('tr, .room-item, [data-testid*="room"]');
                        if (roomElements.length > 0) {
                            logTest('integration', 'Room Page Load', true, `Found ${roomElements.length} room elements`);
                        } else {
                            logTest('integration', 'Room Page Load', false, 'No room elements found');
                        }
                    } else {
                        logTest('integration', 'Room Navigation', false, 'Room management link not found');
                    }
                } catch (error) {
                    logTest('integration', 'Room Management', false, `Error: ${error.message}`);
                }
                
            } else {
                logTest('integration', 'Login Flow', false, 'Login failed - still on login page');
            }
        } catch (error) {
            logTest('integration', 'Login Flow', false, `Error: ${error.message}`);
        }
        
        // Keep browser open for manual inspection
        console.log('\n⏳ Browser will remain open for 10 seconds for manual inspection...');
        await delay(10000);
        
    } catch (error) {
        logTest('integration', 'Browser Setup', false, `Error: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// CORS and API Connectivity Test
async function testCORS() {
    console.log('\n🌍 Testing CORS and API Connectivity...');
    
    try {
        // Test preflight request
        const corsResponse = await axios.options(`${BACKEND_URL}/vehicles`, {
            headers: {
                'Origin': FRONTEND_URL,
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Authorization'
            }
        });
        
        logTest('integration', 'CORS Preflight', true, 'CORS preflight request successful');
    } catch (error) {
        logTest('integration', 'CORS Preflight', false, `Error: ${error.message}`);
    }
}

// Generate Report
function generateReport() {
    console.log('\n📊 Integration Test Report');
    console.log('=' .repeat(50));
    
    const categories = ['backend', 'frontend', 'integration'];
    let totalPassed = 0;
    let totalFailed = 0;
    
    categories.forEach(category => {
        const results = testResults[category];
        const total = results.passed + results.failed;
        const percentage = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
        
        console.log(`\n${category.toUpperCase()} TESTS:`);
        console.log(`  ✅ Passed: ${results.passed}`);
        console.log(`  ❌ Failed: ${results.failed}`);
        console.log(`  📈 Success Rate: ${percentage}%`);
        
        totalPassed += results.passed;
        totalFailed += results.failed;
    });
    
    const overallTotal = totalPassed + totalFailed;
    const overallPercentage = overallTotal > 0 ? ((totalPassed / overallTotal) * 100).toFixed(1) : 0;
    
    console.log('\nOVERALL RESULTS:');
    console.log(`  ✅ Total Passed: ${totalPassed}`);
    console.log(`  ❌ Total Failed: ${totalFailed}`);
    console.log(`  📈 Overall Success Rate: ${overallPercentage}%`);
    
    // Detailed test results
    console.log('\nDETAILED RESULTS:');
    categories.forEach(category => {
        console.log(`\n${category.toUpperCase()}:`);
        testResults[category].tests.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`  ${status} ${test.testName}`);
            if (test.details) console.log(`      ${test.details}`);
        });
    });
    
    return {
        totalPassed,
        totalFailed,
        overallPercentage,
        categories: testResults
    };
}

// Main execution
async function runIntegrationTests() {
    console.log('🚀 Starting Comprehensive Integration Tests');
    console.log('Testing Frontend-Backend Integration for Vehicle & Room Management System');
    console.log('=' .repeat(80));
    
    try {
        await testBackendAPIs();
        await testFrontend();
        await testCORS();
        await testIntegration();
        
        const report = generateReport();
        
        // Save report to file
        const fs = require('fs');
        const reportPath = '/Users/nguyenbinhan/Workspace/Project-IT4082/04_Testing/integration-test-results.json';
        fs.writeFileSync(reportPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: report.totalPassed + report.totalFailed,
                passed: report.totalPassed,
                failed: report.totalFailed,
                successRate: report.overallPercentage
            },
            results: report.categories
        }, null, 2));
        
        console.log(`\n💾 Detailed results saved to: ${reportPath}`);
        
        if (report.totalFailed === 0) {
            console.log('\n🎉 ALL TESTS PASSED! Integration is working perfectly.');
        } else {
            console.log(`\n⚠️  ${report.totalFailed} test(s) failed. Please review the issues above.`);
        }
        
    } catch (error) {
        console.error('❌ Fatal error during testing:', error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    runIntegrationTests();
}

module.exports = { runIntegrationTests, testResults };
