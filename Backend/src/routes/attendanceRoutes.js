const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { permit, ownOnly } = require('../middlewares/rbac');

router.use(verifyToken);

router.post('/check-in', permit('attendance:checkin'), ownOnly((req) => req.body.emp_id), controller.checkIn);
router.post('/check-out', permit('attendance:checkin'), ownOnly((req) => req.body.emp_id), controller.checkOut);

router.get('/history/:emp_id', permit('attendance:read'), ownOnly((req) => req.params.emp_id), controller.getHistory);
router.get('/summary/:emp_id', permit('attendance:read'), ownOnly((req) => req.params.emp_id), controller.getSummary);

module.exports = router;