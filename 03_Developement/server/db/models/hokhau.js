'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HoKhau extends Model {
    static associate(models) {
      HoKhau.belongsTo(models.NhanKhau, {
        foreignKey: 'chuho',
        as: 'chuHo'
      });
      HoKhau.hasMany(models.ThanhVienHoKhau, {
        foreignKey: 'hokhau_id',
        as: 'thanhVien'
      });
      HoKhau.hasMany(models.LichSuThayDoiHoKhau, {
        foreignKey: 'hokhau_id',
        as: 'lichSuThayDoi'
      });
      HoKhau.hasMany(models.NopPhi, {
        foreignKey: 'hokhau_id',
        as: 'nopPhi'
      });
    }
  }
  HoKhau.init({
    sohokhau: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chuho: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    sonha: DataTypes.STRING,
    duong: DataTypes.STRING,
    phuong: DataTypes.STRING,
    quan: DataTypes.STRING,
    thanhpho: DataTypes.STRING,
    ngaylamhokhau: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'HoKhau',
    tableName: 'hokhau'
  });
  return HoKhau;
}; 