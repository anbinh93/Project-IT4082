'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('nopphi', 'phuongthuc', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'CASH'
    });
    
    await queryInterface.addColumn('nopphi', 'ghichu', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('nopphi', 'phuongthuc');
    await queryInterface.removeColumn('nopphi', 'ghichu');
  }
};
