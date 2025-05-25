'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('khoanthu', [
      {
        ngaytao: new Date('2024-01-01'),
        thoihan: new Date('2024-12-31'),
        tenkhoanthu: 'Phí vệ sinh',
        batbuoc: true,
        ghichu: 'Thu hàng tháng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ngaytao: new Date('2024-01-01'),
        thoihan: new Date('2024-12-31'),
        tenkhoanthu: 'Phí an ninh',
        batbuoc: true,
        ghichu: 'Thu hàng quý',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ngaytao: new Date('2024-01-01'),
        thoihan: new Date('2024-12-31'),
        tenkhoanthu: 'Quỹ khuyến học',
        batbuoc: false,
        ghichu: 'Thu theo năm học',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('khoanthu', null, {});
  }
};