'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove donGia column from Rooms table
    await queryInterface.removeColumn('Rooms', 'donGia');
    
    // Update existing rooms to match with household "soNha"
    // We'll need to sync room numbers with existing household addresses
  },

  down: async (queryInterface, Sequelize) => {
    // Add back donGia column if needed
    await queryInterface.addColumn('Rooms', 'donGia', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  }
};
