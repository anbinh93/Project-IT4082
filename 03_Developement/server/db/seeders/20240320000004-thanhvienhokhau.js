'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('thanhvienhokhau', [
      {
        nhankhau_id: 1, // Nguyễn Văn A
        hokhau_id: 1,
        ngaythemnhankhau: new Date('2020-01-01'),
        quanhevoichuho: 'Chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 2, // Trần Thị B
        hokhau_id: 1,
        ngaythemnhankhau: new Date('2020-01-01'),
        quanhevoichuho: 'Vợ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 3, // Nguyễn Văn C
        hokhau_id: 1,
        ngaythemnhankhau: new Date('2020-01-01'),
        quanhevoichuho: 'Con',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 4, // Lê Văn D
        hokhau_id: 2,
        ngaythemnhankhau: new Date('2020-01-01'),
        quanhevoichuho: 'Chủ hộ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 5, // Phạm Thị E
        hokhau_id: 2,
        ngaythemnhankhau: new Date('2020-01-01'),
        quanhevoichuho: 'Vợ',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('thanhvienhokhau', null, {});
  }
};