'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DotThu_KhoanThu extends Model {
    static associate(models) {
      DotThu_KhoanThu.belongsTo(models.DotThu, {
        foreignKey: 'dotThuId',
        as: 'dotThu'
      });
      DotThu_KhoanThu.belongsTo(models.KhoanThu, {
        foreignKey: 'khoanThuId',
        as: 'khoanThu'
      });
    }
  }
  
  DotThu_KhoanThu.init({
    dotThuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'dotthu',
        key: 'id'
      }
    },
    khoanThuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'khoanthu',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'DotThu_KhoanThu',
    tableName: 'DotThu_KhoanThu'
  });
  
  return DotThu_KhoanThu;
};
