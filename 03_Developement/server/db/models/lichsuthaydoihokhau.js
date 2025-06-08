'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LichSuThayDoiHoKhau extends Model {
    static associate(models) {
      LichSuThayDoiHoKhau.belongsTo(models.NhanKhau, {
        foreignKey: 'nhanKhauId',
        as: 'nhanKhau'
      });
      LichSuThayDoiHoKhau.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
    }
  }
  LichSuThayDoiHoKhau.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nhanKhauId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    loaiThayDoi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thoiGian: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'LichSuThayDoiHoKhau',
    tableName: 'lichsuthaydoihokhau'
  });
  return LichSuThayDoiHoKhau;
}; 