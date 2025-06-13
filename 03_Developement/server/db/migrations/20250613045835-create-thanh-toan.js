'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ThanhToans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dotThuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DotThu',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      khoanThuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'KhoanThu',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'HoKhau',
          key: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nguoiNopId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'NhanKhau',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      soTien: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      ngayNop: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      hinhThucNop: {
        type: Sequelize.ENUM('TIEN_MAT', 'CHUYEN_KHOAN', 'THE_ATM'),
        allowNull: false,
        defaultValue: 'TIEN_MAT'
      },
      ghiChu: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      trangThai: {
        type: Sequelize.ENUM('DA_XAC_NHAN', 'DANG_XU_LY', 'BI_HUY'),
        allowNull: false,
        defaultValue: 'DA_XAC_NHAN'
      },
      nguoiTaoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    // Add unique index
    await queryInterface.addIndex('ThanhToans', {
      fields: ['dotThuId', 'khoanThuId', 'hoKhauId'],
      unique: true,
      name: 'unique_payment_per_household_fee',
      where: {
        deletedAt: null
      }
    });

    // Add other indexes
    await queryInterface.addIndex('ThanhToans', ['ngayNop']);
    await queryInterface.addIndex('ThanhToans', ['hoKhauId']);
    await queryInterface.addIndex('ThanhToans', ['trangThai']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ThanhToans');
  }
};
