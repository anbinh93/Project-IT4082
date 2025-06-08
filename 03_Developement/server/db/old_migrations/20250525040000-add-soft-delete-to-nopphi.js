'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('nopphi', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    await queryInterface.addColumn('nopphi', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'CANCELLED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    });
    
    await queryInterface.addColumn('nopphi', 'cancelledBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    });
    
    await queryInterface.addColumn('nopphi', 'cancelReason', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('nopphi', 'deletedAt');
    await queryInterface.removeColumn('nopphi', 'status');
    await queryInterface.removeColumn('nopphi', 'cancelledBy');
    await queryInterface.removeColumn('nopphi', 'cancelReason');
  }
}; 