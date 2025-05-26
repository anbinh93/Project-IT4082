'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NopPhi extends Model {
    static associate(models) {
      NopPhi.belongsTo(models.HoKhau, {
        foreignKey: 'hokhau_id',
        as: 'hoKhau'
      });
      NopPhi.belongsTo(models.KhoanThu, {
        foreignKey: 'khoanthu_id',
        as: 'khoanThu'
      });
      NopPhi.belongsTo(models.User, {
        foreignKey: 'cancelledBy',
        as: 'cancelledByUser'
      });
    }
  }
  NopPhi.init({
    hokhau_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'hokhau',
        key: 'sohokhau'
      }
    },
    khoanthu_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'khoanthu',
        key: 'id'
      }
    },
    nguoinop: DataTypes.STRING,
    sotien: DataTypes.DECIMAL(10, 2),
    ngaynop: DataTypes.DATE,
    phuongthuc: {
      type: DataTypes.STRING,
      defaultValue: 'CASH'
    },
    ghichu: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'REFUNDED'),
      defaultValue: 'ACTIVE'
    },
    cancelledBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cancelReason: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'NopPhi',
    tableName: 'nopphi',
    paranoid: true, // Enable soft delete
    deletedAt: 'deletedAt'
  });
  return NopPhi;
}; 