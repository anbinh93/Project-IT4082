'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename table từ canho thành phong
    await queryInterface.renameTable('canho', 'phong');

    // Thêm các cột mới
    await queryInterface.addColumn('phong', 'dienTich', {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Diện tích phòng tính bằng m²'
    });

    await queryInterface.addColumn('phong', 'tang', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Tầng của phòng'
    });

    await queryInterface.addColumn('phong', 'loaiPhong', {
      type: Sequelize.STRING(30),
      allowNull: true,
      comment: 'Loại phòng: Studio, 1PN, 2PN, 3PN, etc.'
    });

    await queryInterface.addColumn('phong', 'trangThai', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'occupied',
      comment: 'Trạng thái phòng: occupied, vacant, maintenance'
    });

    await queryInterface.addColumn('phong', 'ngayVaoO', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Ngày hộ gia đình vào ở'
    });

    // Thêm indexes
    await queryInterface.addIndex('phong', ['tang'], {
      name: 'idx_phong_tang'
    });

    await queryInterface.addIndex('phong', ['loaiPhong'], {
      name: 'idx_phong_loaiPhong'
    });

    await queryInterface.addIndex('phong', ['trangThai'], {
      name: 'idx_phong_trangThai'
    });

    await queryInterface.addIndex('phong', ['soPhong'], {
      name: 'idx_phong_soPhong'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('phong', 'idx_phong_tang');
    await queryInterface.removeIndex('phong', 'idx_phong_loaiPhong');
    await queryInterface.removeIndex('phong', 'idx_phong_trangThai');
    await queryInterface.removeIndex('phong', 'idx_phong_soPhong');

    // Remove new columns
    await queryInterface.removeColumn('phong', 'dienTich');
    await queryInterface.removeColumn('phong', 'tang');
    await queryInterface.removeColumn('phong', 'loaiPhong');
    await queryInterface.removeColumn('phong', 'trangThai');
    await queryInterface.removeColumn('phong', 'ngayVaoO');

    // Rename table back
    await queryInterface.renameTable('phong', 'canho');
  }
};
