const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountantController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// router.use(verifyToken); // Xác thực token cho tất cả các route
// router.use(verifyRole(['accountant']));

// Routes quản lý đợt thu
router.get('/dotthu', accountantController.getDotThu);
router.post('/dotthu', accountantController.createDotThu);
router.put('/dotthu/:id', accountantController.updateDotThu);
router.delete('/dotthu/:id', accountantController.deleteDotThu);

// Routes quản lý khoản thu
router.get('/khoanthu', accountantController.getKhoanThu);
router.get('/khoanthu/:id', accountantController.getKhoanThuById);
router.post('/khoanthu', accountantController.createKhoanThu);
router.put('/khoanthu/:id', accountantController.updateKhoanThu);
router.delete('/khoanthu/:id', accountantController.deleteKhoanThu);

// Route xác nhận thanh toán
router.post('/nopphi', accountantController.confirmPayment);

// Routes lấy thông tin chưa nộp phí
router.get('/chuanop/khoanthu/:khoanthu_id', accountantController.getChuaNopPhi);
router.get('/chuanop/hokhau/:hokhau_id', accountantController.getKhoanThuChuaNop);

router.get('/households', accountantController.getAllHouseholds);

module.exports = router;