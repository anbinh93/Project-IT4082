const vehicleService = require('./services/vehicleService');

async function testVehicleService() {
  try {
    console.log('🧪 Testing Vehicle Service...\n');
    
    // Test 1: Get all vehicle types
    console.log('1. Testing getVehicleTypes()');
    const types = await vehicleService.getVehicleTypes();
    console.log('✅ Vehicle types:', types);
    
    // Test 2: Get all vehicles
    console.log('\n2. Testing getAllVehicles()');
    const vehicles = await vehicleService.getAllVehicles();
    console.log('✅ Vehicles:', vehicles);
    
    // Test 3: Create a vehicle type first
    console.log('\n3. Testing createVehicleType()');
    const newType = await vehicleService.createVehicleType({
      ten: 'Xe máy Honda',
      phiThue: 50000,
      moTa: 'Xe máy phổ thông'
    });
    console.log('✅ Created vehicle type:', newType);
    
    // Test 4: Create a vehicle
    console.log('\n4. Testing createVehicle()');
    const newVehicle = await vehicleService.createVehicle({
      hoKhauId: 1,
      loaiXeId: newType.id,
      bienSo: 'TEST-001',
      ghiChu: 'Test vehicle from service'
    });
    console.log('✅ Created vehicle:', newVehicle);
    
    // Test 5: Get vehicle by ID
    console.log('\n5. Testing getVehicleById()');
    const vehicle = await vehicleService.getVehicleById(newVehicle.id);
    console.log('✅ Retrieved vehicle:', vehicle);
    
    // Test 6: Update vehicle
    console.log('\n6. Testing updateVehicle()');
    const updatedVehicle = await vehicleService.updateVehicle(newVehicle.id, {
      ghiChu: 'Updated test vehicle'
    });
    console.log('✅ Updated vehicle:', updatedVehicle);
    
    // Test 7: Get statistics
    console.log('\n7. Testing getVehicleStatistics()');
    const stats = await vehicleService.getVehicleStatistics();
    console.log('✅ Vehicle statistics:', stats);
    
    // Test 8: Delete vehicle
    console.log('\n8. Testing deleteVehicle()');
    await vehicleService.deleteVehicle(newVehicle.id);
    console.log('✅ Vehicle deleted successfully');
    
    // Test 9: Delete vehicle type
    console.log('\n9. Testing deleteVehicleType()');
    await vehicleService.deleteVehicleType(newType.id);
    console.log('✅ Vehicle type deleted successfully');
    
    console.log('\n🎉 All vehicle service tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    process.exit();
  }
}

testVehicleService();
