const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');

// Get all residents
router.get('/', residentController.getAllResidents);

// Get available residents (not assigned to any household)
router.get('/available', residentController.getAvailableResidents);

// Get household change history
router.get('/household-changes', residentController.getHouseholdChangeHistory);

// Get resident household info for separation
router.get('/:id/household-info', residentController.getResidentHouseholdInfo);

// Get resident by ID
router.get('/:id', residentController.getResidentById);

// Create new resident
router.post('/', residentController.createResident);

// Update resident information
router.put('/:id', residentController.updateResident);

// Delete resident
router.delete('/:id', residentController.deleteResident);

// Add resident to household
router.post('/add-to-household', residentController.addToHousehold);

// Separate household - move resident to different household
router.post('/separate-household', residentController.separateHousehold);

module.exports = router;