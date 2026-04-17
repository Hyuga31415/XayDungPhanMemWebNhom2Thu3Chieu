const service = require('../services/leaveService');

// 🟢 Tạo đơn
exports.createLeave = async (req, res) => {
    try {
        await service.createLeave(req.body);
        res.json({ message: "Tạo đơn thành công" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// ✅ Duyệt
exports.approve = async (req, res) => {
    try {
        await service.approve(req.params.id, req.body.manager_id);
        res.json({ message: "Đã duyệt đơn" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// ❌ Từ chối
exports.reject = async (req, res) => {
    try {
        await service.reject(req.params.id);
        res.json({ message: "Đã từ chối đơn" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};