'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hokhau', {
      sohokhau: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chuho: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'nhankhau',
          key: 'id'
        }
      },
      sonha: {
        type: Sequelize.STRING
      },
      duong: {
        type: Sequelize.STRING
      },
      phuong: {
        type: Sequelize.STRING
      },
      quan: {
        type: Sequelize.STRING
      },
      thanhpho: {
        type: Sequelize.STRING
      },
      ngaylamhokhau: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('hokhau');
  }
}; 