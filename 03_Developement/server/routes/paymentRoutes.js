// filepath: /server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Payment management routes
router.post('/', verifyToken, paymentController.createPayment);
router.get('/', verifyToken, paymentController.getPayments);
router.get('/:id', verifyToken, paymentController.getPaymentById);
router.put('/:id', verifyToken, paymentController.updatePayment);
router.delete('/:id', verifyToken, paymentController.deletePayment);

// Statistics and reporting routes
router.get('/statistics/summary', verifyToken, paymentController.getPaymentStatistics);

module.exports = router;
