const vehicleService = require('../services/vehicleService');

const vehicleController = {
  // Lấy danh sách loại xe
  async getVehicleTypes(req, res) {
    try {
      const loaiXes = await vehicleService.getAllVehicleTypes();
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

  // Tạo loại xe mới
  async createVehicleType(req, res) {
    try {
      const { tenLoaiXe, phiThue, moTa } = req.body;

      if (!tenLoaiXe) {
        return res.status(400).json({
          success: false,
          message: 'Tên loại xe là bắt buộc'
        });
      }

      const newVehicleType = await vehicleService.createVehicleType({ tenLoaiXe, phiThue, moTa });

      res.status(201).json({
        success: true,
        message: 'Tạo loại xe thành công',
        data: newVehicleType
      });
    } catch (error) {
      console.error('Error creating vehicle type:', error);
      const statusCode = error.message.includes('đã tồn tại') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Cập nhật loại xe
  async updateVehicleType(req, res) {
    try {
      const { id } = req.params;
      const { tenLoaiXe, phiThue, moTa, trangThai } = req.body;

      const updatedType = await vehicleService.updateVehicleType(id, { tenLoaiXe, phiThue, moTa, trangThai });

      res.json({
        success: true,
        message: 'Cập nhật loại xe thành công',
        data: updatedType
      });
    } catch (error) {
      console.error('Error updating vehicle type:', error);
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 
                        error.message.includes('đã tồn tại') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Xóa loại xe
  async deleteVehicleType(req, res) {
    try {
      const { id } = req.params;
      await vehicleService.deleteVehicleType(id);

      res.json({
        success: true,
        message: 'Xóa loại xe thành công'
      });
    } catch (error) {
      console.error('Error deleting vehicle type:', error);
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 
                        error.message.includes('đang được sử dụng') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Lấy danh sách xe
  async getAllVehicles(req, res) {
    try {
      const options = req.query;
      const result = await vehicleService.getAllVehicles(options);

      res.json({
        success: true,
        data: {
          vehicles: result.vehicles,
          pagination: {
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            totalItems: result.total,
            itemsPerPage: parseInt(options.limit || 10)
          }
        }
      });
    } catch (error) {
      console.error('Error getting vehicles:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách xe',
        error: error.message
      });
    }
  },

  // Tạo xe mới
  async createVehicle(req, res) {
    try {
      const vehicleData = req.body;
      const newVehicle = await vehicleService.createVehicle(vehicleData);

      res.status(201).json({
        success: true,
        message: 'Đăng ký xe thành công',
        data: newVehicle
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 
                        error.message.includes('đã tồn tại') || error.message.includes('Thiếu thông tin') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Cập nhật thông tin xe
  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const vehicleData = req.body;
      
      const updatedVehicle = await vehicleService.updateVehicle(id, vehicleData);

      res.json({
        success: true,
        message: 'Cập nhật thông tin xe thành công',
        data: updatedVehicle
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 
                        error.message.includes('đã tồn tại') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Xóa xe
  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;
      await vehicleService.deleteVehicle(id);

      res.json({
        success: true,
        message: 'Xóa xe thành công'
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  // Lấy xe theo hộ khẩu
  async getVehiclesByHousehold(req, res) {
    try {
      const { hoKhauId } = req.params;
      const vehicles = await vehicleService.getVehiclesByHousehold(hoKhauId);

      res.json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      console.error('Error getting vehicles by household:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách xe theo hộ khẩu',
        error: error.message
      });
    }
  },

  // Thống kê xe
  async getVehicleStatistics(req, res) {
    try {
      const stats = await vehicleService.getVehicleStatistics();

      res.json({
        success: true,
        data: stats
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
