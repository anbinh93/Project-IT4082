const db = require('../db/models');
const { QuanLyXe, LoaiXe, HoKhau, NhanKhau, PhuongTien, Phong } = db;
const { Op } = require('sequelize');

const vehicleController = {
  // Lấy danh sách loại xe
  async getVehicleTypes(req, res) {
    try {
      const loaiXes = await LoaiXe.findAll({
        where: { trangThai: true },
        order: [['tenLoaiXe', 'ASC']]
      });

      res.json({
        success: true,
        data: loaiXes
      });
    } catch (error) {
      console.error('Error getting vehicle types:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách loại xe',
        error: error.message
      });
    }
  },
  // Lấy danh sách phương tiện
  async getAllVehicles(req, res) {
    try {
      const { page = 1, limit = 10, search = '', hoKhauId = '', loaiXeId = '' } = req.query;
      const offset = (page - 1) * limit;

      const whereCondition = {};
      
      // Tìm kiếm theo biển số
      if (search) {
        whereCondition.bienSo = {
          [Op.like]: `%${search}%`
        };
      }

      // Lọc theo hộ khẩu
      if (hoKhauId) {
        whereCondition.hoKhauId = hoKhauId;
      }

      // Include condition for loaiXe filter
      const includeCondition = [];
      
      if (loaiXeId) {
        includeCondition.push({
          model: LoaiXe,
          as: 'loaiXe',
          where: { id: loaiXeId },
          attributes: ['id', 'tenLoaiXe', 'phiThang', 'moTa']
        });
      } else {
        includeCondition.push({
          model: LoaiXe,
          as: 'loaiXe',
          attributes: ['id', 'tenLoaiXe', 'phiThang', 'moTa'],
          required: false
        });
      }

      includeCondition.push({
        model: HoKhau,
        as: 'hoKhau',
        attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan'],
        include: [
          {
            model: NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen', 'cccd']
          },
          {
            model: Phong,
            as: 'phong',
            attributes: ['soPhong', 'dienTich', 'loaiPhong', 'giaThue']
          }
        ]
      });

      const { count, rows } = await PhuongTien.findAndCountAll({
        where: whereCondition,
        include: includeCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          vehicles: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting vehicles:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách phương tiện',
        error: error.message
      });
    }
  },

  // Lấy danh sách quản lý xe
  async getVehicleManagement(req, res) {
    try {
      const { page = 1, limit = 10, hoKhauId = '', trangThai = '' } = req.query;
      const offset = (page - 1) * limit;

      const whereCondition = {};
      
      if (hoKhauId) {
        whereCondition.hoKhauId = hoKhauId;
      }

      if (trangThai) {
        whereCondition.trangThaiDangKy = trangThai;
      }

      const { count, rows } = await QuanLyXe.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: HoKhau,
            as: 'hoKhau',
            attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan'],
            include: [
              {
                model: NhanKhau,
                as: 'chuHoInfo',
                attributes: ['id', 'hoTen', 'cccd']
              },
              {
                model: Phong,
                as: 'phong',
                attributes: ['soPhong', 'dienTich', 'loaiPhong']
              }
            ]
          },
          {
            model: PhuongTien,
            as: 'phuongTien',
            attributes: ['id', 'bienSo', 'thoiGianGui', 'trangThai'],
            include: [
              {
                model: LoaiXe,
                as: 'loaiXe',
                attributes: ['id', 'tenLoaiXe', 'phiThang', 'moTa']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['ngayBatDau', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          vehicleManagement: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting vehicle management:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách quản lý xe',
        error: error.message
      });
    }
  },

  // Lấy thông tin một xe theo ID
  async getVehicleById(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await QuanLyXe.findByPk(id, {
        include: [
          {
            model: LoaiXe,
            as: 'loaixe',
            attributes: ['id', 'tenloaixe', 'giatien', 'mota']
          },
          {
            model: HoKhau,
            as: 'hokhau',
            attributes: ['sohokhau', 'sonha', 'duong', 'phuong', 'quan'],
            include: [
              {
                model: NhanKhau,
                as: 'chuHo',
                attributes: ['id', 'hoten', 'cccd', 'cccd']
              }
            ]
          }
        ]
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy xe'
        });
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      console.error('Error getting vehicle:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin xe',
        error: error.message
      });
    }
  },

  // Thêm xe mới
  async createVehicle(req, res) {
    try {
      const {
        hokhau_id,
        loaixe_id,
        bienso,
        tengoi,
        mausac,
        hangxe,
        namsx,
        ngayketthuc,
        ghichu
      } = req.body;

      // Kiểm tra biển số đã tồn tại
      const existingVehicle = await QuanLyXe.findOne({
        where: { bienso }
      });

      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          message: 'Biển số xe đã tồn tại'
        });
      }

      // Kiểm tra hộ khẩu có tồn tại
      const hokhau = await HoKhau.findByPk(hokhau_id);
      if (!hokhau) {
        return res.status(400).json({
          success: false,
          message: 'Hộ khẩu không tồn tại'
        });
      }

      // Kiểm tra loại xe có tồn tại
      const loaixe = await LoaiXe.findByPk(loaixe_id);
      if (!loaixe) {
        return res.status(400).json({
          success: false,
          message: 'Loại xe không tồn tại'
        });
      }

      const vehicle = await QuanLyXe.create({
        hokhau_id,
        loaixe_id,
        bienso: bienso.toUpperCase(),
        tengoi,
        mausac,
        hangxe,
        namsx,
        ngaydangky: new Date(),
        ngayketthuc,
        trangthai: 'dang_gui',
        ghichu
      });

      // Lấy thông tin xe vừa tạo với include
      const newVehicle = await QuanLyXe.findByPk(vehicle.id, {
        include: [
          {
            model: LoaiXe,
            as: 'loaixe',
            attributes: ['id', 'tenloaixe', 'giatien']
          },
          {
            model: HoKhau,
            as: 'hokhau',
            attributes: ['sohokhau', 'sonha', 'duong'],
            include: [
              {
                model: NhanKhau,
                as: 'chuHo',
                attributes: ['id', 'hoten', 'cccd']
              }
            ]
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Thêm xe thành công',
        data: newVehicle
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi thêm xe',
        error: error.message
      });
    }
  },

  // Cập nhật thông tin xe
  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const {
        hokhau_id,
        loaixe_id,
        bienso,
        tengoi,
        mausac,
        hangxe,
        namsx,
        ngayketthuc,
        trangthai,
        ghichu
      } = req.body;

      const vehicle = await QuanLyXe.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy xe'
        });
      }

      // Kiểm tra biển số đã tồn tại (nếu thay đổi)
      if (bienso && bienso !== vehicle.bienso) {
        const existingVehicle = await QuanLyXe.findOne({
          where: { 
            bienso: bienso.toUpperCase(),
            id: { [Op.ne]: id }
          }
        });

        if (existingVehicle) {
          return res.status(400).json({
            success: false,
            message: 'Biển số xe đã tồn tại'
          });
        }
      }

      await vehicle.update({
        hokhau_id,
        loaixe_id,
        bienso: bienso ? bienso.toUpperCase() : vehicle.bienso,
        tengoi,
        mausac,
        hangxe,
        namsx,
        ngayketthuc,
        trangthai,
        ghichu
      });

      // Lấy thông tin xe sau khi cập nhật
      const updatedVehicle = await QuanLyXe.findByPk(id, {
        include: [
          {
            model: LoaiXe,
            as: 'loaixe',
            attributes: ['id', 'tenloaixe', 'giatien']
          },
          {
            model: HoKhau,
            as: 'hokhau',
            attributes: ['sohokhau', 'sonha', 'duong'],
            include: [
              {
                model: NhanKhau,
                as: 'chuHo',
                attributes: ['id', 'hoten', 'cccd']
              }
            ]
          }
        ]
      });

      res.json({
        success: true,
        message: 'Cập nhật xe thành công',
        data: updatedVehicle
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật xe',
        error: error.message
      });
    }
  },

  // Xóa xe
  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await QuanLyXe.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy xe'
        });
      }

      await vehicle.destroy();

      res.json({
        success: true,
        message: 'Xóa xe thành công'
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa xe',
        error: error.message
      });
    }
  },

  // Lấy danh sách loại xe
  async getVehicleTypes(req, res) {
    try {
      const vehicleTypes = await LoaiXe.findAll({
        where: { trangThai: true },
        attributes: ['id', 'tenLoaiXe', 'phiThang', 'moTa'],
        order: [['tenLoaiXe', 'ASC']]
      });

      res.json({
        success: true,
        data: vehicleTypes
      });
    } catch (error) {
      console.error('Error getting vehicle types:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách loại xe',
        error: error.message
      });
    }
  },

  // Thống kê xe theo loại
  async getVehicleStatistics(req, res) {
    try {
      // Thống kê tổng quan
      const totalVehicles = await QuanLyXe.count();
      const activeVehicles = await QuanLyXe.count({ where: { trangthai: 'dang_gui' } });
      
      // Thống kê theo loại xe
      const vehiclesByType = await db.sequelize.query(`
        SELECT l.tenloaixe, COUNT(q.id) as count
        FROM loaixe l
        LEFT JOIN quanlyxe q ON l.id = q.loaixe_id
        GROUP BY l.id, l.tenloaixe
        ORDER BY count DESC
      `, { type: db.sequelize.QueryTypes.SELECT });

      // Thống kê theo trạng thái
      const vehiclesByStatus = await db.sequelize.query(`
        SELECT trangthai, COUNT(*) as count
        FROM quanlyxe
        GROUP BY trangthai
      `, { type: db.sequelize.QueryTypes.SELECT });

      res.json({
        success: true,
        data: {
          total: totalVehicles,
          active: activeVehicles,
          byType: vehiclesByType,
          byStatus: vehiclesByStatus
        }
      });
    } catch (error) {
      console.error('Error getting vehicle statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thống kê xe',
        error: error.message
      });
    }
  }
};

module.exports = vehicleController;
