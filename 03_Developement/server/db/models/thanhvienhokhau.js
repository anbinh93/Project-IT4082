'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ThanhVienHoKhau extends Model {
    static associate(models) {
      ThanhVienHoKhau.belongsTo(models.NhanKhau, {
        foreignKey: 'nhankhau_id',
        as: 'nhanKhau'
      });
      ThanhVienHoKhau.belongsTo(models.HoKhau, {
        foreignKey: 'hokhau_id',
        as: 'hoKhau'
      });
    }
  }
  ThanhVienHoKhau.init({
    nhankhau_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    hokhau_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'hokhau',
        key: 'sohokhau'
      }
    },
    ngaythemnhankhau: {
      type: DataTypes.DATE,
      allowNull: false
    },
    quanhevoichuho: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ThanhVienHoKhau',
    tableName: 'thanhvienhokhau'
  });
  return ThanhVienHoKhau;
}; 