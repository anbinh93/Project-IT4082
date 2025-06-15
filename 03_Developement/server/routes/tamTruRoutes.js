const express = require('express');
const router = express.Router();
const tamTruController = require('../controllers/tamTruController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all temporary residence records
router.get('/', tamTruController.getAllTamTru);

// Get temporary residence statistics
router.get('/statistics', tamTruController.getTamTruStatistics);

// Get temporary residence record by ID
router.get('/:id', tamTruController.getTamTruById);

// Create new temporary residence record
router.post('/', tamTruController.createTamTru);

// Update temporary residence record
router.put('/:id', tamTruController.updateTamTru);

// Delete temporary residence record
router.delete('/:id', tamTruController.deleteTamTru);

module.exports = router;
