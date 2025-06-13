'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // Define associations here
      Room.belongsTo(models.HoKhau, {
        foreignKey: 'hoKhauId',
        targetKey: 'soHoKhau',
        as: 'hoKhau'
      });
    }
  }
  
  Room.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    soPhong: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Số phòng phải match với số nhà trong hộ khẩu'
    },
    tang: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dienTich: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    hoKhauId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'HoKhau',
        key: 'soHoKhau'
      }
    },
    ngayBatDau: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ngayKetThuc: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trangThai: {
      type: DataTypes.ENUM('trong', 'da_thue', 'bao_tri'),
      allowNull: false,
      defaultValue: 'trong'
    },
    nguoiThue: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tên người thuê thực tế (có thể khác với chủ hộ)'
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'Rooms'
  });
  
  return Room;
};
