'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('nopphi', [
      {
        hokhau_id: 1,
        khoanthu_id: 1,
        nguoinop: 'Nguyễn Văn A',
        sotien: 50000,
        ngaynop: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hokhau_id: 1,
        khoanthu_id: 2,
        nguoinop: 'Nguyễn Văn A',
        sotien: 200000,
        ngaynop: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hokhau_id: 1,
        khoanthu_id: 3,
        nguoinop: 'Nguyễn Văn A',
        sotien: 500000,
        ngaynop: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hokhau_id: 2,
        khoanthu_id: 1,
        nguoinop: 'Lê Văn D',
        sotien: 50000,
        ngaynop: new Date('2024-01-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        hokhau_id: 2,
        khoanthu_id: 2,
        nguoinop: 'Lê Văn D',
        sotien: 200000,
        ngaynop: new Date('2024-01-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('nopphi', null, {});
  }
};