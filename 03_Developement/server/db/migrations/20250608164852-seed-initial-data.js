'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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

    // 2. Create sample fee types (khoanthu)
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
        }
      ]);
    }

    // 3. Create sample vehicle types
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
        }
      ]);
    }

    console.log('✅ Basic seed data created successfully');
  },

  async down (queryInterface, Sequelize) {
    // Remove seed data in reverse order
    await queryInterface.bulkDelete('loaixe', null, {});
    await queryInterface.bulkDelete('khoanthu', null, {});
    await queryInterface.bulkDelete('users', {
      username: ['admin', 'manager', 'to_truong_01', 'accountant']
    }, {});
    
    console.log('✅ Seed data removed successfully');
  }
};
