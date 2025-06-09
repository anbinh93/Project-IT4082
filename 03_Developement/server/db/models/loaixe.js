'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoaiXe extends Model {
    static associate(models) {
      // One LoaiXe has many QuanLyXe
      LoaiXe.hasMany(models.QuanLyXe, {
        foreignKey: 'loaiXeId',
        as: 'quanLyXes'
      });
    }
  }

  LoaiXe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tenLoaiXe: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Tên loại xe: Xe máy, Ô tô, Xe đạp điện, etc.'
    },
    phiThue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Phí thuê hàng tháng cho loại xe này'
    },
    moTa: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mô tả chi tiết về loại xe'
    },
    trangThai: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Trạng thái hoạt động của loại xe'
    }
  }, {
    sequelize,
    modelName: 'LoaiXe',
    tableName: 'loaixe',
    timestamps: false, // No timestamps needed
    paranoid: false,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['tenLoaiXe']
      }
    ]
  });

  return LoaiXe;
};
