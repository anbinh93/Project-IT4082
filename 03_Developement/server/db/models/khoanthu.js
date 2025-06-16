'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KhoanThu extends Model {
    static associate(models) {
      KhoanThu.hasMany(models.NopPhi, {
        foreignKey: 'khoanthu_id',
        as: 'nopPhi'
      });
      KhoanThu.belongsToMany(models.DotThu, {
        through: 'DotThu_KhoanThu',
        foreignKey: 'khoanThuId',
        otherKey: 'dotThuId',
        as: 'dotThu'
      });
      
      // KhoanThu has many ThanhToan
      KhoanThu.hasMany(models.ThanhToan, {
        foreignKey: 'khoanThuId',
        as: 'thanhToan'
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
    tenkhoanthu: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ngaytao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    thoihan: {
      type: DataTypes.DATE,
      allowNull: true
    },
    batbuoc: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ghichu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    soTienToiThieu: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Số tiền tối thiểu cho khoản thu không bắt buộc (đóng góp)'
    }
  }, {
    sequelize,
    modelName: 'KhoanThu',
    tableName: 'KhoanThu',
    timestamps: true
  });
  return KhoanThu;
}; 