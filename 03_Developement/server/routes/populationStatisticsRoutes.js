const express = require('express');
const router = express.Router();
const populationStatisticsController = require('../controllers/populationStatisticsController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Enable auth for production
router.use(verifyToken);
// router.use(verifyRole(['manager', 'accountant'])); // Chỉ kế toán và tổ trưởng

// Population statistics routes
router.get('/overview', populationStatisticsController.getPopulationOverview);
router.get('/gender', populationStatisticsController.getGenderStatistics);
router.get('/age', populationStatisticsController.getAgeStatistics);
router.get('/movement', populationStatisticsController.getPopulationMovement);
router.get('/temporary-status', populationStatisticsController.getTemporaryStatusStatistics);

module.exports = router;
