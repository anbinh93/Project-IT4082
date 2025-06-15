const express = require('express');
const router = express.Router();
const dotThuController = require('../controllers/dotThuController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all fee collection periods
router.get('/', dotThuController.getAllDotThu);

// Get all fee collection periods with their fee items (for tab-based view)
router.get('/with-khoan-thu', dotThuController.getAllDotThuWithKhoanThu);

// Get fee collection statistics
router.get('/statistics', dotThuController.getDotThuStatistics);

// Get payment info for a household in a specific fee collection period
router.get('/:dotThuId/payment-info/:hoKhauId', dotThuController.getPaymentInfo);

// Get payment statistics for a fee collection period
router.get('/:dotThuId/payment-statistics', dotThuController.getPaymentStatistics);

// Record payment for a household
router.post('/record-payment', dotThuController.recordPayment);

// Get fee collection period by ID
router.get('/:id', dotThuController.getDotThuById);

// Create new fee collection period
router.post('/', dotThuController.createDotThu);

// Update fee collection period
router.put('/:id', dotThuController.updateDotThu);

// Delete fee collection period
router.delete('/:id', dotThuController.deleteDotThu);

module.exports = router;
