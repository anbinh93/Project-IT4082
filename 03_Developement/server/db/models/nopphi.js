'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NopPhi extends Model {
    static associate(models) {
      NopPhi.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
      NopPhi.belongsTo(models.KhoanThu, {
        foreignKey: 'khoanThuId',
        as: 'khoanThu'
      });
    }
  }
  NopPhi.init({
    hoKhauId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    khoanThuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'khoanthu',
        key: 'id'
      }
    },
    soTien: DataTypes.DECIMAL(15, 2),
    nguoiNop: DataTypes.STRING,
    ngayNop: DataTypes.DATE,
    trangThai: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'NopPhi',
    tableName: 'NopPhi'
  });
  return NopPhi;
}; 