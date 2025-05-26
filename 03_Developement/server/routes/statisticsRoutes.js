const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const populationRoutes = require('./populationStatisticsRoutes');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(verifyRole(['admin', 'manager', 'accountant'])); // BQT có thể có nhiều roles


router.get('/overview', statisticsController.getStatisticsOverview);


router.get('/reports', statisticsController.getAvailableReports);

router.use('/population', populationRoutes);

// router.get('/fee-collection/summary', feeCollectionController.getSummary);
// router.get('/fee-collection/detailed', feeCollectionController.getDetailed);
// router.get('/households/distribution', householdsController.getDistribution);

module.exports = router; 