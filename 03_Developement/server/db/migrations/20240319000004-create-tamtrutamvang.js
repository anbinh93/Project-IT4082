'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tamtrutamvang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nhankhau_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'nhankhau',
          key: 'id'
        }
      },
      trangthai: {
        type: Sequelize.STRING,
        allowNull: false
      },
      diachi: {
        type: Sequelize.STRING
      },
      thoigian: {
        type: Sequelize.DATE
      },
      noidungdenghi: {
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
    await queryInterface.dropTable('tamtrutamvang');
  }
}; 