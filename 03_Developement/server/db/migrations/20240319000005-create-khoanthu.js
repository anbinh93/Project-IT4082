'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('khoanthu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ngaytao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      thoihan: {
        type: Sequelize.DATE
      },
      tenkhoanthu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      batbuoc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('khoanthu');
  }
}; 