'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loaixe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tenLoaiXe: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Tên loại xe: Xe máy, Ô tô, Xe đạp điện, etc.'
      },
      phiThang: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Phí hàng tháng cho loại xe này'
      },
      moTa: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Mô tả chi tiết về loại xe'
      },
      trangThai: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Có đang áp dụng loại xe này không'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Thêm index cho tên loại xe
    await queryInterface.addIndex('loaixe', ['tenLoaiXe'], {
      name: 'idx_loaixe_tenLoaiXe'
    });

    // Insert dữ liệu mặc định
    await queryInterface.bulkInsert('loaixe', [
      {
        tenLoaiXe: 'Xe máy',
        phiThang: 50000.00,
        moTa: 'Phí đậu xe máy hàng tháng',
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenLoaiXe: 'Ô tô',
        phiThang: 200000.00,
        moTa: 'Phí đậu ô tô hàng tháng',
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tenLoaiXe: 'Xe đạp điện',
        phiThang: 30000.00,
        moTa: 'Phí đậu xe đạp điện hàng tháng',
        trangThai: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loaixe');
  }
};
