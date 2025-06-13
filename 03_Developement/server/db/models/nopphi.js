'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NopPhi extends Model {
    static associate(models) {
      NopPhi.belongsTo(models.HoKhau, {
        foreignKey: 'hokhau_id',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
      NopPhi.belongsTo(models.KhoanThu, {
        foreignKey: 'khoanthu_id',
        as: 'khoanThu'
      });
    }
  }
  NopPhi.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    hokhau_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'HoKhau',
        key: 'soHoKhau'
      }
    },
    khoanthu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'KhoanThu',
        key: 'id'
      }
    },
    sotien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    ngaynop: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    nguoinop: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phuongthuc: {
      type: DataTypes.ENUM('CASH', 'BANK_TRANSFER', 'ONLINE', 'CHECK'),
      allowNull: false,
      defaultValue: 'CASH'
    },
    ghichu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    cancelledBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'NopPhi',
    tableName: 'NopPhi',
    paranoid: true, // Enables soft delete
    timestamps: true
  });
  return NopPhi;
}; 