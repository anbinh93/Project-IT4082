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

      // Many QuanLyXe belongs to one LoaiXe
      QuanLyXe.belongsTo(models.LoaiXe, {
        foreignKey: 'loaiXeId',
        targetKey: 'id',
        as: 'loaiXe'
      });
    }
  }

  QuanLyXe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      allowNull: false,
      references: {
        model: 'loaixe',
        key: 'id'
      }
    },
    bienSo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    ngayBatDau: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ngayKetThuc: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'QuanLyXe',
    tableName: 'QuanLyXe'
  });

  return QuanLyXe;
};