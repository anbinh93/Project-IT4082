'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tamtrutamvang', [
      {
        nhankhau_id: 3, // Nguyễn Văn C
        trangthai: 'Tạm vắng',
        diachi: 'Số 789 Đường ABC, Quận XYZ, TP HCM',
        thoigian: new Date('2024-03-01'),
        noidungdenghi: 'Đi học tại TP HCM',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 5, // Phạm Thị E
        trangthai: 'Tạm trú',
        diachi: 'Số 321 Đường DEF, Quận KLM, Hà Nội',
        thoigian: new Date('2024-02-01'),
        noidungdenghi: 'Công tác tại Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tamtrutamvang', null, {});
  }
};