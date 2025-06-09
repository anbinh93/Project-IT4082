'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing foreign key constraints and columns
    try {
      await queryInterface.removeConstraint('quanlyxe', 'quanlyxe_phuongTienId_foreign_idx');
    } catch (error) {
      console.log('Foreign key constraint may not exist');
    }

    // Remove phuongTienId column from QuanLyXe
    try {
      await queryInterface.removeColumn('quanlyxe', 'phuongTienId');
    } catch (error) {
      console.log('phuongTienId column may not exist');
    }

    // Add new columns to QuanLyXe according to new schema
    try {
      await queryInterface.addColumn('quanlyxe', 'loaiXeId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'loaixe',
          key: 'id'
        },
        comment: 'Reference to vehicle type'
      });
    } catch (error) {
      console.log('loaiXeId column may already exist');
    }

    try {
      await queryInterface.addColumn('quanlyxe', 'bienSo', {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Vehicle license plate'
      });
    } catch (error) {
      console.log('bienSo column may already exist');
    }

    // Rename existing columns to match new schema
    try {
      await queryInterface.renameColumn('quanlyxe', 'trangThaiDangKy', 'trangThai');
    } catch (error) {
      console.log('Column rename may have failed');
    }

    // Update LoaiXe table to match new schema
    try {
      await queryInterface.renameColumn('loaixe', 'tenLoaiXe', 'ten');
    } catch (error) {
      console.log('tenLoaiXe column rename may have failed');
    }

    try {
      await queryInterface.renameColumn('loaixe', 'phiThang', 'phiThue');
    } catch (error) {
      console.log('phiThang column rename may have failed');
    }

    // Update column type for phiThue
    try {
      await queryInterface.changeColumn('loaixe', 'phiThue', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    } catch (error) {
      console.log('phiThue column type change may have failed');
    }

    // Remove unnecessary columns from LoaiXe
    try {
      await queryInterface.removeColumn('loaixe', 'trangThai');
    } catch (error) {
      console.log('trangThai column may not exist in loaixe');
    }

    // Remove PhuongTien table as it's no longer needed in new schema
    try {
      await queryInterface.dropTable('phuongtien');
    } catch (error) {
      console.log('phuongtien table may not exist');
    }

    // Create CanHo table according to new schema
    try {
      await queryInterface.createTable('canho', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        soPhong: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        chuHoId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          unique: true,
          references: {
            model: 'nhankhau',
            key: 'id'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
    } catch (error) {
      console.log('CanHo table creation may have failed');
    }

    // Add indexes for better performance
    try {
      await queryInterface.addIndex('quanlyxe', ['loaiXeId'], {
        name: 'quanlyxe_loaiXeId_index'
      });
    } catch (error) {
      console.log('Index creation may have failed');
    }

    try {
      await queryInterface.addIndex('quanlyxe', ['bienSo'], {
        name: 'quanlyxe_bienSo_index',
        unique: true
      });
    } catch (error) {
      console.log('Index creation may have failed');
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverse the changes
    try {
      await queryInterface.dropTable('canho');
    } catch (error) {
      console.log('CanHo table may not exist');
    }

    // Recreate PhuongTien table
    try {
      await queryInterface.createTable('phuongtien', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        hoKhauId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'hokhau',
            key: 'soHoKhau'
          }
        },
        loaiXeId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'loaixe',
            key: 'id'
          }
        },
        bienSo: {
          type: Sequelize.STRING,
          allowNull: false
        },
        thoiGianGui: Sequelize.DATE,
        trangThai: Sequelize.STRING,
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
    } catch (error) {
      console.log('PhuongTien table recreation failed');
    }

    // Remove new columns from QuanLyXe
    const columnsToRemove = ['loaiXeId', 'bienSo'];
    for (const column of columnsToRemove) {
      try {
        await queryInterface.removeColumn('quanlyxe', column);
      } catch (error) {
        console.log(`${column} column may not exist`);
      }
    }

    // Restore old column names
    try {
      await queryInterface.renameColumn('quanlyxe', 'trangThai', 'trangThaiDangKy');
    } catch (error) {
      console.log('Column rename may have failed');
    }

    try {
      await queryInterface.renameColumn('loaixe', 'ten', 'tenLoaiXe');
    } catch (error) {
      console.log('Column rename may have failed');
    }

    try {
      await queryInterface.renameColumn('loaixe', 'phiThue', 'phiThang');
    } catch (error) {
      console.log('Column rename may have failed');
    }
  }
};
