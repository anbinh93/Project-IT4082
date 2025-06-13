const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountantController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Routes quản lý khoản thu
router.get('/khoanthu', verifyToken, verifyRole(['accountant']), accountantController.getKhoanThu);
router.get('/khoanthu/:id', verifyToken, verifyRole(['accountant']), accountantController.getKhoanThuById);
router.post('/khoanthu', verifyToken, verifyRole(['accountant']), accountantController.createKhoanThu);
router.put('/khoanthu/:id', verifyToken, verifyRole(['accountant']), accountantController.updateKhoanThu);
router.delete('/khoanthu/:id', verifyToken, verifyRole(['accountant']), accountantController.deleteKhoanThu);

// Route xác nhận thanh toán
router.post('/nopphi', verifyToken, verifyRole(['accountant']), accountantController.confirmPayment);

// Routes lấy thông tin chưa nộp phí
router.get('/chuanop/khoanthu/:khoanthu_id', verifyToken, verifyRole(['accountant']), accountantController.getChuaNopPhi);
router.get('/chuanop/hokhau/:hokhau_id', verifyToken, verifyRole(['accountant']), accountantController.getKhoanThuChuaNop);

module.exports = router;
