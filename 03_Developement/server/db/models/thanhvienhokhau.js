'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ThanhVienHoKhau extends Model {
    static associate(models) {
      // ThanhVienHoKhau belongs to NhanKhau
      ThanhVienHoKhau.belongsTo(models.NhanKhau, {
        foreignKey: 'nhanKhauId',
        as: 'nhanKhau'
      });
      
      // ThanhVienHoKhau belongs to HoKhau
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
    quanHeVoiChuHo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['vợ/chồng', 'con', 'bố/mẹ', 'khác', 'chủ hộ']]
      }
    }
  }, {
    sequelize,
    modelName: 'ThanhVienHoKhau',
    tableName: 'ThanhVienHoKhau'
  });
  return ThanhVienHoKhau;
}; 