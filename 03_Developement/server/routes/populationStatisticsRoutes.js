const express = require('express');
const router = express.Router();
const populationStatisticsController = require('../controllers/populationStatisticsController');
const { verifyToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Middleware cho tất cả các routes
router.use(verifyToken);
router.use(checkRole(['admin', 'manager', 'accountant']));

/**
 * Population Statistics Routes
 * Base path: /api/statistics/population
 * Actor: Ban Quản Trị (BQT)
 */

// Routes cho thống kê nhân khẩu
router.get('/overview', populationStatisticsController.getPopulationOverview);
router.get('/gender', populationStatisticsController.getGenderStatistics);
router.get('/age', populationStatisticsController.getAgeStatistics);
router.get('/movement', populationStatisticsController.getPopulationMovement);
router.get('/temporary-status', populationStatisticsController.getTemporaryStatusStatistics);

// Route cho thêm dữ liệu biến động nhân khẩu
router.post('/movement', populationStatisticsController.addPopulationMovement);

module.exports = router; 