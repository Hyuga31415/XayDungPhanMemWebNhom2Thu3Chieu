const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

// API endpoint: POST /api/payroll/run
router.post('/run', payrollController.executePayroll);

module.exports = router;
