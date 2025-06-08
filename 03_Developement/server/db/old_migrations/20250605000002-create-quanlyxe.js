'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quanlyxe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hokhau_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hokhau',
          key: 'sohokhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      loaixe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'loaixe',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      bienso: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      tengoi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mausac: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hangxe: {
        type: Sequelize.STRING,
        allowNull: true
      },
      namsx: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ngaydangky: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      ngayketthuc: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trangthai: {
        type: Sequelize.ENUM('dang_gui', 'tam_ngung', 'da_huy'),
        allowNull: false,
        defaultValue: 'dang_gui'
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
    await queryInterface.addIndex('quanlyxe', ['hokhau_id']);
    await queryInterface.addIndex('quanlyxe', ['loaixe_id']);
    await queryInterface.addIndex('quanlyxe', ['bienso']);
    await queryInterface.addIndex('quanlyxe', ['trangthai']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quanlyxe');
  }
};
