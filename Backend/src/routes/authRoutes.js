// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route Đăng nhập (Public - Ai cũng gọi được để lấy Token)
router.post('/login', authController.login);

// Route lấy thông tin User hiện tại (Protected - Cần truyền Token)
router.get('/me', verifyToken, authController.getMe);

module.exports = router;