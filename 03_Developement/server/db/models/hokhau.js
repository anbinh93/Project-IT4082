'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HoKhau extends Model {
    static associate(models) {
      HoKhau.belongsTo(models.NhanKhau, {
        foreignKey: 'chuHo',
        as: 'chuHoInfo'
      });
      HoKhau.hasMany(models.ThanhVienHoKhau, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'thanhVien'
      });
      HoKhau.hasMany(models.LichSuThayDoiHoKhau, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'lichSuThayDoi'
      });
      HoKhau.hasMany(models.NopPhi, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'nopPhi'
      });
      HoKhau.hasMany(models.PhuongTien, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'phuongTien'
      });
      HoKhau.hasOne(models.Phong, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'phong'
      });
      HoKhau.hasMany(models.QuanLyXe, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'quanLyXes'
      });
    }
  }
  HoKhau.init({
    soHoKhau: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chuHo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    soNha: DataTypes.STRING,
    duong: DataTypes.STRING,
    phuong: DataTypes.STRING,
    quan: DataTypes.STRING,
    thanhPho: DataTypes.STRING,
    ngayLamHoKhau: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'HoKhau',
    tableName: 'hokhau'
  });
  return HoKhau;
}; 