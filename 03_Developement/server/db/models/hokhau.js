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
        foreignKey: 'hokhau_id',
        sourceKey: 'soHoKhau',
        as: 'nopPhi'
      });
      HoKhau.hasMany(models.QuanLyXe, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'quanLyXe'
      });
      
      // HoKhau has many ThanhToan
      HoKhau.hasMany(models.ThanhToan, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'thanhToan'
      });
      
      // HoKhau has one Canho
      HoKhau.hasOne(models.Canho, {
        foreignKey: 'hoKhauId' ,
        sourceKey: 'soHoKhau',
        as: 'canho'
      });
      
      // HoKhau has one Room
      HoKhau.hasOne(models.Room, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'room'
      });
      
      // Has many HouseholdFee
      HoKhau.hasMany(models.HouseholdFee, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'householdFees'
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
      allowNull: true, // Cho phép null khi chưa có chủ hộ
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
    ngayLamHoKhau: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'HoKhau',
    tableName: 'HoKhau'
  });
  return HoKhau;
};