const db = require('../db/models');
const { Room, HoKhau } = db;

async function syncRoomsWithHouseholds() {
  try {
    console.log('🔄 Bắt đầu đồng bộ dữ liệu phòng với hộ khẩu...');
    
    // Get all households
    const households = await HoKhau.findAll({
      include: ['chuHoInfo']
    });
    
    console.log(`📋 Tìm thấy ${households.length} hộ khẩu`);
    
    for (const household of households) {
      const { soHoKhau, soNha, chuHoInfo } = household;
      
      // Convert soNha to room number format
      // Example: "101" -> "0101", "201" -> "0201", "401A" -> "0401" (ignore letters)
      let roomNumber = soNha.replace(/[A-Za-z]/g, ''); // Remove letters
      if (roomNumber.length === 3) {
        roomNumber = '0' + roomNumber; // Add leading zero for 3-digit numbers
      }
      
      console.log(`🏠 Xử lý hộ khẩu ${soHoKhau}: số nhà "${soNha}" -> phòng "${roomNumber}"`);
      
      // Find existing room with this number
      let room = await Room.findOne({ where: { soPhong: roomNumber } });
      
      if (room) {
        // Update existing room
        await room.update({
          hoKhauId: soHoKhau,
          trangThai: 'da_thue',
          ngayBatDau: household.ngayLamHoKhau || new Date(),
          nguoiThue: chuHoInfo?.hoTen || null // For now, use chuHo as nguoiThue
        });
        console.log(`✅ Cập nhật phòng ${roomNumber} cho hộ khẩu ${soHoKhau}`);
      } else {
        console.log(`⚠️  Không tìm thấy phòng ${roomNumber} cho hộ khẩu ${soHoKhau}`);
      }
    }
    
    console.log('✨ Hoàn thành đồng bộ dữ liệu!');
  } catch (error) {
    console.error('❌ Lỗi khi đồng bộ dữ liệu:', error);
  }
}

// Run the sync if this file is executed directly
if (require.main === module) {
  syncRoomsWithHouseholds().then(() => {
    process.exit(0);
  });
}

module.exports = { syncRoomsWithHouseholds };
