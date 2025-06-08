'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Phong extends Model {
    static associate(models) {
      Phong.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
    }
  }
  
  Phong.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    dienTich: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Diện tích phòng (m²)'
    },
    tang: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tầng của phòng'
    },
    loaiPhong: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Loại phòng'
    },
    giaThue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.00,
      comment: 'Tiền thuê hàng tháng (VND)'
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'vacant',
      comment: 'Trạng thái phòng'
    },
    ngayVaoO: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Ngày bắt đầu thuê'
    }
  }, {
    sequelize,
    modelName: 'Phong',
    tableName: 'phong',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['soPhong']
      },
      {
        unique: true,
        fields: ['hoKhauId']
      },
      {
        fields: ['loaiPhong']
      },
      {
        fields: ['trangThai']
      }
    ]
  });
  
  return Phong;
};
