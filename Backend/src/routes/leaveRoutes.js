const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaveController');

// 🟢 TEST API (rất nên có)
router.get('/', (req, res) => {
    res.json({ message: "Leave API is working" });
});

// 🟢 Tạo đơn nghỉ
router.post('/', controller.createLeave);

// ✅ Duyệt đơn
router.put('/:id/approve', controller.approve);

// ❌ Từ chối
router.put('/:id/reject', controller.reject);

module.exports = router;