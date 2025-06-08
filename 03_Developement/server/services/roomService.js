const db = require('../db/models');
const { Op, fn, col } = require('sequelize');

/**
 * Room Service
 * Provides business logic for room management operations
 * Supports "tổ trưởng" (team leader) role operations
 */

class RoomService {
    /**
     * Get all rooms with filtering and pagination
     */
    static async getAllRooms(options = {}) {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            status = '', 
            loaiPhong = '' 
        } = options;
        
        const offset = (page - 1) * limit;
        const whereCondition = {};
        
        // Search by room number
        if (search) {
            whereCondition.soPhong = {
                [Op.like]: `%${search}%`
            };
        }

        // Filter by status
        if (status) {
            whereCondition.trangThai = status;
        }

        // Filter by room type
        if (loaiPhong) {
            whereCondition.loaiPhong = loaiPhong;
        }

        const { count, rows } = await db.Phong.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    required: false,
                    attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan'],
                    include: [
                        {
                            model: db.NhanKhau,
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

        return {
            rooms: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: parseInt(limit)
            }
        };
    }

    /**
     * Get room by ID with full details
     */
    static async getRoomById(roomId) {
        const room = await db.Phong.findByPk(roomId, {
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    required: false,
                    attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan', 'ngayLamHoKhau'],
                    include: [
                        {
                            model: db.NhanKhau,
                            as: 'chuHoInfo',
                            attributes: ['id', 'hoTen', 'cccd', 'ngaySinh']
                        }
                    ]
                }
            ]
        });

        return room;
    }

    /**
     * Create a new room
     */
    static async createRoom(roomData) {
        const { soPhong, tang, dienTich, soPhongNgu, soPhongTam, loaiPhong } = roomData;

        // Check if room number already exists
        const existingRoom = await db.Phong.findOne({
            where: { soPhong }
        });

        if (existingRoom) {
            throw new Error('Số phòng đã tồn tại');
        }

        const newRoom = await db.Phong.create({
            soPhong,
            tang,
            dienTich,
            soPhongNgu,
            soPhongTam,
            loaiPhong,
            giaThue,
            trangThai: 'Trống'
        });

        return newRoom;
    }

    /**
     * Update room information
     */
    static async updateRoom(roomId, updateData) {
        const room = await db.Phong.findByPk(roomId);
        
        if (!room) {
            throw new Error('Không tìm thấy phòng');
        }

        // Check if new room number conflicts with existing rooms
        if (updateData.soPhong && updateData.soPhong !== room.soPhong) {
            const existingRoom = await db.Phong.findOne({
                where: { 
                    soPhong: updateData.soPhong,
                    id: { [Op.ne]: roomId }
                }
            });

            if (existingRoom) {
                throw new Error('Số phòng đã tồn tại');
            }
        }

        await room.update(updateData);
        return room.reload({
            include: [
                {
                    model: db.HoKhau,
                    as: 'hoKhau',
                    required: false
                }
            ]
        });
    }

    /**
     * Delete a room
     */
    static async deleteRoom(roomId) {
        const room = await db.Phong.findByPk(roomId);
        
        if (!room) {
            throw new Error('Không tìm thấy phòng');
        }

        // Check if room has assigned household
        const hasHousehold = await db.HoKhau.findOne({
            where: { phongId: roomId }
        });

        if (hasHousehold) {
            throw new Error('Không thể xóa phòng đã được gán hộ khẩu');
        }

        await room.destroy();
        return true;
    }

    /**
     * Assign household to room
     */
    static async assignHouseholdToRoom(roomId, householdId) {
        const room = await db.Phong.findByPk(roomId);
        const household = await db.HoKhau.findByPk(householdId);

        if (!room) {
            throw new Error('Không tìm thấy phòng');
        }

        if (!household) {
            throw new Error('Không tìm thấy hộ khẩu');
        }

        if (room.trangThai === 'Đã thuê') {
            throw new Error('Phòng đã được thuê');
        }

        if (household.phongId) {
            throw new Error('Hộ khẩu đã được gán phòng');
        }

        // Update household with room assignment
        await household.update({ phongId: roomId });
        
        // Update room status
        await room.update({ trangThai: 'Đã thuê' });

        return await this.getRoomById(roomId);
    }

    /**
     * Unassign household from room
     */
    static async unassignHouseholdFromRoom(roomId) {
        const room = await db.Phong.findByPk(roomId);
        
        if (!room) {
            throw new Error('Không tìm thấy phòng');
        }

        // Find and update household
        const household = await db.HoKhau.findOne({
            where: { phongId: roomId }
        });

        if (household) {
            await household.update({ phongId: null });
        }

        // Update room status
        await room.update({ trangThai: 'Trống' });

        return await this.getRoomById(roomId);
    }

    /**
     * Get room statistics
     * Provides comprehensive room statistics for management dashboard
     */
    static async getRoomStatistics() {
        // Get total room count
        const totalRooms = await db.Phong.count();

        // Get room status statistics
        const statusStats = await db.Phong.findAll({
            attributes: [
                'trangThai',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['trangThai'],
            raw: true
        });

        // Get room type statistics
        const typeStats = await db.Phong.findAll({
            attributes: [
                'loaiPhong',
                [fn('COUNT', col('id')), 'count'],
                [fn('AVG', col('giaThue')), 'avgPrice']
            ],
            group: ['loaiPhong'],
            raw: true
        });

        // Get floor statistics
        const floorStats = await db.Phong.findAll({
            attributes: [
                'tang',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['tang'],
            order: [['tang', 'ASC']],
            raw: true
        });

        // Calculate occupancy rate
        const occupiedRooms = statusStats.find(stat => stat.trangThai === 'Đã thuê')?.count || 0;
        const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : 0;

        // Get average room size
        const avgRoomSize = await db.Phong.findAll({
            attributes: [
                [fn('AVG', col('dienTich')), 'avgSize']
            ],
            raw: true
        });

        return {
            totalRooms,
            occupancyRate: parseFloat(occupancyRate),
            statusBreakdown: statusStats.map(stat => ({
                status: stat.trangThai,
                count: parseInt(stat.count)
            })),
            typeBreakdown: typeStats.map(stat => ({
                type: stat.loaiPhong,
                count: parseInt(stat.count),
                avgPrice: parseFloat(stat.avgPrice || 0)
            })),
            floorBreakdown: floorStats.map(stat => ({
                floor: parseInt(stat.tang),
                count: parseInt(stat.count)
            })),
            averageRoomSize: parseFloat(avgRoomSize[0]?.avgSize || 0)
        };
    }

    /**
     * Get available rooms for assignment
     */
    static async getAvailableRooms() {
        const availableRooms = await db.Phong.findAll({
            where: {
                trangThai: 'Trống'
            },
            attributes: ['id', 'soPhong', 'tang', 'loaiPhong', 'dienTich', 'giaThue'],
            order: [['soPhong', 'ASC']]
        });

        return availableRooms;
    }

    /**
     * Get households without assigned rooms
     */
    static async getUnassignedHouseholds() {
        const unassignedHouseholds = await db.HoKhau.findAll({
            where: {
                phongId: null
            },
            attributes: ['soHoKhau', 'soNha', 'duong', 'phuong', 'quan'],
            include: [
                {
                    model: db.NhanKhau,
                    as: 'chuHoInfo',
                    attributes: ['hoTen', 'cccd']
                }
            ],
            order: [['soHoKhau', 'ASC']]
        });

        return unassignedHouseholds;
    }
}

module.exports = RoomService;