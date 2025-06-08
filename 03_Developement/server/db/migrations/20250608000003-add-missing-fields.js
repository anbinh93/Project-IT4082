'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add hoKhauId field to nhankhau table
    await queryInterface.addColumn('nhankhau', 'hoKhauId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    console.log('Added hoKhauId field to nhankhau table');
  },

  async down(queryInterface, Sequelize) {
    // Remove hoKhauId field from nhankhau table
    await queryInterface.removeColumn('nhankhau', 'hoKhauId');

    console.log('Removed hoKhauId field from nhankhau table');
  }
};
