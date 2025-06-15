'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TamTruTamVang extends Model {
    static associate(models) {
      TamTruTamVang.belongsTo(models.NhanKhau, {
        foreignKey: 'nhanKhauId',
        as: 'nhanKhau'
      });
    }
  }
  TamTruTamVang.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nhanKhauId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['đang tạm trú', 'đã kết thúc', 'tạm vắng']]
      }
    },
    diaChi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tuNgay: {
      type: DataTypes.DATE,
      allowNull: false
    },
    thoiGian: {
      type: DataTypes.DATE,
      allowNull: false
    },
    noiDungDeNghi: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TamTruTamVang',
    tableName: 'TamTruTamVang'
  });
  return TamTruTamVang;
}; 