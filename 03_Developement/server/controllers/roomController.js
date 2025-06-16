const db = require('../db/models');
const { Room, HoKhau } = db;
const { Op } = require('sequelize');

// Controller for room management
const roomController = {
  // Get all rooms with pagination and filters
  async getAllRooms(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        tang,
        trangThai,
        sortBy = 'soPhong',
        sortOrder = 'ASC'
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where conditions
      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { soPhong: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (tang) {
        whereConditions.tang = tang;
      }
      
      if (trangThai) {
        whereConditions.trangThai = trangThai;
      }

      // Get rooms with pagination
      const { count, rows: rooms } = await Room.findAndCountAll({
        where: whereConditions,
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder]],
        include: [
          {
            model: HoKhau,
            as: 'hoKhau',
            include: ['chuHoInfo']
          }
        ]
      });

      res.json({
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        rooms
      });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách phòng', error: error.message });
    }
  },

  // Get room by ID
  async getRoomById(req, res) {
    try {
      const { id } = req.params;
      
      const room = await Room.findByPk(id, {
        include: [
          {
            model: HoKhau,
            as: 'hoKhau',
            include: ['chuHoInfo']
          }
        ]
      });
      
      if (!room) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      
      res.json(room);
    } catch (error) {
      console.error('Error fetching room by ID:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin phòng', error: error.message });
    }
  },

  // Create a new room
  async createRoom(req, res) {
    try {
      const { soPhong, tang, dienTich, hoKhauId, ngayBatDau, ngayKetThuc, trangThai, ghiChu } = req.body;
      
      console.log('Creating room with data:', {
        soPhong, tang, dienTich, hoKhauId, trangThai
      });
      
      // Check if room with same number already exists
      const existingRoom = await Room.findOne({ where: { soPhong } });
      if (existingRoom) {
        return res.status(400).json({ message: 'Số phòng đã tồn tại' });
      }
      
      // Convert hoKhauId to integer if provided
      const hoKhauIdInt = hoKhauId ? parseInt(hoKhauId) : null;
      
      // Create new room
      const newRoom = await Room.create({
        soPhong,
        tang,
        dienTich,
        hoKhauId: hoKhauIdInt,
        ngayBatDau: ngayBatDau || null,
        ngayKetThuc: ngayKetThuc || null,
        trangThai: trangThai || 'trong',
        ghiChu
      });
      
      console.log('Room created successfully:', newRoom.id);
      res.status(201).json({ message: 'Tạo phòng mới thành công', room: newRoom });
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi tạo phòng mới', error: error.message });
    }
  },

  // Update room information
  async updateRoom(req, res) {
    try {
      const { id } = req.params;
      const { soPhong, tang, dienTich, hoKhauId, ngayBatDau, ngayKetThuc, trangThai, ghiChu } = req.body;
      
      const room = await Room.findByPk(id);
      if (!room) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      
      // If room number is being changed, check if new room number already exists
      if (soPhong !== room.soPhong) {
        const existingRoom = await Room.findOne({ where: { soPhong } });
        if (existingRoom) {
          return res.status(400).json({ message: 'Số phòng đã tồn tại' });
        }
      }
      
      // Convert hoKhauId to integer if provided
      const hoKhauIdInt = hoKhauId ? parseInt(hoKhauId) : null;
      
      // Update room
      await room.update({
        soPhong,
        tang,
        dienTich,
        hoKhauId: hoKhauIdInt,
        ngayBatDau: ngayBatDau || null,
        ngayKetThuc: ngayKetThuc || null,
        trangThai,
        ghiChu
      });
      
      res.json({ message: 'Cập nhật thông tin phòng thành công', room });
    } catch (error) {
      console.error('Error updating room:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật thông tin phòng', error: error.message });
    }
  },

  // Delete a room
  async deleteRoom(req, res) {
    try {
      const { id } = req.params;
      
      const room = await Room.findByPk(id);
      if (!room) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      
      // Delete room
      await room.destroy();
      
      res.json({ message: 'Xóa phòng thành công' });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa phòng', error: error.message });
    }
  },

  // Assign a room to a household
  async assignRoom(req, res) {
    const transaction = await db.sequelize.transaction();
    
    try {
      const { id } = req.params;
      const { hoKhauId, ngayBatDau } = req.body;
      
      // Convert hoKhauId to integer for consistency
      const hoKhauIdInt = parseInt(hoKhauId);
      
      console.log('Assigning room - Input data:', {
        roomId: id,
        hoKhauId: hoKhauIdInt,
        originalHoKhauId: hoKhauId,
        ngayBatDau
      });
      
      // Find room with transaction
      const room = await Room.findByPk(id, { transaction });
      if (!room) {
        await transaction.rollback();
        console.log('Room not found:', id);
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      
      console.log('Found room:', {
        id: room.id,
        soPhong: room.soPhong,
        currentStatus: room.trangThai,
        currentHoKhauId: room.hoKhauId
      });
      
      // Check if the household exists with transaction
      const hoKhau = await HoKhau.findOne({ 
        where: { soHoKhau: hoKhauIdInt },
        transaction 
      });
      
      if (!hoKhau) {
        await transaction.rollback();
        console.log('Household not found:', hoKhauIdInt);
        return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
      }
      
      console.log('Found household:', {
        soHoKhau: hoKhau.soHoKhau,
        soNha: hoKhau.soNha
      });
      
      // Check if room is already rented to a different household
      if (room.trangThai === 'da_thue' && room.hoKhauId !== null && room.hoKhauId !== hoKhauIdInt) {
        await transaction.rollback();
        console.log('Room already rented to different household:', {
          currentHoKhauId: room.hoKhauId,
          requestedHoKhauId: hoKhauIdInt
        });
        return res.status(400).json({ message: 'Phòng đã được thuê bởi hộ khẩu khác' });
      }
      
      // Check if household already has any room assigned (excluding the current room being assigned)
      const existingRoom = await Room.findOne({
        where: { 
          hoKhauId: hoKhauIdInt,
          id: { [Op.ne]: id } // Exclude the current room
        },
        transaction
      });
      
      if (existingRoom) {
        await transaction.rollback();
        console.log('Household already has a different room assigned:', {
          hoKhauId: hoKhauIdInt,
          existingRoomId: existingRoom.id,
          currentRoomId: id,
          existingRoomStatus: existingRoom.trangThai
        });
        return res.status(400).json({ message: 'Hộ khẩu này đã được gán căn hộ khác' });
      }
      
      // Assign room to household with transaction
      console.log('Updating room with household assignment...');
      await room.update({
        hoKhauId: hoKhauIdInt,
        ngayBatDau: ngayBatDau || new Date(),
        trangThai: 'da_thue'
      }, { transaction });
      
      await transaction.commit();
      console.log('Room assigned successfully');
      
      // Fetch updated room with associations
      const updatedRoom = await Room.findByPk(id, {
        include: [{
          model: HoKhau,
          as: 'hoKhau',
          include: [{
            model: db.NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen']
          }]
        }]
      });
      
      res.json({ 
        message: 'Gán phòng cho hộ khẩu thành công', 
        room: updatedRoom 
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error assigning room:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Có lỗi xảy ra khi gán phòng cho hộ khẩu', 
        error: error.message 
      });
    }
  },

  // Release a room from a household
  async releaseRoom(req, res) {
    try {
      const { id } = req.params;
      const { ngayKetThuc } = req.body;
      
      const room = await Room.findByPk(id);
      if (!room) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      
      // Check if room is actually rented
      if (room.trangThai !== 'da_thue' || !room.hoKhauId) {
        return res.status(400).json({ message: 'Phòng không được thuê' });
      }
      
      // Release room
      await room.update({
        hoKhauId: null,
        ngayKetThuc: ngayKetThuc || new Date(),
        trangThai: 'trong'
      });
      
      res.json({ message: 'Giải phóng phòng thành công', room });
    } catch (error) {
      console.error('Error releasing room:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi giải phóng phòng', error: error.message });
    }
  },

  // Get statistics about rooms
  async getRoomStatistics(req, res) {
    try {
      // Get total count of rooms
      const totalRooms = await Room.count();
      
      // Get count of rented rooms
      const rentedRooms = await Room.count({ where: { trangThai: 'da_thue' } });
      
      // Get count of available rooms
      const availableRooms = await Room.count({ where: { trangThai: 'trong' } });
      
      // Get count of rooms under maintenance
      const maintenanceRooms = await Room.count({ where: { trangThai: 'bao_tri' } });
      
      // Get distribution of rooms by floor
      const roomsByFloor = await Room.findAll({
        attributes: ['tang', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
        group: ['tang'],
        order: [['tang', 'ASC']]
      });
      
      res.json({
        totalRooms,
        rentedRooms,
        availableRooms,
        maintenanceRooms,
        roomsByFloor: roomsByFloor.map(item => ({
          tang: item.tang,
          count: parseInt(item.get('count'))
        }))
      });
    } catch (error) {
      console.error('Error fetching room statistics:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thống kê phòng', error: error.message });
    }
  },

  // Update tenant information for a room
  async updateTenant(req, res) {
    try {
      const { id } = req.params;
      const { nguoiThue } = req.body;

      if (!nguoiThue) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin người thuê'
        });
      }

      const room = await Room.findByPk(id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phòng'
        });
      }

      await room.update({ nguoiThue });

      // Fetch updated room with associations
      const updatedRoom = await Room.findByPk(id, {
        include: [{
          model: db.HoKhau,
          as: 'hoKhau',
          include: [{
            model: db.NhanKhau,
            as: 'chuHoInfo',
            attributes: ['id', 'hoTen']
          }]
        }]
      });

      res.json({
        success: true,
        message: 'Cập nhật thông tin người thuê thành công',
        room: updatedRoom
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật thông tin người thuê',
        error: error.message
      });
    }
  }
};

module.exports = roomController;
