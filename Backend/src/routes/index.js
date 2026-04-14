// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import các Module Routes
const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');
const payrollRoutes = require('./payrollRoutes');

// Cần lấy getPositions ra ngoài nếu bạn muốn nó thành public API cho Dropdown
const { getPositions } = require('../controllers/employeeController');

// ============================================================
// GẮN CÁC MODULE ROUTES
// ============================================================

// 1. Module Xác thực (Login, Get Me...)
// Tất cả request bắt đầu bằng /auth sẽ đi vào authRoutes
router.use('/auth', authRoutes);

// 2. Module dùng chung không cần đăng nhập
router.get('/positions', getPositions);

// 3. Các Module Protected (Bên trong 2 file routes này đã tự gọi verifyToken)
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);

router.use('/payroll', payrollRoutes);

module.exports = router;