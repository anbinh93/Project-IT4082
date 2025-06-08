'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed data for system setup
    
    // 1. Create default admin user if not exists
    const existingAdmin = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = 'admin' LIMIT 1",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin.length === 0) {
      await queryInterface.bulkInsert('users', [
        {
          username: 'admin',
          password: '$2a$10$wI7Tn8J9wK4rQKJ5cPQoTOP5HqkKF8vXQJY5.wCnXhVjGfD8JZQZ.', // password: admin123
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'manager',
          password: '$2a$10$wI7Tn8J9wK4rQKJ5cPQoTOP5HqkKF8vXQJY5.wCnXhVjGfD8JZQZ.', // password: admin123
          role: 'manager',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'to_truong_01',
          password: '$2a$10$wI7Tn8J9wK4rQKJ5cPQoTOP5HqkKF8vXQJY5.wCnXhVjGfD8JZQZ.', // password: admin123
          role: 'to_truong',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: 'accountant',
          password: '$2a$10$wI7Tn8J9wK4rQKJ5cPQoTOP5HqkKF8vXQJY5.wCnXhVjGfD8JZQZ.', // password: admin123
          role: 'accountant',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // 2. Create sample rooms if table is empty
    const existingRooms = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM phong",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (parseInt(existingRooms[0].count) === 0) {
      const rooms = [];
      // Create 20 sample rooms across 4 floors
      for (let floor = 1; floor <= 4; floor++) {
        for (let roomNum = 1; roomNum <= 5; roomNum++) {
          const soPhong = floor * 100 + roomNum;
          const roomTypes = ['Studio', '1PN', '2PN', '3PN'];
          const roomType = roomTypes[(roomNum - 1) % 4];
          
          let dienTich, giaThue;
          switch (roomType) {
            case 'Studio': dienTich = 25.5; giaThue = 3500000; break;
            case '1PN': dienTich = 35.0; giaThue = 5000000; break;
            case '2PN': dienTich = 45.5; giaThue = 7500000; break;
            case '3PN': dienTich = 55.0; giaThue = 10000000; break;
          }

          rooms.push({
            soPhong: soPhong,
            tang: floor,
            dienTich: dienTich,
            loaiPhong: roomType,
            giaThue: giaThue,
            trangThai: Math.random() > 0.3 ? 'Trống' : 'Đã thuê',
            ngayVaoO: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
      
      await queryInterface.bulkInsert('phong', rooms);
    }

    // 3. Create sample households and population
    const existingHouseholds = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM hokhau",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (parseInt(existingHouseholds[0].count) === 0) {
      // Create sample population data
      const samplePeople = [
        { hoTen: 'Nguyễn Văn An', ngaySinh: '1980-05-15', gioiTinh: 'Nam', cccd: '001080012345', ngheNghiep: 'Kỹ sư' },
        { hoTen: 'Trần Thị Bình', ngaySinh: '1985-08-20', gioiTinh: 'Nữ', cccd: '001085067890', ngheNghiep: 'Giáo viên' },
        { hoTen: 'Lê Văn Cường', ngaySinh: '1975-12-10', gioiTinh: 'Nam', cccd: '001075034567', ngheNghiep: 'Bác sĩ' },
        { hoTen: 'Phạm Thị Dung', ngaySinh: '1990-03-25', gioiTinh: 'Nữ', cccd: '001090012890', ngheNghiep: 'Kế toán' },
        { hoTen: 'Hoàng Văn Em', ngaySinh: '1988-07-14', gioiTinh: 'Nam', cccd: '001088056789', ngheNghiep: 'Lập trình viên' }
      ];

      const people = [];
      for (let i = 0; i < samplePeople.length; i++) {
        people.push({
          ...samplePeople[i],
          danToc: 'Kinh',
          tonGiao: 'Không',
          ngayCap: new Date('2020-01-01'),
          noiCap: 'CA Hà Nội',
          ghiChu: 'Dữ liệu mẫu',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await queryInterface.bulkInsert('nhankhau', people);

      // Create sample households
      const households = [];
      for (let i = 1; i <= 5; i++) {
        households.push({
          chuHo: i,
          soNha: `Số ${i}`,
          duong: 'Đường Láng',
          phuong: 'Láng Thượng',
          quan: 'Đống Đa',
          thanhPho: 'Hà Nội',
          ngayLamHoKhau: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await queryInterface.bulkInsert('hokhau', households);
    }

    // 4. Create sample fee types (khoanthu)
    const existingFees = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM khoanthu",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (parseInt(existingFees[0].count) === 0) {
      await queryInterface.bulkInsert('khoanthu', [
        {
          tenKhoanThu: 'Phí điện',
          batBuoc: true,
          ghiChu: 'Phí điện hàng tháng theo đồng hồ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenKhoanThu: 'Phí nước',
          batBuoc: true,
          ghiChu: 'Phí nước hàng tháng theo đồng hồ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenKhoanThu: 'Phí internet',
          batBuoc: false,
          ghiChu: 'Phí internet hàng tháng (tùy chọn)',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenKhoanThu: 'Phí vệ sinh',
          batBuoc: true,
          ghiChu: 'Phí vệ sinh chung hàng tháng',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenKhoanThu: 'Phí bảo trì',
          batBuoc: false,
          ghiChu: 'Phí bảo trì thiết bị chung',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // 5. Create sample vehicle types
    const existingVehicleTypes = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM loaixe",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (parseInt(existingVehicleTypes[0].count) === 0) {
      await queryInterface.bulkInsert('loaixe', [
        {
          tenLoaiXe: 'Xe máy',
          phiThang: 50000,
          moTa: 'Phí gửi xe máy hàng tháng',
          trangThai: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenLoaiXe: 'Xe đạp',
          phiThang: 20000,
          moTa: 'Phí gửi xe đạp hàng tháng',
          trangThai: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenLoaiXe: 'Ô tô',
          phiThang: 300000,
          moTa: 'Phí gửi ô tô hàng tháng',
          trangThai: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          tenLoaiXe: 'Xe điện',
          phiThang: 30000,
          moTa: 'Phí gửi xe điện hàng tháng',
          trangThai: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    console.log('✅ Seed data created successfully');
  },

  async down(queryInterface, Sequelize) {
    // Remove seed data in reverse order
    await queryInterface.bulkDelete('loaixe', null, {});
    await queryInterface.bulkDelete('khoanthu', null, {});
    await queryInterface.bulkDelete('hokhau', null, {});
    await queryInterface.bulkDelete('nhankhau', null, {});
    await queryInterface.bulkDelete('phong', null, {});
    await queryInterface.bulkDelete('users', null, {});
    
    console.log('✅ Seed data removed successfully');
  }
};
