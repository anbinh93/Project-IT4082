const db = require('../db/models');
const { Room, HoKhau } = db;

async function checkDuplicateRooms() {
  try {
    console.log('🔍 Checking for duplicate rooms...');
    
    // Get all rooms
    const allRooms = await Room.findAll({
      order: [['soPhong', 'ASC']]
    });
    
    console.log(`📊 Total rooms in database: ${allRooms.length}`);
    
    // Check for duplicates by soPhong
    const roomNumbers = new Map();
    const duplicates = [];
    
    allRooms.forEach(room => {
      if (roomNumbers.has(room.soPhong)) {
        duplicates.push({
          soPhong: room.soPhong,
          existing: roomNumbers.get(room.soPhong),
          duplicate: room
        });
      } else {
        roomNumbers.set(room.soPhong, room);
      }
    });
    
    if (duplicates.length > 0) {
      console.log('❌ Found duplicate rooms:');
      duplicates.forEach(dup => {
        console.log(`  - Room ${dup.soPhong}:`);
        console.log(`    Existing: ID ${dup.existing.id}, Status: ${dup.existing.trangThai}, HouseholdID: ${dup.existing.hoKhauId}`);
        console.log(`    Duplicate: ID ${dup.duplicate.id}, Status: ${dup.duplicate.trangThai}, HouseholdID: ${dup.duplicate.hoKhauId}`);
      });
    } else {
      console.log('✅ No duplicate rooms found');
    }
    
    // Check rooms without households
    const roomsWithoutHousehold = allRooms.filter(room => !room.hoKhauId);
    console.log(`📋 Rooms without household: ${roomsWithoutHousehold.length}`);
    
    if (roomsWithoutHousehold.length > 0) {
      console.log('Rooms without household:');
      roomsWithoutHousehold.forEach(room => {
        console.log(`  - Room ${room.soPhong} (ID: ${room.id}, Status: ${room.trangThai})`);
      });
    }
    
    // Check households and their room assignments
    const allHouseholds = await HoKhau.findAll({
      include: [{
        model: Room,
        as: 'room',
        required: false
      }]
    });
    
    console.log(`👨‍👩‍👧‍👦 Total households: ${allHouseholds.length}`);
    
    const householdsWithoutRoom = allHouseholds.filter(h => !h.room);
    const householdsWithRoom = allHouseholds.filter(h => h.room);
    
    console.log(`🏠 Households with room assigned: ${householdsWithRoom.length}`);
    console.log(`🏠 Households without room: ${householdsWithoutRoom.length}`);
    
    if (householdsWithoutRoom.length > 0) {
      console.log('Households without room:');
      householdsWithoutRoom.slice(0, 10).forEach(h => {
        console.log(`  - HK${h.soHoKhau.toString().padStart(3, '0')}: ${h.soNha || 'No address'}`);
      });
      if (householdsWithoutRoom.length > 10) {
        console.log(`  ... and ${householdsWithoutRoom.length - 10} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking rooms:', error);
  } finally {
    await db.sequelize.close();
  }
}

checkDuplicateRooms();
