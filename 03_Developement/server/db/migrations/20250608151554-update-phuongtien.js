'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột loaiXeId
    await queryInterface.addColumn('phuongtien', 'loaiXeId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Cho phép null ban đầu để migrate data
      references: {
        model: 'loaixe',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Thêm các cột mới
    await queryInterface.addColumn('phuongtien', 'ngayDangKy', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Ngày đăng ký phương tiện'
    });

    await queryInterface.addColumn('phuongtien', 'phiHangThang', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Phí hàng tháng theo loại xe'
    });

    await queryInterface.addColumn('phuongtien', 'ngayHetHan', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Ngày hết hạn đăng ký'
    });

    // Migrate data từ cột loaiXe cũ sang loaiXeId
    await queryInterface.sequelize.query(`
      UPDATE phuongtien 
      SET loaiXeId = CASE 
        WHEN LOWER(loaiXe) LIKE '%xe máy%' OR LOWER(loaiXe) LIKE '%motorbike%' THEN 1
        WHEN LOWER(loaiXe) LIKE '%ô tô%' OR LOWER(loaiXe) LIKE '%car%' THEN 2
        WHEN LOWER(loaiXe) LIKE '%xe đạp%' OR LOWER(loaiXe) LIKE '%bicycle%' THEN 3
        ELSE 1
      END,
      ngayDangKy = COALESCE(thoiGianGui, NOW()),
      phiHangThang = CASE 
        WHEN LOWER(loaiXe) LIKE '%xe máy%' OR LOWER(loaiXe) LIKE '%motorbike%' THEN 50000
        WHEN LOWER(loaiXe) LIKE '%ô tô%' OR LOWER(loaiXe) LIKE '%car%' THEN 200000
        WHEN LOWER(loaiXe) LIKE '%xe đạp%' OR LOWER(loaiXe) LIKE '%bicycle%' THEN 30000
        ELSE 50000
      END
    `);

    // Xóa cột loaiXe cũ (string)
    await queryInterface.removeColumn('phuongtien', 'loaiXe');

    // Thêm foreign key constraint
    await queryInterface.addConstraint('phuongtien', {
      fields: ['loaiXeId'],
      type: 'foreign key',
      name: 'fk_phuongtien_loaixe',
      references: {
        table: 'loaixe',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Thêm index
    await queryInterface.addIndex('phuongtien', ['loaiXeId'], {
      name: 'idx_phuongtien_loaiXeId'
    });

    await queryInterface.addIndex('phuongtien', ['ngayDangKy'], {
      name: 'idx_phuongtien_ngayDangKy'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraints and indexes
    await queryInterface.removeConstraint('phuongtien', 'fk_phuongtien_loaixe');
    await queryInterface.removeIndex('phuongtien', 'idx_phuongtien_loaiXeId');
    await queryInterface.removeIndex('phuongtien', 'idx_phuongtien_ngayDangKy');

    // Add back the old loaiXe column
    await queryInterface.addColumn('phuongtien', 'loaiXe', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Xe máy'
    });

    // Migrate data back
    await queryInterface.sequelize.query(`
      UPDATE phuongtien p
      JOIN loaixe l ON p.loaiXeId = l.id
      SET p.loaiXe = l.tenLoaiXe
    `);

    // Remove new columns
    await queryInterface.removeColumn('phuongtien', 'loaiXeId');
    await queryInterface.removeColumn('phuongtien', 'ngayDangKy');
    await queryInterface.removeColumn('phuongtien', 'phiHangThang');
    await queryInterface.removeColumn('phuongtien', 'ngayHetHan');
  }
};
