'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lichsuthaydoihokhau', [
      {
        nhankhau_id: 1, // Nguyễn Văn A
        hokhau_id: 1,
        loaithaydoi: 1, // 1: Tạo mới hộ khẩu
        thoigian: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 2, // Trần Thị B
        hokhau_id: 1,
        loaithaydoi: 2, // 2: Thêm thành viên
        thoigian: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 3, // Nguyễn Văn C
        hokhau_id: 1,
        loaithaydoi: 2, // 2: Thêm thành viên
        thoigian: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 4, // Lê Văn D
        hokhau_id: 2,
        loaithaydoi: 1, // 1: Tạo mới hộ khẩu
        thoigian: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nhankhau_id: 5, // Phạm Thị E
        hokhau_id: 2,
        loaithaydoi: 2, // 2: Thêm thành viên
        thoigian: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lichsuthaydoihokhau', null, {});
  }
};