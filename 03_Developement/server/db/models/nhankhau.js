'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NhanKhau extends Model {
    static associate(models) {
      // NhanKhau belongs to HoKhau
      NhanKhau.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
      
      // NhanKhau can be chuHo of a HoKhau
      NhanKhau.hasOne(models.HoKhau, {
        foreignKey: 'chuHo',
        as: 'hoKhauChuHo'
      });
      
      NhanKhau.hasMany(models.TamTruTamVang, {
        foreignKey: 'nhanKhauId',
        as: 'tamTruTamVang'
      });
      
      NhanKhau.hasOne(models.ThanhVienHoKhau, {
        foreignKey: 'nhanKhauId',
        as: 'thanhVienHoKhau'
      });
      
      NhanKhau.hasMany(models.LichSuThayDoiHoKhau, {
        foreignKey: 'nhanKhauId',
        as: 'lichSuThayDoi'
      });
    }
  }
  NhanKhau.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    hoTen: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ngaySinh: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gioiTinh: {
      type: DataTypes.STRING,
      allowNull: false
    },
    danToc: DataTypes.STRING,
    tonGiao: DataTypes.STRING,
    cccd: {
      type: DataTypes.STRING,
      unique: true
    },
    ngayCap: DataTypes.DATE,
    noiCap: DataTypes.STRING,
    ngheNghiep: DataTypes.STRING,
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    ghiChu: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'NhanKhau',
    tableName: 'nhankhau'
  });
  return NhanKhau;
}; 