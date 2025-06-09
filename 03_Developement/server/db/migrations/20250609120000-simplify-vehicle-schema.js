'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Update LoaiXe table
    console.log('Updating LoaiXe table...');
    
    // Rename phiThang to phiThue
    await queryInterface.renameColumn('loaixe', 'phiThang', 'phiThue');
    
    // Remove timestamps from LoaiXe
    await queryInterface.removeColumn('loaixe', 'createdAt');
    await queryInterface.removeColumn('loaixe', 'updatedAt');

    // 2. Update QuanLyXe table  
    console.log('Updating QuanLyXe table...');
    
    // Remove unnecessary columns
    await queryInterface.removeColumn('quanlyxe', 'trangThaiDangKy');
    await queryInterface.removeColumn('quanlyxe', 'phiDaTra');
    await queryInterface.removeColumn('quanlyxe', 'lanCapNhatCuoi');
    
    // Remove timestamps from QuanLyXe
    await queryInterface.removeColumn('quanlyxe', 'createdAt');
    await queryInterface.removeColumn('quanlyxe', 'updatedAt');
    
    // Update trangThai column to be VARCHAR instead of ENUM for simplicity
    await queryInterface.changeColumn('quanlyxe', 'trangThai', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'ACTIVE'
    });

    console.log('Vehicle schema simplification completed!');
  },

  async down(queryInterface, Sequelize) {
    // 1. Restore LoaiXe table
    console.log('Restoring LoaiXe table...');
    
    // Rename back
    await queryInterface.renameColumn('loaixe', 'phiThue', 'phiThang');
    
    // Add back timestamps
    await queryInterface.addColumn('loaixe', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('loaixe', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // 2. Restore QuanLyXe table
    console.log('Restoring QuanLyXe table...');
    
    // Add back removed columns
    await queryInterface.addColumn('quanlyxe', 'trangThaiDangKy', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'DANG_HOAT_DONG'
    });
    await queryInterface.addColumn('quanlyxe', 'phiDaTra', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('quanlyxe', 'lanCapNhatCuoi', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    // Add back timestamps
    await queryInterface.addColumn('quanlyxe', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('quanlyxe', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    
    // Restore ENUM type for trangThai
    await queryInterface.changeColumn('quanlyxe', 'trangThai', {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    });

    console.log('Vehicle schema restoration completed!');
  }
};
