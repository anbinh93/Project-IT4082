const express = require('express');
const router = express.Router();
const householdFeeController = require('../controllers/householdFeeController');

// Lấy dashboard khoản thu theo đợt thu
router.get('/dashboard/:dotThuId', householdFeeController.getDashboardByDotThu);

// Lấy danh sách khoản thu theo đợt thu
router.get('/dot-thu/:dotThuId', householdFeeController.getHouseholdFeesByDotThu);

// Lấy danh sách hộ gia đình theo khoản thu cụ thể
router.get('/dot-thu/:dotThuId/khoan-thu/:khoanThuId/households', householdFeeController.getHouseholdsByKhoanThu);

// Lấy tất cả khoản thu của hộ khẩu trong đợt thu (for NopNhanh popup)
router.get('/ho-khau/:hoKhauId/dot-thu/:dotThuId', householdFeeController.getHouseholdFeesByHousehold);

// Cập nhật trạng thái thanh toán
router.put('/:id/payment', householdFeeController.updatePaymentStatus);

// Tính lại phí cho hộ gia đình cụ thể
router.put('/recalculate/:dotThuId/:hoKhauId/:khoanThuId', householdFeeController.recalculateFeeForHousehold);

module.exports = router;
