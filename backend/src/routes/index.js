const express = require('express');
const router = express.Router();
const payrollRoutes = require('./payrollRoutes');

// Khai báo các module khác ở đây nếu có (employees, departments...)
router.use('/payroll', payrollRoutes);

module.exports = router;
