const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendance.controller');

router.post('/check-in', controller.checkIn);
router.post('/check-out', controller.checkOut);
router.get('/:emp_id', controller.getHistory);

module.exports = router;