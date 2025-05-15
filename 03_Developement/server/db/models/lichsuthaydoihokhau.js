'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LichSuThayDoiHoKhau extends Model {
    static associate(models) {
      LichSuThayDoiHoKhau.belongsTo(models.NhanKhau, {
        foreignKey: 'nhankhau_id',
        as: 'nhanKhau'
      });
      LichSuThayDoiHoKhau.belongsTo(models.HoKhau, {
        foreignKey: 'hokhau_id',
        as: 'hoKhau'
      });
    }
  }
  LichSuThayDoiHoKhau.init({
    nhankhau_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    },
    hokhau_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hokhau',
        key: 'sohokhau'
      }
    },
    loaithaydoi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thoigian: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'LichSuThayDoiHoKhau',
    tableName: 'lichsuthaydoihokhau'
  });
  return LichSuThayDoiHoKhau;
}; 