'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rooms = [];
    
    // Generate rooms for floors 1-15, each floor has rooms 01-10
    for (let floor = 1; floor <= 15; floor++) {
      for (let roomNum = 1; roomNum <= 10; roomNum++) {
        const soPhong = `${floor.toString().padStart(2, '0')}${roomNum.toString().padStart(2, '0')}`;
        
        // Vary room sizes but no prices (removed donGia)
        let dienTich;
        if (roomNum <= 3) {
          dienTich = 45; // Small rooms
        } else if (roomNum <= 7) {
          dienTich = 65; // Medium rooms  
        } else {
          dienTich = 85; // Large rooms
        }
        
        rooms.push({
          soPhong: soPhong,
          tang: floor.toString(),
          dienTich: dienTich,
          hoKhauId: null, // Start with all rooms available
          ngayBatDau: null,
          ngayKetThuc: null,
          trangThai: 'trong',
          ghiChu: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    // Assign some rooms to existing households (if any exist)
    // Let's assume households 1, 2, 3 exist and assign them to some rooms
    const assignedRooms = [
      { soPhong: '0101', hoKhauId: 1, trangThai: 'da_thue', ngayBatDau: new Date('2024-01-01') },
      { soPhong: '0205', hoKhauId: 2, trangThai: 'da_thue', ngayBatDau: new Date('2024-02-01') },
      { soPhong: '0308', hoKhauId: 3, trangThai: 'da_thue', ngayBatDau: new Date('2024-03-01') }
    ];
    
    // Update assigned rooms
    assignedRooms.forEach(assigned => {
      const room = rooms.find(r => r.soPhong === assigned.soPhong);
      if (room) {
        room.hoKhauId = assigned.hoKhauId;
        room.trangThai = assigned.trangThai;
        room.ngayBatDau = assigned.ngayBatDau;
      }
    });
    
    // Add a few rooms under maintenance
    const maintenanceRooms = ['0410', '0715'];
    maintenanceRooms.forEach(soPhong => {
      const room = rooms.find(r => r.soPhong === soPhong);
      if (room) {
        room.trangThai = 'bao_tri';
        room.ghiChu = 'Đang sửa chữa hệ thống điện';
      }
    });

    await queryInterface.bulkInsert('Rooms', rooms, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Rooms', null, {});
  }
};
