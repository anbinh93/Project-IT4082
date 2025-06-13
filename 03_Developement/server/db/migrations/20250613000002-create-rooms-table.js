'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soPhong: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      tang: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dienTich: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      donGia: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      hoKhauId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'HoKhau',
          key: 'soHoKhau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ngayBatDau: {
        type: Sequelize.DATE,
        allowNull: true
      },
      ngayKetThuc: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trangThai: {
        type: Sequelize.ENUM('trong', 'da_thue', 'bao_tri'),
        allowNull: false,
        defaultValue: 'trong'
      },
      ghiChu: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Add indexes for better performance
    await queryInterface.addIndex('Rooms', ['tang']);
    await queryInterface.addIndex('Rooms', ['trangThai']);
    await queryInterface.addIndex('Rooms', ['hoKhauId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rooms');
  }
};
