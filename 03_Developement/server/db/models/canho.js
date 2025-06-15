'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Canho extends Model {
    static associate(models) {
      // Canho belongs to HoKhau
      Canho.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
    }
  }

  Canho.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    soPhong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'HoKhau',
        key: 'soHoKhau'
      }
    },
    dienTich: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Canho',
    tableName: 'Canho'
  });

  return Canho;
};
