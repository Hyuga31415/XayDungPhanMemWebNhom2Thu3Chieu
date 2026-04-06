const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

// API chốt lương: POST /api/payroll/run
router.post('/run', payrollController.runPayroll);

module.exports = router;
