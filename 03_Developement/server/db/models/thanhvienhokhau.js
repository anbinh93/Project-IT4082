'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ThanhVienHoKhau extends Model {
    static associate(models) {
      ThanhVienHoKhau.belongsTo(models.NhanKhau, {
        foreignKey: 'nhanKhauId',
        as: 'nhanKhau'
      });
      ThanhVienHoKhau.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
    }
  }
  ThanhVienHoKhau.init({
    nhanKhauId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    ngayThemNhanKhau: {
      type: DataTypes.DATE,
      allowNull: true
    },
    quanHeVoiChuHo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ThanhVienHoKhau',
    tableName: 'thanhvienhokhau'
  });
  return ThanhVienHoKhau;
}; 