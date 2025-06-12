const express = require('express');
const router = express.Router();
const canhoController = require('../controllers/canhoController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all apartments
router.get('/', canhoController.getAllCanho);

// Get apartment statistics
router.get('/statistics', canhoController.getCanhoStatistics);

// Assign household to apartment
router.post('/assign', canhoController.assignHoKhauToCanho);

// Get apartment by ID
router.get('/:id', canhoController.getCanhoById);

// Create new apartment
router.post('/', canhoController.createCanho);

// Update apartment
router.put('/:id', canhoController.updateCanho);

// Remove household from apartment
router.put('/:id/remove-hokhau', canhoController.removeHoKhauFromCanho);

// Delete apartment
router.delete('/:id', canhoController.deleteCanho);

module.exports = router;
