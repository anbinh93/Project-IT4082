const db = require('../db/models');
const { LoaiXe, QuanLyXe, HoKhau, NhanKhau } = db;

const vehicleService = {
  // Get all vehicle types
  async getAllVehicleTypes() {
    try {
      return await LoaiXe.findAll();
    } catch (error) {
      throw error;
    }
  },

  // Create vehicle type
  async createVehicleType(data) {
    try {
      return await LoaiXe.create(data);
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle type
  async updateVehicleType(id, data) {
    try {
      const vehicleType = await LoaiXe.findByPk(id);
      if (!vehicleType) {
        throw new Error('Vehicle type not found');
      }
      return await vehicleType.update(data);
    } catch (error) {
      throw error;
    }
  },

  // Delete vehicle type
  async deleteVehicleType(id) {
    try {
      const vehicleType = await LoaiXe.findByPk(id);
      if (!vehicleType) {
        throw new Error('Vehicle type not found');
      }
      return await vehicleType.destroy();
    } catch (error) {
      throw error;
    }
  },

  // Get all vehicles
  async getAllVehicles(options = {}) {
    try {
      const { page = 1, limit = 10, hoKhauId } = options;
      const offset = (page - 1) * limit;
      
      const whereConditions = {};
      if (hoKhauId) {
        whereConditions.hoKhauId = hoKhauId;
      }

      const { count, rows: vehicles } = await QuanLyXe.findAndCountAll({
        where: whereConditions,
        limit: parseInt(limit),
        offset: offset,
        include: [
          {
            model: LoaiXe,
            as: 'loaiXe'
          },
          {
            model: HoKhau,
            as: 'hoKhau',
            include: [{
              model: NhanKhau,
              as: 'chuHoInfo'
            }]
          }
        ]
      });

      return {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        vehicles
      };
    } catch (error) {
      throw error;
    }
  },

  // Create vehicle
  async createVehicle(data) {
    try {
      return await QuanLyXe.create(data);
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle
  async updateVehicle(id, data) {
    try {
      const vehicle = await QuanLyXe.findByPk(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      return await vehicle.update(data);
    } catch (error) {
      throw error;
    }
  },

  // Delete vehicle
  async deleteVehicle(id) {
    try {
      const vehicle = await QuanLyXe.findByPk(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      return await vehicle.destroy();
    } catch (error) {
      throw error;
    }
  },

  // Get vehicles by household
  async getVehiclesByHousehold(hoKhauId) {
    try {
      return await QuanLyXe.findAll({
        where: { hoKhauId },
        include: [
          {
            model: LoaiXe,
            as: 'loaiXe'
          }
        ]
      });
    } catch (error) {
      throw error;
    }
  },

  // Get vehicle statistics
  async getVehicleStatistics() {
    try {
      const totalVehicles = await QuanLyXe.count();
      const activeVehicles = await QuanLyXe.count({
        where: { trangThai: 'hoat_dong' }
      });
      
      const vehiclesByType = await QuanLyXe.findAll({
        attributes: [
          'loaiXeId',
          [db.sequelize.fn('COUNT', db.sequelize.col('QuanLyXe.id')), 'count']
        ],
        include: [{
          model: LoaiXe,
          as: 'loaiXe',
          attributes: ['ten']
        }],
        group: ['loaiXeId', 'loaiXe.id', 'loaiXe.ten']
      });

      return {
        totalVehicles,
        activeVehicles,
        vehiclesByType
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = vehicleService;
