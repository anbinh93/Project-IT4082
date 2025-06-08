const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Middleware xác thực cho tất cả routes
router.use(verifyToken);

// Routes cho quản lý xe
// GET /api/vehicles - Lấy danh sách xe (có phân trang và tìm kiếm)
router.get('/', vehicleController.getAllVehicles);

// GET /api/vehicles/types - Lấy danh sách loại xe
router.get('/types', vehicleController.getVehicleTypes);

// GET /api/vehicles/management - Lấy danh sách quản lý xe
router.get('/management', vehicleController.getVehicleManagement);

// GET /api/vehicles/statistics - Thống kê xe
router.get('/statistics', verifyRole(['admin', 'to_truong']), vehicleController.getVehicleStatistics);

// GET /api/vehicles/:id - Lấy thông tin một xe
router.get('/:id', vehicleController.getVehicleById);

// POST /api/vehicles - Thêm xe mới
router.post('/', verifyRole(['admin', 'to_truong']), vehicleController.createVehicle);

// PUT /api/vehicles/:id - Cập nhật thông tin xe
router.put('/:id', verifyRole(['admin', 'to_truong']), vehicleController.updateVehicle);

// DELETE /api/vehicles/:id - Xóa xe
router.delete('/:id', verifyRole(['admin']), vehicleController.deleteVehicle);

module.exports = router;
