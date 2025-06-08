'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nopphi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hokhau_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hokhau',
          key: 'sohokhau'
        }
      },
      khoanthu_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'khoanthu',
          key: 'id'
        }
      },
      nguoinop: {
        type: Sequelize.STRING
      },
      sotien: {
        type: Sequelize.DECIMAL(10, 2)
      },
      ngaynop: {
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
    await queryInterface.dropTable('nopphi');
  }
}; 