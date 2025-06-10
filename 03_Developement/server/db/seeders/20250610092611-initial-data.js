'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Insert Users
    await queryInterface.bulkInsert('Users', [
      {
        username: 'ketoan',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'accountant',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'totruong',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert LoaiXe
    await queryInterface.bulkInsert('LoaiXe', [
      {
        ten: 'Xe máy',
        phiThue: 100000,
        moTa: 'Phí gửi xe máy hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ten: 'Ô tô',
        phiThue: 500000,
        moTa: 'Phí gửi ô tô hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert some Canho
    await queryInterface.bulkInsert('Canho', [
      {
        soPhong: 101,
        hoKhauId: null,
        dienTich: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        soPhong: 102,
        hoKhauId: null,
        dienTich: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Canho', null, {});
    await queryInterface.bulkDelete('LoaiXe', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
