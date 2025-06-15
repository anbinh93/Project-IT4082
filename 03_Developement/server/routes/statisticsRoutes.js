const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(verifyRole(['manager', 'accountant'])); // Chỉ kế toán và tổ trưởng

// API thống kê cơ bản
router.get('/overview', statisticsController.getStatisticsOverview);

module.exports = router; 