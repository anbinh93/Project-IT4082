'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NhanKhau extends Model {
    static associate(models) {
      // NhanKhau can be chuHo of a HoKhau
      NhanKhau.hasOne(models.HoKhau, {
        foreignKey: 'chuHo',
        as: 'hoKhauChuHo'
      });
      
      // NhanKhau has many TamTruTamVang
      NhanKhau.hasMany(models.TamTruTamVang, {
        foreignKey: 'nhanKhauId',
        as: 'tamTruTamVang'
      });
      
      // NhanKhau has one ThanhVienHoKhau
      NhanKhau.hasOne(models.ThanhVienHoKhau, {
        foreignKey: 'nhanKhauId',
        as: 'thanhVienHoKhau'
      });
      
      // NhanKhau has many LichSuThayDoiHoKhau
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
    ngheNghiep: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'NhanKhau',
    tableName: 'NhanKhau'
  });
  return NhanKhau;
}; 