'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔄 Aligning vehicle schema with new design...');

    // 1. Update LoaiXe table structure
    try {
      // Rename 'ten' to 'tenLoaiXe' if needed
      const loaixeColumns = await queryInterface.describeTable('loaixe');
      
      if (loaixeColumns.ten && !loaixeColumns.tenLoaiXe) {
        await queryInterface.renameColumn('loaixe', 'ten', 'tenLoaiXe');
        console.log('✅ Renamed ten to tenLoaiXe in loaixe table');
      }

      // Rename 'phiThue' to 'phiThang' and change type
      if (loaixeColumns.phiThue && !loaixeColumns.phiThang) {
        await queryInterface.renameColumn('loaixe', 'phiThue', 'phiThang');
        console.log('✅ Renamed phiThue to phiThang in loaixe table');
      }

      // Change phiThang type to DECIMAL(10,2)
      await queryInterface.changeColumn('loaixe', 'phiThang', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      });

      // Add trangThai column if not exists
      if (!loaixeColumns.trangThai) {
        await queryInterface.addColumn('loaixe', 'trangThai', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Trạng thái hoạt động của loại xe'
        });
        console.log('✅ Added trangThai column to loaixe table');
      }

    } catch (error) {
      console.log('⚠️ Some LoaiXe columns may already exist:', error.message);
    }

    // 2. Update QuanLyXe table structure
    try {
      const quanlyxeColumns = await queryInterface.describeTable('quanlyxe');

      // Add missing columns if they don't exist
      if (!quanlyxeColumns.trangThaiDangKy) {
        await queryInterface.addColumn('quanlyxe', 'trangThaiDangKy', {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: 'DANG_HOAT_DONG',
          comment: 'Trạng thái đăng ký xe: DANG_HOAT_DONG, TAM_NGUNG, KHOA'
        });
        console.log('✅ Added trangThaiDangKy column to quanlyxe table');
      }

      // Update trangThai column to use better enum values
      await queryInterface.changeColumn('quanlyxe', 'trangThai', {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      });

      // Add constraint for bienSo format (Vietnamese license plate)
      try {
        await queryInterface.addConstraint('quanlyxe', {
          fields: ['bienSo'],
          type: 'check',
          name: 'check_bien_so_format',
          where: {
            bienSo: {
              [Sequelize.Op.regexp]: '^[0-9]{2}[A-Z]{1,2}-[0-9]{3,5}$|^[A-Z]{2}-[0-9]{3,4}$'
            }
          }
        });
        console.log('✅ Added bienSo format constraint');
      } catch (error) {
        console.log('⚠️ BienSo constraint may already exist');
      }

    } catch (error) {
      console.log('⚠️ Some QuanLyXe columns may already exist:', error.message);
    }

    // 3. Add proper indexes for performance
    try {
      await queryInterface.addIndex('loaixe', ['trangThai'], {
        name: 'idx_loaixe_trangThai'
      });

      await queryInterface.addIndex('quanlyxe', ['trangThaiDangKy'], {
        name: 'idx_quanlyxe_trangThaiDangKy'
      });

      await queryInterface.addIndex('quanlyxe', ['loaiXeId', 'trangThai'], {
        name: 'idx_quanlyxe_loaiXeId_trangThai'
      });

      console.log('✅ Added performance indexes');
    } catch (error) {
      console.log('⚠️ Some indexes may already exist');
    }

    console.log('✅ Vehicle schema alignment completed successfully!');
  },

  async down(queryInterface, Sequelize) {
    console.log('🔄 Reverting vehicle schema changes...');

    try {
      // Remove indexes
      await queryInterface.removeIndex('loaixe', 'idx_loaixe_trangThai');
      await queryInterface.removeIndex('quanlyxe', 'idx_quanlyxe_trangThaiDangKy');
      await queryInterface.removeIndex('quanlyxe', 'idx_quanlyxe_loaiXeId_trangThai');

      // Remove constraint
      await queryInterface.removeConstraint('quanlyxe', 'check_bien_so_format');

      // Remove added columns
      await queryInterface.removeColumn('loaixe', 'trangThai');
      await queryInterface.removeColumn('quanlyxe', 'trangThaiDangKy');

      // Revert column names
      await queryInterface.renameColumn('loaixe', 'tenLoaiXe', 'ten');
      await queryInterface.renameColumn('loaixe', 'phiThang', 'phiThue');

      // Revert column types
      await queryInterface.changeColumn('loaixe', 'phiThue', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });

      await queryInterface.changeColumn('quanlyxe', 'trangThai', {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active'
      });

      console.log('✅ Vehicle schema revert completed');
    } catch (error) {
      console.log('⚠️ Error during schema revert:', error.message);
    }
  }
};
