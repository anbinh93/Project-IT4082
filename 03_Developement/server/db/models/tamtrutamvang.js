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
      allowNull: false
    },
    diaChi: DataTypes.STRING,
    thoiGian: DataTypes.DATE,
    noiDungDeNghi: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TamTruTamVang',
    tableName: 'tamtrutamvang'
  });
  return TamTruTamVang;
}; 