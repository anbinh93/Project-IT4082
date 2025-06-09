const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Middleware xác thực cho tất cả routes
router.use(verifyToken);

// Routes cho quản lý loại xe
// GET /api/vehicles/types - Lấy danh sách loại xe
router.get('/types', vehicleController.getVehicleTypes);

// POST /api/vehicles/types - Tạo loại xe mới
router.post('/types', verifyRole(['admin', 'to_truong', 'to_pho']), vehicleController.createVehicleType);

// PUT /api/vehicles/types/:id - Cập nhật loại xe
router.put('/types/:id', verifyRole(['admin', 'to_truong', 'to_pho']), vehicleController.updateVehicleType);

// DELETE /api/vehicles/types/:id - Xóa loại xe
router.delete('/types/:id', verifyRole(['admin', 'to_truong']), vehicleController.deleteVehicleType);

// Routes cho thống kê
// GET /api/vehicles/statistics - Thống kê xe
router.get('/statistics', verifyRole(['admin', 'to_truong', 'to_pho']), vehicleController.getVehicleStatistics);

// Routes cho quản lý xe theo hộ khẩu
// GET /api/vehicles/household/:hoKhauId - Lấy xe theo hộ khẩu
router.get('/household/:hoKhauId', vehicleController.getVehiclesByHousehold);

// Routes cho quản lý xe
// GET /api/vehicles - Lấy danh sách xe (có phân trang và tìm kiếm)
router.get('/', vehicleController.getAllVehicles);

// POST /api/vehicles - Thêm xe mới
router.post('/', verifyRole(['admin', 'to_truong', 'to_pho']), vehicleController.createVehicle);

// PUT /api/vehicles/:id - Cập nhật thông tin xe
router.put('/:id', verifyRole(['admin', 'to_truong', 'to_pho']), vehicleController.updateVehicle);

// DELETE /api/vehicles/:id - Xóa xe
router.delete('/:id', verifyRole(['admin', 'to_truong']), vehicleController.deleteVehicle);

module.exports = router;
