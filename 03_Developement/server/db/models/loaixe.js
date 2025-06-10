'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoaiXe extends Model {
    static associate(models) {
      // One LoaiXe has many QuanLyXe
      LoaiXe.hasMany(models.QuanLyXe, {
        foreignKey: 'loaiXeId',
        as: 'quanLyXes'
      });
    }
  }

  LoaiXe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ten: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phiThue: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    moTa: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'LoaiXe',
    tableName: 'LoaiXe'
  });

  return LoaiXe;
};
