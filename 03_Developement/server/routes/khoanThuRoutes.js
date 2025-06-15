const express = require('express');
const router = express.Router();
const khoanThuController = require('../controllers/khoanThuController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all KhoanThu
router.get('/', khoanThuController.getAllKhoanThu);

// Get KhoanThu by ID
router.get('/:id', khoanThuController.getKhoanThuById);

// Create new KhoanThu
router.post('/', khoanThuController.createKhoanThu);

// Update KhoanThu
router.put('/:id', khoanThuController.updateKhoanThu);

// Delete KhoanThu
router.delete('/:id', khoanThuController.deleteKhoanThu);

module.exports = router;
