const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/rbac');

// Áp dụng xác thực cho toàn bộ route lương
router.use(verifyToken);

// API chốt lương: Bắt buộc là Admin (quyền payroll:write) mới được chạy
router.post('/run', permit('payroll:write'), payrollController.runPayroll);

// API lấy toàn bộ danh sách (Quản lý lương)
router.get('/', permit('payroll:read'), payrollController.getAllPayrolls);

// API lấy lịch sử lương (Role nào trả về data nấy)
router.get('/history', permit('payroll:history:read'), payrollController.getPayrollHistory);

// API xem chi tiết 1 phiếu lương
router.get('/:id', permit('payroll:history:read'), payrollController.getPayrollDetail);

module.exports = router;