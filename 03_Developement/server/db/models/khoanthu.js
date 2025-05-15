'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KhoanThu extends Model {
    static associate(models) {
      KhoanThu.hasMany(models.NopPhi, {
        foreignKey: 'khoanthu_id',
        as: 'nopPhi'
      });
    }
  }
  KhoanThu.init({
    ngaytao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    thoihan: DataTypes.DATE,
    tenkhoanthu: {
      type: DataTypes.STRING,
      allowNull: false
    },
    batbuoc: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ghichu: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'KhoanThu',
    tableName: 'khoanthu'
  });
  return KhoanThu;
}; 