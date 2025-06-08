'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoaiXe extends Model {
    static associate(models) {
      // One LoaiXe has many PhuongTien
      LoaiXe.hasMany(models.PhuongTien, {
        foreignKey: 'loaiXeId',
        as: 'phuongTiens'
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    phiThang: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    moTa: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    trangThai: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'LoaiXe',
    tableName: 'loaixe',
    timestamps: true,
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
