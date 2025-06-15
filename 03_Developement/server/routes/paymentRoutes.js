const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Middleware để verify token và role cho tất cả routes
router.use(verifyToken);
router.use(verifyRole(['accountant']));

// POST /api/payments - Tạo khoản nộp phí mới
router.post('/', paymentController.createPayment);

// GET /api/payments - Lấy danh sách khoản nộp phí
// Query params: householdId, feeTypeId, startDate, endDate, paymentMethod, page, size, sortBy, sortDir
router.get('/', paymentController.getPayments);

// GET /api/payments/statistics - Thống kê thanh toán
router.get('/statistics', paymentController.getPaymentStatistics);

// GET /api/payments/:paymentId - Lấy chi tiết khoản nộp phí
router.get('/:paymentId', paymentController.getPaymentById);

// PUT /api/payments/:paymentId - Cập nhật khoản nộp phí
router.put('/:paymentId', paymentController.updatePayment);

// DELETE /api/payments/:paymentId - Xóa khoản nộp phí (soft delete)
router.delete('/:paymentId', paymentController.deletePayment);

// POST /api/payments/:paymentId/restore - Khôi phục khoản nộp phí đã xóa
router.post('/:paymentId/restore', paymentController.restorePayment);

module.exports = router;
