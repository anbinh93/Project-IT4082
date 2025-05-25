const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken,  redirectIfAuthenticated } = require("../middlewares/authMiddleware");

router.post('/register', authController.register);
router.post('/login', redirectIfAuthenticated, authController.login);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;