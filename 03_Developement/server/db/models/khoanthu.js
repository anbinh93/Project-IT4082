'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KhoanThu extends Model {
    static associate(models) {
      KhoanThu.hasMany(models.NopPhi, {
        foreignKey: 'khoanThuId',
        as: 'nopPhi'
      });
      KhoanThu.belongsToMany(models.DotThu, {
        through: 'DotThu_KhoanThu',
        foreignKey: 'khoanThuId',
        otherKey: 'dotThuId',
        as: 'dotThu'
      });
    }
  }
  KhoanThu.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tenKhoanThu: {
      type: DataTypes.STRING,
      allowNull: false
    },
    batBuoc: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ghiChu: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'KhoanThu',
    tableName: 'KhoanThu'
  });
  return KhoanThu;
}; 