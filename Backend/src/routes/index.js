// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import các Module Routes
const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');
const positionRoutes = require('./positionRoutes');
const payrollRoutes = require('./payrollRoutes');
const systemConfigRoutes = require('./systemConfigRoutes');

const attendanceRoutes = require('./attendanceRoutes');
const leaveRoutes = require('./leaveRoutes');

// ============================================================
// PUBLIC ROUTES (Không cần đăng nhập)
// ============================================================
// ============================================================
// GẮN CÁC MODULE ROUTES
// ============================================================

// 1. Module Xác thực (Login, Get Me...)
// Tất cả request bắt đầu bằng /auth sẽ đi vào authRoutes
router.use('/auth', authRoutes);

// 2. Các Module Protected (Bên trong các file routes đã tự gọi verifyToken)
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/positions', positionRoutes);

// Gắn attendanceRoutes
router.use('/attendance', attendanceRoutes);
// Gắn leaveRoutes
router.use('/leave', leaveRoutes);
router.use('/payroll', payrollRoutes);
router.use('/system-configs', systemConfigRoutes);

module.exports = router;