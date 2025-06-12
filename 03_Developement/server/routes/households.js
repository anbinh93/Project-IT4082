const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Get all households
router.get('/', verifyToken, householdController.getAllHouseholds);

// Get available households for separation
router.get('/available', verifyToken, householdController.getAvailableHouseholds);

// Assign head to household
router.post('/assign-head', verifyToken, householdController.assignHead);

// Get household by ID
router.get('/:id', verifyToken, householdController.getHouseholdById);

// Create new household
router.post('/', verifyToken, householdController.createHousehold);

// Update household
router.put('/:id', verifyToken, householdController.updateHousehold);

module.exports = router;
