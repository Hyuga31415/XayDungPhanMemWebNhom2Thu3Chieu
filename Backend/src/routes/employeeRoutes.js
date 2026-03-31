// src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
// const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// // ============================================================
// // ÁP DỤNG MIDDLEWARE CHO TOÀN BỘ ROUTER NÀY
// // Mọi request đi vào /api/v1/employees đều phải có token hợp lệ
// // ============================================================
// router.use(verifyToken);

// // ============================================================
// // CÁC ROUTES CƠ BẢN (Ai đăng nhập cũng xem được)
// // ============================================================
// // Xem danh sách nhân viên
// router.get('/', employeeController.getAllEmployees);

// // ============================================================
// // CÁC ROUTES QUẢN TRỊ (Chỉ Admin và HR được phép truy cập)
// // ============================================================
// // Thống kê Dashboard (Lưu ý quan trọng: Route tĩnh /stats phải đặt TRƯỚC route động /:id)
// router.get('/stats', requireRole(['Admin', 'HR']), employeeController.getStats);

// // Xem chi tiết 1 nhân viên (Đưa xuống dưới /stats)
// router.get('/:id', employeeController.getEmployeeById);

// // Thêm nhân viên mới
// router.post('/', requireRole(['Admin', 'HR']), employeeController.createEmployee);

// // Cập nhật thông tin nhân viên
// router.put('/:id', requireRole(['Admin', 'HR']), employeeController.updateEmployee);

// // Xóa nhân viên
// router.delete('/:id', requireRole(['Admin', 'HR']), employeeController.deleteEmployee);

router.get('/', employeeController.getAllEmployees);
router.get('/stats', employeeController.getStats); 
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee); 
router.put('/:id', employeeController.updateEmployee); 
router.delete('/:id', employeeController.deleteEmployee); 

module.exports = router;