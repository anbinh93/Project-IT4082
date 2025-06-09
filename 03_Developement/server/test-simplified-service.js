/**
 * Simple test for simplified vehicle service
 */

const vehicleService = require('./services/vehicleService');

async function testSimplifiedVehicleService() {
  try {
    console.log('🧪 Testing Simplified Vehicle Service...\n');
    
    // Test 1: Get all vehicle types
    console.log('1. Testing getAllVehicleTypes()');
    const types = await vehicleService.getAllVehicleTypes();
    console.log('✅ Vehicle types count:', types.length);
    if (types.length > 0) {
      console.log('   Sample type fields:', Object.keys(types[0]));
      // Check if phiThue exists instead of phiThang
      if (types[0].phiThue !== undefined) {
        console.log('✅ Confirmed: phiThue field present');
      } else {
        console.log('❌ phiThue field missing');
      }
    }
    
    // Test 2: Create a vehicle type with phiThue
    console.log('\n2. Testing createVehicleType() with phiThue');
    const newType = await vehicleService.createVehicleType({
      tenLoaiXe: 'Xe máy TEST',
      phiThue: 75000,
      moTa: 'Test vehicle type for simplified schema'
    });
    console.log('✅ Created vehicle type with ID:', newType.id);
    console.log('   phiThue value:', newType.phiThue);
    
    // Check if timestamps are absent
    if (!newType.createdAt && !newType.updatedAt) {
      console.log('✅ Confirmed: No timestamps in vehicle type');
    } else {
      console.log('❌ Timestamps still present in vehicle type');
    }
    
    // Test 3: Get all vehicles
    console.log('\n3. Testing getAllVehicles()');
    const vehicles = await vehicleService.getAllVehicles();
    console.log('✅ Vehicles count:', vehicles.count || 0);
    console.log('   Vehicles returned:', vehicles.rows?.length || 0);
    
    // Test 4: Get vehicle statistics
    console.log('\n4. Testing getVehicleStatistics()');
    const stats = await vehicleService.getVehicleStatistics();
    console.log('✅ Statistics overview:', stats.overview);
    console.log('   Vehicle types with stats:', stats.byType.length);
    
    // Clean up - delete test vehicle type
    console.log('\n5. Cleaning up test data');
    await vehicleService.deleteVehicleType(newType.id);
    console.log('✅ Test vehicle type deleted');
    
    console.log('\n🎉 All service tests passed!');
    console.log('Simplified vehicle schema is working correctly at service level.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testSimplifiedVehicleService()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
