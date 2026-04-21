const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaveController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/rbac');

router.use(verifyToken);

// 📄 Danh sách đơn nghỉ
router.get('/', permit('leave:request'), controller.getLeaves);

// 🟢 Tạo đơn nghỉ
router.post('/', permit('leave:request'), controller.createLeave);

// ✅ Duyệt đơn
router.put('/:id/approve', permit('leave:approve'), controller.approve);

// ❌ Từ chối
router.put('/:id/reject', permit('leave:approve'), controller.reject);

module.exports = router;