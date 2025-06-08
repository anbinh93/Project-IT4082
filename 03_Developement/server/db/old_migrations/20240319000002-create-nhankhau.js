'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nhankhau', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hoten: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ngaysinh: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gioitinh: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dantoc: {
        type: Sequelize.STRING
      },
      tongiao: {
        type: Sequelize.STRING
      },
      cccd: {
        type: Sequelize.STRING,
        unique: true
      },
      ngaycap: {
        type: Sequelize.DATE
      },
      noicap: {
        type: Sequelize.STRING
      },
      nghenghiep: {
        type: Sequelize.STRING
      },
      ghichu: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('nhankhau');
  }
}; 