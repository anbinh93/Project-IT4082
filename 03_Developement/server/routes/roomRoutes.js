const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Middleware xác thực cho tất cả routes
router.use(verifyToken);

// Routes cho quản lý phòng
// GET /api/rooms - Lấy danh sách phòng (có phân trang và tìm kiếm)
router.get('/', roomController.getAllRooms);

// GET /api/rooms/available - Lấy danh sách phòng trống
router.get('/available', roomController.getAvailableRooms);

// GET /api/rooms/statistics - Thống kê phòng
router.get('/statistics', verifyRole(['admin', 'to_truong']), roomController.getRoomStatistics);

// GET /api/rooms/:id - Lấy thông tin một phòng
router.get('/:id', roomController.getRoomById);

// POST /api/rooms - Thêm phòng mới
router.post('/', verifyRole(['admin', 'to_truong']), roomController.createRoom);

// PUT /api/rooms/:id - Cập nhật thông tin phòng
router.put('/:id', verifyRole(['admin', 'to_truong']), roomController.updateRoom);

// DELETE /api/rooms/:id - Xóa phòng
router.delete('/:id', verifyRole(['admin']), roomController.deleteRoom);

// POST /api/rooms/:id/assign - Gán phòng cho hộ khẩu
router.post('/:id/assign', verifyRole(['admin', 'to_truong']), roomController.assignRoomToHousehold);

// POST /api/rooms/:id/unassign - Hủy thuê phòng
router.post('/:id/unassign', verifyRole(['admin', 'to_truong']), roomController.unassignRoomFromHousehold);

module.exports = router;
