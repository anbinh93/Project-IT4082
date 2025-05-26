const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Middleware để verify token và role cho tất cả routes
router.use(verifyToken);
router.use(verifyRole(['accountant']));


router.post('/', paymentController.createPayment);

// GET /api/payments
// Query params: householdId, feeTypeId, startDate, endDate, paymentMethod, page, size, sortBy, sortDir
router.get('/', paymentController.getPayments);


router.get('/statistics', paymentController.getPaymentStatistics);

router.get('/:paymentId', paymentController.getPaymentById);


router.put('/:paymentId', paymentController.updatePayment);

router.delete('/:paymentId', paymentController.deletePayment);

router.post('/:paymentId/restore', paymentController.restorePayment);

module.exports = router; 