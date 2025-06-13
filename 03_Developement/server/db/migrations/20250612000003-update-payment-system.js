'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Update KhoanThu table to match new structure
      await queryInterface.addColumn('KhoanThu', 'ngaytao', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      });

      await queryInterface.addColumn('KhoanThu', 'thoihan', {
        type: Sequelize.DATE,
        allowNull: true
      });

      await queryInterface.renameColumn('KhoanThu', 'tenKhoanThu', 'tenkhoanthu');
      await queryInterface.renameColumn('KhoanThu', 'batBuoc', 'batbuoc');
      await queryInterface.renameColumn('KhoanThu', 'ghiChu', 'ghichu');

      // Drop and recreate NopPhi table with new structure
      await queryInterface.dropTable('NopPhi');
      
      await queryInterface.createTable('NopPhi', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        hokhau_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        khoanthu_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'KhoanThu',
            key: 'id'
          }
        },
        sotien: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false
        },
        ngaynop: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        nguoinop: {
          type: Sequelize.STRING,
          allowNull: true
        },
        phuongthuc: {
          type: Sequelize.ENUM('CASH', 'BANK_TRANSFER', 'ONLINE', 'CHECK'),
          allowNull: false,
          defaultValue: 'CASH'
        },
        ghichu: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        status: {
          type: Sequelize.ENUM('ACTIVE', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'ACTIVE'
        },
        cancelledBy: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        cancelReason: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      });

      // Add indexes
      await queryInterface.addIndex('NopPhi', ['hokhau_id']);
      await queryInterface.addIndex('NopPhi', ['khoanthu_id']);
      await queryInterface.addIndex('NopPhi', ['ngaynop']);
      await queryInterface.addIndex('NopPhi', ['status']);
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Revert KhoanThu changes
      await queryInterface.removeColumn('KhoanThu', 'ngaytao');
      await queryInterface.removeColumn('KhoanThu', 'thoihan');
      
      await queryInterface.renameColumn('KhoanThu', 'tenkhoanthu', 'tenKhoanThu');
      await queryInterface.renameColumn('KhoanThu', 'batbuoc', 'batBuoc');
      await queryInterface.renameColumn('KhoanThu', 'ghichu', 'ghiChu');

      // Recreate old NopPhi structure
      await queryInterface.dropTable('NopPhi');
      
      await queryInterface.createTable('NopPhi', {
        hoKhauId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'HoKhau',
            key: 'soHoKhau'
          }
        },
        khoanThuId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'KhoanThu',
            key: 'id'
          }
        },
        soTien: Sequelize.DECIMAL(15, 2),
        nguoiNop: Sequelize.STRING,
        ngayNop: Sequelize.DATE,
        trangThai: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    } catch (error) {
      console.error('Migration rollback error:', error);
      throw error;
    }
  }
};
