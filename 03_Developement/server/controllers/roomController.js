const db = require('../db/models');
const { Phong, HoKhau, NhanKhau } = db;
const { Op } = require('sequelize');

const roomController = {
  // Lấy danh sách tất cả phòng
  async getAllRooms(req, res) {
    try {
      const { page = 1, limit = 10, search = '', status = '', loaiPhong = '' } = req.query;
      const offset = (page - 1) * limit;

      const whereCondition = {};
      
      // Tìm kiếm theo số phòng
      if (search) {
        whereCondition.soPhong = {
          [Op.like]: `%${search}%`
        };
      }

      // Lọc theo trạng thái
      if (status) {
        whereCondition.trangThai = status;
      }

      // Lọc theo loại phòng
      if (loaiPhong) {
        whereCondition.loaiPhong = loaiPhong;
      }

      const { count, rows } = await Phong.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: HoKhau,
            as: 'hoKhau',
            required: false,
            attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan'],
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
        order: [['soPhong', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          rooms: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting rooms:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách phòng',
        error: error.message
      });
    }
  },

  // Lấy thông tin một phòng theo ID
  async getRoomById(req, res) {
    try {
      const { id } = req.params;

      const room = await Phong.findByPk(id, {
        include: [
          {
            model: HoKhau,
            as: 'hokhau',
            required: false,
            attributes: ['sohokhau', 'sonha', 'duong', 'phuong', 'quan', 'ngaylamhokhau'],
            include: [
              {
                model: NhanKhau,
                as: 'chuHo',
                attributes: ['id', 'hoten', 'cccd', 'cccd', 'ngaysinh']
              }
            ]
          }
        ]
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      res.json({
        success: true,
        data: room
      });
    } catch (error) {
      console.error('Error getting room:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin phòng',
        error: error.message
      });
    }
  },

  // Thêm phòng mới
  async createRoom(req, res) {
    try {
      const {
        sophong,
        tang,
        dientich,
        dongia,
        hokhau_id,
        ngaybatdau,
        ngayketthuc,
        trangthai = 'trong',
        ghichu
      } = req.body;

      // Kiểm tra số phòng đã tồn tại
      const existingRoom = await Phong.findOne({
        where: { sophong }
      });

      if (existingRoom) {
        return res.status(400).json({
          success: false,
          message: 'Số phòng đã tồn tại'
        });
      }

      // Kiểm tra hộ khẩu có tồn tại (nếu có)
      if (hokhau_id) {
        const hokhau = await HoKhau.findByPk(hokhau_id);
        if (!hokhau) {
          return res.status(400).json({
            success: false,
            message: 'Hộ khẩu không tồn tại'
          });
        }
      }

      const room = await Phong.create({
        sophong,
        tang,
        dientich,
        dongia,
        hokhau_id,
        ngaybatdau,
        ngayketthuc,
        trangthai,
        ghichu
      });

      // Lấy thông tin phòng vừa tạo với include
      const newRoom = await Phong.findByPk(room.id, {
        include: [
          {
            model: HoKhau,
            as: 'hokhau',
            required: false,
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
        message: 'Thêm phòng thành công',
        data: newRoom
      });
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi thêm phòng',
        error: error.message
      });
    }
  },

  // Cập nhật thông tin phòng
  async updateRoom(req, res) {
    try {
      const { id } = req.params;
      const {
        sophong,
        tang,
        dientich,
        dongia,
        hokhau_id,
        ngaybatdau,
        ngayketthuc,
        trangthai,
        ghichu
      } = req.body;

      const room = await Phong.findByPk(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      // Kiểm tra số phòng đã tồn tại (nếu thay đổi)
      if (sophong && sophong !== room.sophong) {
        const existingRoom = await Phong.findOne({
          where: { 
            sophong,
            id: { [Op.ne]: id }
          }
        });

        if (existingRoom) {
          return res.status(400).json({
            success: false,
            message: 'Số phòng đã tồn tại'
          });
        }
      }

      // Kiểm tra hộ khẩu có tồn tại (nếu có)
      if (hokhau_id) {
        const hokhau = await HoKhau.findByPk(hokhau_id);
        if (!hokhau) {
          return res.status(400).json({
            success: false,
            message: 'Hộ khẩu không tồn tại'
          });
        }
      }

      await room.update({
        sophong,
        tang,
        dientich,
        dongia,
        hokhau_id,
        ngaybatdau,
        ngayketthuc,
        trangthai,
        ghichu
      });

      // Lấy thông tin phòng sau khi cập nhật
      const updatedRoom = await Phong.findByPk(id, {
        include: [
          {
            model: HoKhau,
            as: 'hokhau',
            required: false,
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
        message: 'Cập nhật phòng thành công',
        data: updatedRoom
      });
    } catch (error) {
      console.error('Error updating room:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật phòng',
        error: error.message
      });
    }
  },

  // Xóa phòng
  async deleteRoom(req, res) {
    try {
      const { id } = req.params;

      const room = await Phong.findByPk(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      // Kiểm tra phòng có đang được thuê không
      if (room.trangthai === 'da_thue' && room.hokhau_id) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa phòng đang được thuê'
        });
      }

      await room.destroy();

      res.json({
        success: true,
        message: 'Xóa phòng thành công'
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa phòng',
        error: error.message
      });
    }
  },

  // Gán phòng cho hộ khẩu
  async assignRoomToHousehold(req, res) {
    try {
      const { id } = req.params;
      const { hokhau_id, ngaybatdau, ngayketthuc } = req.body;

      const room = await Phong.findByPk(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      if (room.trangthai !== 'trong') {
        return res.status(400).json({
          success: false,
          message: 'Phòng không ở trạng thái trống'
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

      // Kiểm tra hộ khẩu đã có phòng chưa
      if (hokhau.phong_id) {
        return res.status(400).json({
          success: false,
          message: 'Hộ khẩu đã có phòng'
        });
      }

      // Cập nhật phòng
      await room.update({
        hokhau_id,
        ngaybatdau: ngaybatdau || new Date(),
        ngayketthuc,
        trangthai: 'da_thue'
      });

      // Cập nhật hộ khẩu
      await hokhau.update({
        phong_id: room.id
      });

      // Lấy thông tin phòng sau khi cập nhật
      const updatedRoom = await Phong.findByPk(id, {
        include: [
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
        message: 'Gán phòng cho hộ khẩu thành công',
        data: updatedRoom
      });
    } catch (error) {
      console.error('Error assigning room:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi gán phòng',
        error: error.message
      });
    }
  },

  // Hủy thuê phòng
  async unassignRoomFromHousehold(req, res) {
    try {
      const { id } = req.params;

      const room = await Phong.findByPk(id, {
        include: [
          {
            model: HoKhau,
            as: 'hokhau'
          }
        ]
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      if (room.trangthai !== 'da_thue') {
        return res.status(400).json({
          success: false,
          message: 'Phòng không ở trạng thái đã thuê'
        });
      }

      // Cập nhật hộ khẩu (nếu có)
      if (room.hokhau) {
        await room.hokhau.update({
          phong_id: null
        });
      }

      // Cập nhật phòng
      await room.update({
        hokhau_id: null,
        ngaybatdau: null,
        ngayketthuc: null,
        trangthai: 'trong'
      });

      res.json({
        success: true,
        message: 'Hủy thuê phòng thành công'
      });
    } catch (error) {
      console.error('Error unassigning room:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi hủy thuê phòng',
        error: error.message
      });
    }
  },

  // Thống kê phòng theo trạng thái
  async getRoomStatistics(req, res) {
    try {
      const stats = await Phong.findAll({
        attributes: [
          'trangthai',
          'tang',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
          [require('sequelize').fn('AVG', require('sequelize').col('dongia')), 'avgPrice'],
          [require('sequelize').fn('SUM', require('sequelize').col('dientich')), 'totalArea']
        ],
        group: ['trangthai', 'tang'],
        order: [['tang', 'ASC']],
        raw: true
      });

      // Tổng hợp theo trạng thái
      const statusStats = await Phong.findAll({
        attributes: [
          'trangthai',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['trangthai'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          detailStats: stats,
          statusStats
        }
      });
    } catch (error) {
      console.error('Error getting room statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thống kê phòng',
        error: error.message
      });
    }
  },

  // Lấy danh sách phòng trống
  async getAvailableRooms(req, res) {
    try {
      const availableRooms = await Phong.findAll({
        where: {
          trangthai: 'trong'
        },
        attributes: ['id', 'sophong', 'tang', 'dientich', 'dongia'],
        order: [['tang', 'ASC'], ['sophong', 'ASC']]
      });

      res.json({
        success: true,
        data: availableRooms
      });
    } catch (error) {
      console.error('Error getting available rooms:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách phòng trống',
        error: error.message
      });
    }
  }
};

module.exports = roomController;
