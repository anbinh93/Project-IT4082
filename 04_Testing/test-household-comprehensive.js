const { HouseholdAPITester } = require('./test-household-management-api');
const { HouseholdMemberAPITester } = require('./test-household-member-api');
const { HouseholdFeeAPITester } = require('./test-household-fee-api');
const { HouseholdHousingAPITester } = require('./test-household-housing-api');

/**
 * 🏠 COMPREHENSIVE HOUSEHOLD MANAGEMENT API TEST SUITE
 * 
 * This master test runner executes all household management related tests:
 * 1. Core household CRUD operations
 * 2. Household member management
 * 3. Household fee management
 * 4. Household housing (room/apartment) management
 * 
 * Usage:
 * node test-household-comprehensive.js
 */

class ComprehensiveHouseholdTester {
  constructor() {
    this.overallResults = {
      totalSuites: 0,
      passedSuites: 0,
      failedSuites: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      suiteResults: []
    };
  }

  async runAllTestSuites() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 STARTING COMPREHENSIVE HOUSEHOLD MANAGEMENT API TESTS');
    console.log('='.repeat(80));
    console.log('📅 Test Run Date:', new Date().toLocaleString());
    console.log('🔧 Test Environment: Development');
    console.log('🌐 API Base URL: http://localhost:8000/api');
    console.log('='.repeat(80));

    const testSuites = [
      {
        name: 'Household Management API',
        tester: new HouseholdAPITester(),
        description: 'Core household CRUD operations, search, and basic management'
      },
      {
        name: 'Household Member Management API',
        tester: new HouseholdMemberAPITester(),
        description: 'Member addition, removal, separation, and relationship management'
      },
      {
        name: 'Household Fee Management API',
        tester: new HouseholdFeeAPITester(),
        description: 'Fee collection, payment tracking, and financial reporting'
      },
      {
        name: 'Household Housing Management API',
        tester: new HouseholdHousingAPITester(),
        description: 'Room and apartment assignment, availability, and housing statistics'
      }
    ];

    for (const suite of testSuites) {
      await this.runTestSuite(suite);
    }

    this.printComprehensiveSummary();
    this.generateTestReport();
  }

  async runTestSuite(suite) {
    this.overallResults.totalSuites++;
    
    console.log(`\n📦 Running Test Suite: ${suite.name}`);
    console.log(`📝 Description: ${suite.description}`);
    console.log('-'.repeat(60));

    const startTime = Date.now();
    
    try {
      await suite.tester.runAllTests();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      // Extract results from the tester
      const suiteResults = suite.tester.testResults;
      
      this.overallResults.totalTests += suiteResults.total;
      this.overallResults.passedTests += suiteResults.passed;
      this.overallResults.failedTests += suiteResults.failed;
      
      const suiteSuccess = suiteResults.failed === 0;
      if (suiteSuccess) {
        this.overallResults.passedSuites++;
      } else {
        this.overallResults.failedSuites++;
      }

      this.overallResults.suiteResults.push({
        name: suite.name,
        description: suite.description,
        passed: suiteSuccess,
        duration: duration,
        totalTests: suiteResults.total,
        passedTests: suiteResults.passed,
        failedTests: suiteResults.failed,
        details: suiteResults.details
      });

      console.log(`⏱️ Suite completed in ${duration}s`);
      console.log(`📊 Suite Results: ${suiteResults.passed}/${suiteResults.total} tests passed`);
      
    } catch (error) {
      this.overallResults.failedSuites++;
      console.error(`❌ Test suite failed with error: ${error.message}`);
      
      this.overallResults.suiteResults.push({
        name: suite.name,
        description: suite.description,
        passed: false,
        duration: '0',
        totalTests: 0,
        passedTests: 0,
        failedTests: 1,
        error: error.message,
        details: []
      });
    }
  }

  printComprehensiveSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE HOUSEHOLD MANAGEMENT API TEST SUMMARY');
    console.log('='.repeat(80));
    
    // Overall statistics
    console.log('🔢 OVERALL STATISTICS:');
    console.log(`   Total Test Suites: ${this.overallResults.totalSuites}`);
    console.log(`   Passed Suites: ${this.overallResults.passedSuites} ✅`);
    console.log(`   Failed Suites: ${this.overallResults.failedSuites} ❌`);
    console.log(`   Total Tests: ${this.overallResults.totalTests}`);
    console.log(`   Passed Tests: ${this.overallResults.passedTests} ✅`);
    console.log(`   Failed Tests: ${this.overallResults.failedTests} ❌`);
    
    const overallSuccessRate = this.overallResults.totalTests > 0 
      ? ((this.overallResults.passedTests / this.overallResults.totalTests) * 100).toFixed(2)
      : 0;
    console.log(`   Overall Success Rate: ${overallSuccessRate}%`);

    // Suite breakdown
    console.log('\n📋 SUITE BREAKDOWN:');
    this.overallResults.suiteResults.forEach((suite, index) => {
      const status = suite.passed ? '✅' : '❌';
      const successRate = suite.totalTests > 0 
        ? ((suite.passedTests / suite.totalTests) * 100).toFixed(1)
        : '0';
      
      console.log(`   ${index + 1}. ${suite.name} ${status}`);
      console.log(`      Tests: ${suite.passedTests}/${suite.totalTests} (${successRate}%)`);
      console.log(`      Duration: ${suite.duration}s`);
      
      if (suite.error) {
        console.log(`      Error: ${suite.error}`);
      }
    });

    // Failed tests summary
    if (this.overallResults.failedTests > 0) {
      console.log('\n❌ FAILED TESTS SUMMARY:');
      this.overallResults.suiteResults.forEach(suite => {
        const failedTests = suite.details?.filter(test => !test.passed) || [];
        if (failedTests.length > 0) {
          console.log(`\n   ${suite.name}:`);
          failedTests.forEach(test => {
            console.log(`     • ${test.name}: ${test.details}`);
          });
        }
      });
    }

    // Coverage summary
    console.log('\n🎯 API COVERAGE SUMMARY:');
    console.log('   ✓ Household CRUD Operations');
    console.log('   ✓ Household Search & Filtering');
    console.log('   ✓ Member Addition & Removal');
    console.log('   ✓ Household Separation (Tách hộ)');
    console.log('   ✓ Head Assignment');
    console.log('   ✓ Fee Collection & Payment');
    console.log('   ✓ Fee Calculation & Recalculation');
    console.log('   ✓ Room & Apartment Assignment');
    console.log('   ✓ Housing Availability Queries');
    console.log('   ✓ Statistics & Reporting');
    console.log('   ✓ Error Handling & Validation');
    console.log('   ✓ Authentication & Authorization');

    // Recommendations
    this.printRecommendations();

    console.log('\n' + '='.repeat(80));
  }

  printRecommendations() {
    console.log('\n💡 RECOMMENDATIONS:');

    if (this.overallResults.failedTests === 0) {
      console.log('   🎉 All tests passed! The API is working correctly.');
      console.log('   ✅ Consider adding more edge case tests.');
      console.log('   ✅ Consider adding performance tests.');
    } else {
      console.log('   ⚠️ Some tests failed. Please review the failed test details above.');
      
      if (this.overallResults.failedSuites > 0) {
        console.log('   🔧 Focus on fixing failed test suites first.');
      }
      
      const successRate = (this.overallResults.passedTests / this.overallResults.totalTests) * 100;
      if (successRate < 80) {
        console.log('   ⚠️ Success rate is below 80%. Consider reviewing API implementation.');
      }
    }

    console.log('   📚 Ensure all API endpoints have proper error handling.');
    console.log('   🔒 Verify authentication is working correctly for all endpoints.');
    console.log('   📊 Consider adding more comprehensive integration tests.');
  }

  generateTestReport() {
    const reportData = {
      testRun: {
        date: new Date().toISOString(),
        environment: 'development',
        apiBaseUrl: 'http://localhost:8000/api'
      },
      summary: {
        totalSuites: this.overallResults.totalSuites,
        passedSuites: this.overallResults.passedSuites,
        failedSuites: this.overallResults.failedSuites,
        totalTests: this.overallResults.totalTests,
        passedTests: this.overallResults.passedTests,
        failedTests: this.overallResults.failedTests,
        successRate: this.overallResults.totalTests > 0 
          ? ((this.overallResults.passedTests / this.overallResults.totalTests) * 100).toFixed(2)
          : 0
      },
      suites: this.overallResults.suiteResults
    };

    // In a real scenario, you might want to save this to a file
    console.log('\n📄 Test report data generated (JSON format available for export)');
    
    // Uncomment the following lines to save report to file:
    // const fs = require('fs');
    // const reportPath = `./test-report-${Date.now()}.json`;
    // fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    // console.log(`📁 Test report saved to: ${reportPath}`);
  }
}

// Main execution
async function runComprehensiveHouseholdTests() {
  const tester = new ComprehensiveHouseholdTester();
  await tester.runAllTestSuites();
}

// Export for use in other test files
module.exports = { ComprehensiveHouseholdTester };

// Run tests if this file is executed directly
if (require.main === module) {
  runComprehensiveHouseholdTests().catch(console.error);
}
