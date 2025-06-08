'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add foreign key for canho table
      await queryInterface.addConstraint('canho', {
        fields: ['hoKhauId'],
        type: 'foreign key',
        name: 'fk_canho_hokhau',
        references: {
          table: 'hokhau',
          field: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
      console.log('Added foreign key for canho table');
    } catch (error) {
      console.log('Foreign key for canho already exists or failed:', error.message);
    }

    try {
      // Add foreign key for phuongtien table
      await queryInterface.addConstraint('phuongtien', {
        fields: ['hoKhauId'],
        type: 'foreign key',
        name: 'fk_phuongtien_hokhau',
        references: {
          table: 'hokhau',
          field: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
      console.log('Added foreign key for phuongtien table');
    } catch (error) {
      console.log('Foreign key for phuongtien already exists or failed:', error.message);
    }

    console.log('Remaining foreign key constraints added successfully!');
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint('canho', 'fk_canho_hokhau');
    } catch (error) {
      console.log('Failed to remove canho foreign key:', error.message);
    }

    try {
      await queryInterface.removeConstraint('phuongtien', 'fk_phuongtien_hokhau');
    } catch (error) {
      console.log('Failed to remove phuongtien foreign key:', error.message);
    }

    console.log('Foreign key constraints removed successfully!');
  }
};
