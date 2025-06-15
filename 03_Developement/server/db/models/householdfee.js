'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HouseholdFee extends Model {
    static associate(models) {
      // Belong to DotThu
      HouseholdFee.belongsTo(models.DotThu, {
        foreignKey: 'dotThuId',
        as: 'dotThu'
      });
      
      // Belong to KhoanThu
      HouseholdFee.belongsTo(models.KhoanThu, {
        foreignKey: 'khoanThuId', 
        as: 'khoanThu'
      });
      
      // Belong to HoKhau
      HouseholdFee.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
    }
  }
  
  HouseholdFee.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dotThuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DotThus',
        key: 'id'
      }
    },
    khoanThuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'KhoanThus',
        key: 'id'
      }
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'HoKhaus',
        key: 'soHoKhau'
      }
    },
    soTien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Số tiền phải đóng cho khoản thu này'
    },
    soTienDaNop: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Số tiền đã nộp'
    },
    trangThai: {
      type: DataTypes.ENUM('chua_nop', 'nop_mot_phan', 'da_nop_du'),
      allowNull: false,
      defaultValue: 'chua_nop',
      comment: 'Trạng thái thanh toán'
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ghi chú về khoản thu này'
    },
    chiTietTinhPhi: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Chi tiết cách tính phí (diện tích, số xe, v.v.)'
    }
  }, {
    sequelize,
    modelName: 'HouseholdFee',
    tableName: 'HouseholdFees'
  });
  
  return HouseholdFee;
};
