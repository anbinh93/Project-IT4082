'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuanLyXe extends Model {
    static associate(models) {
      // Many QuanLyXe belongs to one HoKhau
      QuanLyXe.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });

      // Many QuanLyXe belongs to one PhuongTien
      QuanLyXe.belongsTo(models.PhuongTien, {
        foreignKey: 'phuongTienId',
        targetKey: 'id',
        as: 'phuongTien'
      });
    }
  }

  QuanLyXe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phuongTienId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'phuongtien',
        key: 'id'
      }
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    ngayBatDau: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ngayKetThuc: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trangThaiDangKy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phiDaTra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    lanCapNhatCuoi: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'QuanLyXe',
    tableName: 'quanlyxe',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        fields: ['hoKhauId']
      },
      {
        fields: ['phuongTienId']
      },
      {
        fields: ['trangThaiDangKy']
      },
      {
        fields: ['ngayBatDau']
      }
    ]
  });

  return QuanLyXe;
};
