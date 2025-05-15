'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NhanKhau extends Model {
    static associate(models) {
      NhanKhau.hasOne(models.HoKhau, {
        foreignKey: 'chuho',
        as: 'hoKhauChuHo'
      });
      NhanKhau.hasMany(models.TamTruTamVang, {
        foreignKey: 'nhankhau_id',
        as: 'tamTruTamVang'
      });
      NhanKhau.hasOne(models.ThanhVienHoKhau, {
        foreignKey: 'nhankhau_id',
        as: 'thanhVienHoKhau'
      });
      NhanKhau.hasMany(models.LichSuThayDoiHoKhau, {
        foreignKey: 'nhankhau_id',
        as: 'lichSuThayDoi'
      });
    }
  }
  NhanKhau.init({
    hoten: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ngaysinh: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gioitinh: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dantoc: DataTypes.STRING,
    tongiao: DataTypes.STRING,
    cccd: {
      type: DataTypes.STRING,
      unique: true
    },
    ngaycap: DataTypes.DATE,
    noicap: DataTypes.STRING,
    nghenghiep: DataTypes.STRING,
    ghichu: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'NhanKhau',
    tableName: 'nhankhau'
  });
  return NhanKhau;
}; 