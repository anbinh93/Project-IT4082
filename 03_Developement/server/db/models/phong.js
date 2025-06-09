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
      unique: true,
      field: 'soPhong'
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      field: 'hoKhauId',  // This maps to the hoKhauId column
      references: {
        model: 'hokhau',
        key: 'soHoKhau'
      }
    },
    dienTich: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'dienTich',
      comment: 'Diện tích phòng (m²)'
    },
    tang: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tang',
      comment: 'Tầng của phòng'
    },
    loaiPhong: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'loaiPhong',
      comment: 'Loại phòng'
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'vacant',
      field: 'trangThai',
      comment: 'Trạng thái phòng'
    },
    ngayVaoO: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ngayVaoO',
      comment: 'Ngày bắt đầu thuê'
    }
  }, {
    sequelize,
    modelName: 'Phong',
    tableName: 'phong',
    timestamps: true,
    paranoid: false,
    underscored: false,  // Use camelCase field names
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
