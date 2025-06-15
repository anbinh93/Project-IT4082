'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('NhanKhau', 'soDienThoai', {
      type: Sequelize.STRING(15),
      allowNull: true,
      comment: 'Số điện thoại liên lạc'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('NhanKhau', 'soDienThoai');
  }
};
