'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('HouseholdFees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      soTien: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Số tiền phải đóng cho khoản thu này'
      },
      soTienDaNop: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Số tiền đã nộp'
      },
      trangThai: {
        type: Sequelize.ENUM('chua_nop', 'nop_mot_phan', 'da_nop_du'),
        allowNull: false,
        defaultValue: 'chua_nop',
        comment: 'Trạng thái thanh toán'
      },
      ghiChu: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Ghi chú về khoản thu này'
      },
      chiTietTinhPhi: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Chi tiết cách tính phí (diện tích, số xe, v.v.)'
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

    // Add indexes for better performance
    await queryInterface.addIndex('HouseholdFees', ['dotThuId']);
    await queryInterface.addIndex('HouseholdFees', ['khoanThuId']);
    await queryInterface.addIndex('HouseholdFees', ['hoKhauId']);
    await queryInterface.addIndex('HouseholdFees', ['trangThai']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('HouseholdFees');
  }
};
