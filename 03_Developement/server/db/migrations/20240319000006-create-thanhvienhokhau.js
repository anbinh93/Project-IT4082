'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('thanhvienhokhau', {
      nhankhau_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'nhankhau',
          key: 'id'
        },
        unique: true
      },
      hokhau_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'hokhau',
          key: 'sohokhau'
        }
      },
      ngaythemnhankhau: {
        type: Sequelize.DATE,
        allowNull: false
      },
      quanhevoichuho: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('thanhvienhokhau');
  }
}; 