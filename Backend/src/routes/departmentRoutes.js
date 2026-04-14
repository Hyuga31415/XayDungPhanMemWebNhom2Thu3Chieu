// src/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/rbac');

// Bắt buộc đăng nhập
router.use(verifyToken);

// ============================================================
// CÁC ROUTES MODULE PHÒNG BAN
// ============================================================

// Ai cũng có thể xem danh sách và chi tiết phòng ban
router.get('/', permit('department:read'), departmentController.getAllDepartments);
router.get('/:id', permit('department:read'), departmentController.getDepartmentById);

// Chỉ Admin mới được quản lý (Thêm/Sửa/Xóa) phòng ban (Theo file DOCX)
router.post('/', permit('department:write'), departmentController.createDepartment);
router.put('/:id', permit('department:write'), departmentController.updateDepartment);
router.delete('/:id', permit('department:write'), departmentController.deleteDepartment);

module.exports = router;