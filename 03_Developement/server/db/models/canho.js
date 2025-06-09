'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CanHo extends Model {
    static associate(models) {
      // One CanHo belongs to one NhanKhau (chu ho)
      CanHo.belongsTo(models.NhanKhau, {
        foreignKey: 'chuHoId',
        targetKey: 'id',
        as: 'chuHo'
      });
    }
  }

  CanHo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    soPhong: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chuHoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'nhankhau',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'CanHo',
    tableName: 'canho',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        fields: ['soPhong']
      },
      {
        fields: ['chuHoId'],
        unique: true
      }
    ]
  });

  return CanHo;
};
