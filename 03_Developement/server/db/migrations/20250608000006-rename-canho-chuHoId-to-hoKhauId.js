'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename chuHoId to hoKhauId in canho table
    await queryInterface.renameColumn('canho', 'chuHoId', 'hoKhauId');
    
    console.log('Renamed canho.chuHoId to canho.hoKhauId');
  },

  async down(queryInterface, Sequelize) {
    // Rename back hoKhauId to chuHoId in canho table
    await queryInterface.renameColumn('canho', 'hoKhauId', 'chuHoId');
    
    console.log('Renamed canho.hoKhauId back to canho.chuHoId');
  }
};
