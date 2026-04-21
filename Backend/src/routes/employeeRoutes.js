// src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Import middleware xác thực token và middleware RBAC mới
const { verifyToken } = require('../middlewares/authMiddleware');
const { permit, ownOnly } = require('../middlewares/rbac');

// Bắt buộc đăng nhập cho toàn bộ route này
router.use(verifyToken);

// ============================================================
// CÁC ROUTES MODULE NHÂN SỰ
// ============================================================

// 1. Thống kê Dashboard & Analytics (Admin, HR)
// Lưu ý: Đặt route tĩnh /stats lên trước route động /:id
router.get('/stats', permit('analytics:read'), employeeController.getStats);

// 1.1. Tab chi tiết nhân viên: Lịch sử công tác và Hợp đồng
router.get('/:id/job-history', permit('employee:read'), ownOnly(req => req.params.id), employeeController.getJobHistory);
router.get('/:id/contracts', permit('employee:read'), ownOnly(req => req.params.id), employeeController.getContracts);

// 2. Lấy danh sách nhân viên 
// API này có phân trang, Staff có thể gọi nhưng Controller phải tự bắt req.user.role == 'Staff' 
// để đính kèm thêm `WHERE e.id = req.user.emp_id` vào câu SQL (xử lý ở tầng service/controller).
router.get('/', permit('employee:read'), employeeController.getAllEmployees);

// 3. Xem chi tiết 1 nhân viên
// Ai cũng được xem, NHƯNG Staff bị chặn bởi ownOnly nếu id trên URL khác với emp_id của họ
router.get('/:id', 
    permit('employee:read'), 
    ownOnly(req => req.params.id), 
    employeeController.getEmployeeById
);

// 4. Thêm nhân viên mới (Admin, HR)
router.post('/', permit('employee:write'), employeeController.createEmployee);

// 5. Cập nhật thông tin nhân viên (Admin, HR)
router.put('/:id', permit('employee:write'), employeeController.updateEmployee);

// 6. Xóa nhân viên (Chỉ Admin mới có quyền xóa - theo như file docx quy định)
router.delete('/:id', permit('employee:delete'), employeeController.deleteEmployee);

module.exports = router;