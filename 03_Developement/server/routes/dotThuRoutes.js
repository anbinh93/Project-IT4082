const express = require('express');
const router = express.Router();
const dotThuController = require('../controllers/dotThuController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all fee collection periods
router.get('/', dotThuController.getAllDotThu);

// Get fee collection statistics
router.get('/statistics', dotThuController.getDotThuStatistics);

// Get fee collection period by ID
router.get('/:id', dotThuController.getDotThuById);

// Create new fee collection period
router.post('/', dotThuController.createDotThu);

// Update fee collection period
router.put('/:id', dotThuController.updateDotThu);

// Delete fee collection period
router.delete('/:id', dotThuController.deleteDotThu);

module.exports = router;
