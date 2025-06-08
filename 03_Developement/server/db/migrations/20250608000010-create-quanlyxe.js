'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quanlyxe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phuongTienId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'phuongtien',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hokhau',
          key: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ngayBatDau: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Ngày bắt đầu đăng ký quản lý xe'
      },
      ngayKetThuc: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Ngày kết thúc đăng ký (null nếu vẫn đang quản lý)'
      },
      trangThaiDangKy: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Trạng thái: active, expired, cancelled'
      },
      phiDaTra: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Tổng phí đã trả cho xe này'
      },
      lanCapNhatCuoi: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Lần cập nhật phí cuối cùng'
      },
      ghiChu: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Ghi chú về việc quản lý xe'
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

    // Thêm unique constraint để đảm bảo một xe chỉ có một đăng ký active tại một thời điểm
    await queryInterface.addConstraint('quanlyxe', {
      fields: ['phuongTienId', 'hoKhauId', 'ngayBatDau'],
      type: 'unique',
      name: 'uk_quanlyxe_phuongtien_hokhau_ngaybatdau'
    });

    // Thêm foreign key constraints
    await queryInterface.addConstraint('quanlyxe', {
      fields: ['phuongTienId'],
      type: 'foreign key',
      name: 'fk_quanlyxe_phuongtien',
      references: {
        table: 'phuongtien',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('quanlyxe', {
      fields: ['hoKhauId'],
      type: 'foreign key',
      name: 'fk_quanlyxe_hokhau',
      references: {
        table: 'hokhau',
        field: 'soHoKhau'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Thêm indexes
    await queryInterface.addIndex('quanlyxe', ['phuongTienId'], {
      name: 'idx_quanlyxe_phuongTienId'
    });

    await queryInterface.addIndex('quanlyxe', ['hoKhauId'], {
      name: 'idx_quanlyxe_hoKhauId'
    });

    await queryInterface.addIndex('quanlyxe', ['trangThaiDangKy'], {
      name: 'idx_quanlyxe_trangThaiDangKy'
    });

    await queryInterface.addIndex('quanlyxe', ['ngayBatDau', 'ngayKetThuc'], {
      name: 'idx_quanlyxe_thoidiem'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraints and indexes
    await queryInterface.removeConstraint('quanlyxe', 'uk_quanlyxe_phuongtien_hokhau_ngaybatdau');
    await queryInterface.removeConstraint('quanlyxe', 'fk_quanlyxe_phuongtien');
    await queryInterface.removeConstraint('quanlyxe', 'fk_quanlyxe_hokhau');
    
    await queryInterface.removeIndex('quanlyxe', 'idx_quanlyxe_phuongTienId');
    await queryInterface.removeIndex('quanlyxe', 'idx_quanlyxe_hoKhauId');
    await queryInterface.removeIndex('quanlyxe', 'idx_quanlyxe_trangThaiDangKy');
    await queryInterface.removeIndex('quanlyxe', 'idx_quanlyxe_thoidiem');

    await queryInterface.dropTable('quanlyxe');
  }
};
