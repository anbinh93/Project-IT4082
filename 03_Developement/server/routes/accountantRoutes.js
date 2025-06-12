// filepath: /server/routes/accountantRoutes.js
const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountantController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Khoản thu (Fee management) routes
router.get('/khoanthu', verifyToken, accountantController.getKhoanThu);
router.get('/khoanthu/:id', verifyToken, accountantController.getKhoanThuById);
router.post('/khoanthu', verifyToken, accountantController.createKhoanThu);
router.put('/khoanthu/:id', verifyToken, accountantController.updateKhoanThu);
router.delete('/khoanthu/:id', verifyToken, accountantController.deleteKhoanThu);

// Payment confirmation and tracking routes
router.post('/confirm-payment', verifyToken, accountantController.confirmPayment);
router.get('/chua-nop-phi', verifyToken, accountantController.getChuaNopPhi);
router.get('/khoanthu-chua-nop', verifyToken, accountantController.getKhoanThuChuaNop);

module.exports = router;
