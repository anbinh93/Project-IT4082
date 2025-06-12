'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modify the chuHo column to allow NULL values
    await queryInterface.changeColumn('HoKhau', 'chuHo', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'NhanKhau',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the change - make chuHo NOT NULL again
    await queryInterface.changeColumn('HoKhau', 'chuHo', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'NhanKhau',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
