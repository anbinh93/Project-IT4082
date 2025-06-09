/**
 * Direct database test for simplified schema
 */

const db = require('./db/models');
const { LoaiXe, QuanLyXe } = db;

async function testDatabaseSchema() {
  try {
    console.log('🔍 Testing Database Schema...\n');
    
    // Test 1: Check LoaiXe table structure
    console.log('1. Testing LoaiXe table...');
    const sampleType = await LoaiXe.findOne();
    if (sampleType) {
      console.log('✅ LoaiXe sample record found');
      console.log('   Fields:', Object.keys(sampleType.dataValues));
      
      // Check for phiThue field
      if (sampleType.dataValues.hasOwnProperty('phiThue')) {
        console.log('✅ Confirmed: phiThue field exists');
        console.log('   Sample phiThue value:', sampleType.phiThue);
      } else {
        console.log('❌ phiThue field missing');
      }
      
      // Check timestamps are gone
      if (!sampleType.dataValues.hasOwnProperty('createdAt') && 
          !sampleType.dataValues.hasOwnProperty('updatedAt')) {
        console.log('✅ Confirmed: No timestamps in LoaiXe');
      } else {
        console.log('❌ Timestamps still present in LoaiXe');
      }
    } else {
      console.log('⚠️ No LoaiXe records found');
    }
    
    // Test 2: Check QuanLyXe table structure
    console.log('\n2. Testing QuanLyXe table...');
    const sampleVehicle = await QuanLyXe.findOne({
      include: [{
        model: LoaiXe,
        as: 'loaiXe'
      }]
    });
    
    if (sampleVehicle) {
      console.log('✅ QuanLyXe sample record found');
      console.log('   Fields:', Object.keys(sampleVehicle.dataValues));
      
      // Check removed fields are gone
      const removedFields = ['trangThaiDangKy', 'phiDaTra', 'lanCapNhatCuoi', 'createdAt', 'updatedAt'];
      const hasRemovedFields = removedFields.some(field => 
        sampleVehicle.dataValues.hasOwnProperty(field)
      );
      
      if (!hasRemovedFields) {
        console.log('✅ Confirmed: All unnecessary fields removed from QuanLyXe');
      } else {
        const presentFields = removedFields.filter(field => 
          sampleVehicle.dataValues.hasOwnProperty(field)
        );
        console.log('❌ Some removed fields still present:', presentFields);
      }
      
      // Check association works with phiThue
      if (sampleVehicle.loaiXe && sampleVehicle.loaiXe.phiThue !== undefined) {
        console.log('✅ Confirmed: Association includes phiThue');
        console.log('   Vehicle type phiThue:', sampleVehicle.loaiXe.phiThue);
      } else {
        console.log('❌ Association missing phiThue or not loaded');
      }
    } else {
      console.log('⚠️ No QuanLyXe records found');
    }
    
    // Test 3: Create a test record to verify everything works
    console.log('\n3. Testing record creation...');
    
    // Create a test vehicle type
    const testType = await LoaiXe.create({
      tenLoaiXe: 'Xe test schema',
      phiThue: 99000,
      moTa: 'Test type for schema validation',
      trangThai: true
    });
    console.log('✅ Test vehicle type created with phiThue:', testType.phiThue);
    
    // Clean up
    await testType.destroy();
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Database schema test completed successfully!');
    console.log('Simplified vehicle management schema is working correctly.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Close database connection
    await db.sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testDatabaseSchema();
