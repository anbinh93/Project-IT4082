const db = require('../db/models');
const { QuanLyXe, LoaiXe, HoKhau, NhanKhau } = db;
const { Op } = require('sequelize');

const vehicleService = {
  // Vehicle Type Services
  async getAllVehicleTypes() {
    return await LoaiXe.findAll({
      order: [['ten', 'ASC']]
    });
  },

  async createVehicleType(data) {
    const { tenLoaiXe, phiThue, moTa } = data;
    
    // Check if exists
    const existing = await LoaiXe.findOne({ where: { ten: tenLoaiXe } });
    if (existing) {
      throw new Error('Loại xe đã tồn tại');
    }

    return await LoaiXe.create({
      ten: tenLoaiXe,
      phiThue: phiThue || 0,
      moTa
    });
  },

  async updateVehicleType(id, data) {
    const vehicleType = await LoaiXe.findByPk(id);
    if (!vehicleType) {
      throw new Error('Không tìm thấy loại xe');
    }

    const { tenLoaiXe, phiThue, moTa } = data;
    
    // Check name conflict if updating name
    if (tenLoaiXe && tenLoaiXe !== vehicleType.ten) {
      const existing = await LoaiXe.findOne({ where: { ten: tenLoaiXe } });
      if (existing) {
        throw new Error('Tên loại xe đã tồn tại');
      }
    }

    return await vehicleType.update({
      ten: tenLoaiXe || vehicleType.ten,
      phiThue: phiThue !== undefined ? phiThue : vehicleType.phiThue,
      moTa: moTa !== undefined ? moTa : vehicleType.moTa
    });
  },

  async deleteVehicleType(id) {
    const vehicleType = await LoaiXe.findByPk(id);
    if (!vehicleType) {
      throw new Error('Không tìm thấy loại xe');
    }

    // Check if being used
    const vehicleCount = await QuanLyXe.count({ where: { loaiXeId: id } });
    if (vehicleCount > 0) {
      throw new Error('Loại xe đang được sử dụng, không thể xóa');
    }

    return await vehicleType.destroy();
  },

  // Vehicle Management Services
  async getAllVehicles(options = {}) {
    const { page = 1, limit = 10, search = '', hoKhauId = '', loaiXeId = '', trangThai = '' } = options;
    const offset = (page - 1) * limit;

    const whereCondition = {};
    
    if (search) {
      whereCondition.bienSo = { [Op.like]: `%${search}%` };
    }
    if (hoKhauId) {
      whereCondition.hoKhauId = hoKhauId;
    }
    if (loaiXeId) {
      whereCondition.loaiXeId = loaiXeId;
    }
    if (trangThai) {
      whereCondition.trangThai = trangThai;
    }

    return await QuanLyXe.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: LoaiXe,
          as: 'loaiXe',
          attributes: ['id', 'ten', 'phiThue', 'moTa']
        },
        {
          model: HoKhau,
          as: 'hoKhau',
          attributes: ['soHoKhau', 'chuHo', 'soNha', 'duong', 'phuong', 'quan'],
          include: [
            {
              model: NhanKhau,
              as: 'chuHoInfo',
              attributes: ['id', 'hoTen', 'cccd']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']] // Order by id instead of createdAt
    });
  },

  async createVehicle(data) {
    const { hoKhauId, loaiXeId, bienSo, ngayBatDau, ngayKetThuc, trangThai, ghiChu } = data;

    // Validate required fields
    if (!hoKhauId || !loaiXeId || !bienSo) {
      throw new Error('Thiếu thông tin bắt buộc: hộ khẩu, loại xe, biển số');
    }

    // Validate license plate format (Vietnamese format)
    const bienSoRegex = /^[0-9]{2}[A-Z]{1,2}-[0-9]{3,5}$|^[A-Z]{2}-[0-9]{3,4}$/;
    if (!bienSoRegex.test(bienSo)) {
      throw new Error('Biển số xe không đúng định dạng');
    }

    // Check household exists
    const hoKhau = await HoKhau.findOne({ where: { soHoKhau: hoKhauId } });
    if (!hoKhau) {
      throw new Error('Không tìm thấy hộ khẩu');
    }

    // Check vehicle type exists and is active
    const loaiXe = await LoaiXe.findByPk(loaiXeId);
    if (!loaiXe) {
      throw new Error('Không tìm thấy loại xe');
    }

    // Check license plate uniqueness
    const existing = await QuanLyXe.findOne({ where: { bienSo } });
    if (existing) {
      throw new Error('Biển số xe đã tồn tại');
    }

    const newVehicle = await QuanLyXe.create({
      hoKhauId,
      loaiXeId,
      bienSo,
      ngayBatDau,
      ngayKetThuc,
      trangThai: trangThai || 'ACTIVE',
      ghiChu
    });

    // Return with associations
    return await QuanLyXe.findByPk(newVehicle.id, {
      include: [
        {
          model: LoaiXe,
          as: 'loaiXe',
          attributes: ['id', 'ten', 'phiThue', 'moTa']
        },
        {
          model: HoKhau,
          as: 'hoKhau',
          attributes: ['soHoKhau', 'chuHo', 'soNha', 'duong'],
          include: [
            {
              model: NhanKhau,
              as: 'chuHoInfo',
              attributes: ['id', 'hoTen', 'cccd']
            }
          ]
        }
      ]
    });
  },

  async updateVehicle(id, data) {
    const vehicle = await QuanLyXe.findByPk(id);
    if (!vehicle) {
      throw new Error('Không tìm thấy xe');
    }

    const { hoKhauId, loaiXeId, bienSo, ngayBatDau, ngayKetThuc, trangThai } = data;

    // Check license plate conflict
    if (bienSo && bienSo !== vehicle.bienSo) {
      const existing = await QuanLyXe.findOne({ 
        where: { 
          bienSo,
          id: { [Op.ne]: id }
        } 
      });
      if (existing) {
        throw new Error('Biển số xe đã tồn tại');
      }
    }

    // Validate household if changed
    if (hoKhauId && hoKhauId !== vehicle.hoKhauId) {
      const hoKhau = await HoKhau.findOne({ where: { soHoKhau: hoKhauId } });
      if (!hoKhau) {
        throw new Error('Không tìm thấy hộ khẩu');
      }
    }

    // Validate vehicle type if changed
    if (loaiXeId && loaiXeId !== vehicle.loaiXeId) {
      const loaiXe = await LoaiXe.findByPk(loaiXeId);
      if (!loaiXe) {
        throw new Error('Không tìm thấy loại xe');
      }
    }

    await vehicle.update({
      hoKhauId: hoKhauId || vehicle.hoKhauId,
      loaiXeId: loaiXeId || vehicle.loaiXeId,
      bienSo: bienSo || vehicle.bienSo,
      ngayBatDau: ngayBatDau || vehicle.ngayBatDau,
      ngayKetThuc: ngayKetThuc !== undefined ? ngayKetThuc : vehicle.ngayKetThuc,
      trangThai: trangThai || vehicle.trangThai
    });

    // Return updated vehicle with associations
    return await QuanLyXe.findByPk(id, {
      include: [
        {
          model: LoaiXe,
          as: 'loaiXe',
          attributes: ['id', 'ten', 'phiThue', 'moTa']
        },
        {
          model: HoKhau,
          as: 'hoKhau',
          attributes: ['soHoKhau', 'chuHo', 'soNha', 'duong'],
          include: [
            {
              model: NhanKhau,
              as: 'chuHoInfo',
              attributes: ['id', 'hoTen', 'cccd']
            }
          ]
        }
      ]
    });
  },

  async deleteVehicle(id) {
    const vehicle = await QuanLyXe.findByPk(id);
    if (!vehicle) {
      throw new Error('Không tìm thấy xe');
    }

    return await vehicle.destroy();
  },

  async getVehiclesByHousehold(hoKhauId) {
    return await QuanLyXe.findAll({
      where: { hoKhauId },
      include: [
        {
          model: LoaiXe,
          as: 'loaiXe',
          attributes: ['id', 'ten', 'phiThue', 'moTa']
        }
      ],
      order: [['id', 'DESC']] // Order by id instead of createdAt
    });
  },

  async getVehicleStatistics() {
    // Overview statistics
    const totalVehicles = await QuanLyXe.count();
    const activeVehicles = await QuanLyXe.count({ where: { trangThai: 'ACTIVE' } });
    const inactiveVehicles = await QuanLyXe.count({ where: { trangThai: 'INACTIVE' } });

    // Statistics by vehicle type
    const vehiclesByType = await QuanLyXe.findAll({
      attributes: [
        'loaiXeId',
        [db.sequelize.fn('COUNT', db.sequelize.col('QuanLyXe.id')), 'count']
      ],
      include: [
        {
          model: LoaiXe,
          as: 'loaiXe',
          attributes: ['id', 'ten', 'phiThue']
        }
      ],
      group: ['loaiXeId', 'loaiXe.id'],
      order: [[db.sequelize.fn('COUNT', db.sequelize.col('QuanLyXe.id')), 'DESC']]
    });

    // Monthly statistics (last 12 months) - PostgreSQL compatible
    const monthlyStats = await QuanLyXe.findAll({
      attributes: [
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('YEAR FROM "ngayBatDau"')), 'year'],
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM "ngayBatDau"')), 'month'],
        [db.sequelize.fn('COUNT', db.sequelize.col('QuanLyXe.id')), 'count']
      ],
      where: {
        ngayBatDau: {
          [Op.gte]: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          [Op.ne]: null // Exclude null dates
        }
      },
      group: [
        db.sequelize.fn('EXTRACT', db.sequelize.literal('YEAR FROM "ngayBatDau"')),
        db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM "ngayBatDau"'))
      ],
      order: [
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('YEAR FROM "ngayBatDau"')), 'ASC'],
        [db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM "ngayBatDau"')), 'ASC']
      ]
    });

    return {
      overview: {
        total: totalVehicles,
        active: activeVehicles,
        inactive: inactiveVehicles
      },
      byType: vehiclesByType,
      monthly: monthlyStats
    };
  }
};

module.exports = vehicleService;