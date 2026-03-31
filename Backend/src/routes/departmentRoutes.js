// src/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
// const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// // Áp dụng middleware xác thực token cho mọi request vào /api/v1/departments
// router.use(verifyToken);

// // ============================================================
// // CÁC ROUTES CƠ BẢN (Ai cũng xem được danh sách phòng ban)
// // ============================================================
// router.get('/', departmentController.getAllDepartments);
// router.get('/:id', departmentController.getDepartmentById);

// // ============================================================
// // CÁC ROUTES QUẢN TRỊ (Chỉ Admin và HR được quản lý phòng ban)
// // ============================================================
// router.post('/', requireRole(['Admin', 'HR']), departmentController.createDepartment);
// router.put('/:id', requireRole(['Admin', 'HR']), departmentController.updateDepartment);

// // Xóa phòng ban là thao tác nhạy cảm, có thể chỉ cho Admin làm (tùy nghiệp vụ của bạn)
// // Ở đây tôi đang để cả HR cũng có thể xóa
// router.delete('/:id', requireRole(['Admin', 'HR']), departmentController.deleteDepartment);

router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;


