'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DotThu extends Model {
    static associate(models) {
      DotThu.belongsToMany(models.KhoanThu, {
        through: 'DotThu_KhoanThu',
        foreignKey: 'dotThuId',
        otherKey: 'khoanThuId',
        as: 'khoanThu'
      });
      
      // DotThu has many ThanhToan
      DotThu.hasMany(models.ThanhToan, {
        foreignKey: 'dotThuId',
        as: 'thanhToan'
      });
    }
  }
  
  DotThu.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tenDotThu: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ngayTao: DataTypes.DATE,
    thoiHan: DataTypes.DATE,
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'DANG_MO'
    },
    dongTuDong: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'DotThu',
    tableName: 'DotThu'
  });
  
  return DotThu;
};
