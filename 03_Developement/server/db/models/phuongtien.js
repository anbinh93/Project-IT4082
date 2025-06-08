'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhuongTien extends Model {
    static associate(models) {
      PhuongTien.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });

      // Many PhuongTien belongs to one LoaiXe
      PhuongTien.belongsTo(models.LoaiXe, {
        foreignKey: 'loaiXeId',
        targetKey: 'id',
        as: 'loaiXe'
      });

      // One PhuongTien has many QuanLyXe
      PhuongTien.hasMany(models.QuanLyXe, {
        foreignKey: 'phuongTienId',
        as: 'quanLyXes'
      });
    }
  }
  
  PhuongTien.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    loaiXeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'loaixe',
        key: 'id'
      }
    },
    bienSo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thoiGianGui: DataTypes.DATE,
    trangThai: DataTypes.STRING,
    ngayDangKy: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phiHangThang: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    ngayHetHan: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PhuongTien',
    tableName: 'phuongtien',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        fields: ['hoKhauId']
      },
      {
        fields: ['loaiXeId']
      },
      {
        fields: ['bienSo']
      }
    ]
  });
  
  return PhuongTien;
};
