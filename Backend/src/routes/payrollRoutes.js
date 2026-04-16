const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

// Đường dẫn: POST http://localhost:5000/api/payroll/run
router.post('/run', payrollController.runPayroll);

module.exports = router;
