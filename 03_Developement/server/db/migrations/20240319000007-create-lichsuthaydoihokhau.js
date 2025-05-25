'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lichsuthaydoihokhau', {
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
      hokhau_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hokhau',
          key: 'sohokhau'
        }
      },
      loaithaydoi: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      thoigian: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('lichsuthaydoihokhau');
  }
}; 