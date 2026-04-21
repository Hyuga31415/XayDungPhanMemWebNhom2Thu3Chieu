const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceController');

router.post('/check-in', controller.checkIn);
router.post('/check-out', controller.checkOut);

router.get('/history/:emp_id', controller.getHistory);
router.get('/summary/:emp_id', controller.getSummary);

module.exports = router;