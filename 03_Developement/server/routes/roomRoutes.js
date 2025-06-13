const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Get all rooms with optional filters and pagination
router.get('/', verifyToken, roomController.getAllRooms);

// Get room statistics
router.get('/statistics', verifyToken, roomController.getRoomStatistics);

// Get a specific room by ID
router.get('/:id', verifyToken, roomController.getRoomById);

// Create a new room
router.post('/', verifyToken, roomController.createRoom);

// Update room information
router.put('/:id', verifyToken, roomController.updateRoom);

// Delete a room
router.delete('/:id', verifyToken, roomController.deleteRoom);

// Assign a room to a household
router.post('/:id/assign', verifyToken, roomController.assignRoom);

// Release a room from a household
router.post('/:id/release', verifyToken, roomController.releaseRoom);

// Update tenant information for a room
router.put('/:id/tenant', verifyToken, roomController.updateTenant);

module.exports = router;
