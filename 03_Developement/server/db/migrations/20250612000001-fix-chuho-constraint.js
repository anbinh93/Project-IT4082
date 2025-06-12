'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the existing unique constraint on chuHo
    await queryInterface.removeConstraint('HoKhau', 'HoKhau_chuHo_key');
    
    // Modify the chuHo column to allow NULL values
    await queryInterface.changeColumn('HoKhau', 'chuHo', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'NhanKhau',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    // Add back the unique constraint (PostgreSQL allows null values in unique constraints)
    await queryInterface.addConstraint('HoKhau', {
      fields: ['chuHo'],
      type: 'unique',
      name: 'HoKhau_chuHo_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the unique constraint
    await queryInterface.removeConstraint('HoKhau', 'HoKhau_chuHo_unique');
    
    // Revert the change - make chuHo NOT NULL again
    await queryInterface.changeColumn('HoKhau', 'chuHo', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'NhanKhau',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    
    // Add back the original unique constraint
    await queryInterface.addConstraint('HoKhau', {
      fields: ['chuHo'],
      type: 'unique',
      name: 'HoKhau_chuHo_key'
    });
  }
};
