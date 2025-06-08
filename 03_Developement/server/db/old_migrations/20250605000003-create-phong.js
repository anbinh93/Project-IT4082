'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('phong', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sophong: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      tang: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dientich: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false
      },
      dongia: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      hokhau_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'hokhau',
          key: 'sohokhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ngaybatdau: {
        type: Sequelize.DATE,
        allowNull: true
      },
      ngayketthuc: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trangthai: {
        type: Sequelize.ENUM('trong', 'da_thue', 'bao_tri'),
        allowNull: false,
        defaultValue: 'trong'
      },
      ghichu: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Tạo index cho tìm kiếm nhanh
    await queryInterface.addIndex('phong', ['sophong']);
    await queryInterface.addIndex('phong', ['tang']);
    await queryInterface.addIndex('phong', ['hokhau_id']);
    await queryInterface.addIndex('phong', ['trangthai']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('phong');
  }
};
