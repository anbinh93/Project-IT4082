'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('hokhau', [
      {
        chuho: 1, // ID của Nguyễn Văn A
        sonha: '123',
        duong: 'Đường Láng',
        phuong: 'Láng Thượng',
        quan: 'Đống Đa',
        thanhpho: 'Hà Nội',
        ngaylamhokhau: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        chuho: 4, // ID của Lê Văn D
        sonha: '456',
        duong: 'Nguyễn Trãi',
        phuong: 'Thanh Xuân Nam',
        quan: 'Thanh Xuân',
        thanhpho: 'Hà Nội',
        ngaylamhokhau: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hokhau', null, {});
  }
};