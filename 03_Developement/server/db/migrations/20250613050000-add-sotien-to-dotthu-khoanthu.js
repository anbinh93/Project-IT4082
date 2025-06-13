'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('DotThu_KhoanThu', 'soTien', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Số tiền cho khoản thu trong đợt thu phí cụ thể'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('DotThu_KhoanThu', 'soTien');
  }
};
