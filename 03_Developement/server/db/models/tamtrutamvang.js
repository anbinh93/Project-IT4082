'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TamTruTamVang extends Model {
    static associate(models) {
      TamTruTamVang.belongsTo(models.NhanKhau, {
        foreignKey: 'nhankhau_id',
        as: 'nhanKhau'
      });
    }
  }
  TamTruTamVang.init({
    nhankhau_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    trangthai: {
      type: DataTypes.STRING,
      allowNull: false
    },
    diachi: DataTypes.STRING,
    thoigian: DataTypes.DATE,
    noidungdenghi: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TamTruTamVang',
    tableName: 'tamtrutamvang'
  });
  return TamTruTamVang;
}; 