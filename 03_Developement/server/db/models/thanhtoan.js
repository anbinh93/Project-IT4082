'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ThanhToan extends Model {
    static associate(models) {
      // ThanhToan belongs to DotThu
      ThanhToan.belongsTo(models.DotThu, {
        foreignKey: 'dotThuId',
        as: 'dotThu'
      });
      
      // ThanhToan belongs to KhoanThu
      ThanhToan.belongsTo(models.KhoanThu, {
        foreignKey: 'khoanThuId',
        as: 'khoanThu'
      });
      
      // ThanhToan belongs to HoKhau
      ThanhToan.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        sourceKey: 'soHoKhau',
        as: 'hoKhau'
      });
      
      // ThanhToan belongs to NhanKhau (người nộp)
      ThanhToan.belongsTo(models.NhanKhau, {
        foreignKey: 'nguoiNopId',
        as: 'nguoiNop'
      });
    }
  }

  ThanhToan.init({
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
    nguoiNopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'NhanKhaus',
        key: 'id'
      }
    },
    soTien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    ngayNop: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    hinhThucNop: {
      type: DataTypes.ENUM('TIEN_MAT', 'CHUYEN_KHOAN', 'THE_ATM'),
      allowNull: false,
      defaultValue: 'TIEN_MAT'
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    trangThai: {
      type: DataTypes.ENUM('DA_XAC_NHAN', 'DANG_XU_LY', 'BI_HUY'),
      allowNull: false,
      defaultValue: 'DA_XAC_NHAN'
    },
    nguoiTaoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ThanhToan',
    tableName: 'ThanhToans',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['dotThuId', 'khoanThuId', 'hoKhauId'],
        unique: true,
        name: 'unique_payment_per_household_fee'
      },
      {
        fields: ['ngayNop']
      },
      {
        fields: ['hoKhauId']
      }
    ]
  });

  return ThanhToan;
};
