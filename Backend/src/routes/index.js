// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import Controllers & Middlewares
const { login } = require('../controllers/authController');
// const { verifyToken } = require('../middlewares/authMiddleware');
const { getPositions } = require('../controllers/employeeController');

// Import các Module Routes
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');

// ============================================================
// PUBLIC ROUTES (Không cần đăng nhập)
// ============================================================
router.post('/auth/login', login);

// ============================================================
// PROTECTED ROUTES (Cần đăng nhập & Phân quyền)
// ============================================================
// API lấy danh sách chức vụ (Frontend gọi độc lập tới /positions)
// router.get('/positions', verifyToken, getPositions);
router.get('/positions', getPositions);

// Gắn toàn bộ employeeRoutes vào tiền tố /employees
router.use('/employees', employeeRoutes);
// Gắn toàn bộ departmentRoutes vào tiền tố /departments
router.use('/departments', departmentRoutes);

module.exports = router;