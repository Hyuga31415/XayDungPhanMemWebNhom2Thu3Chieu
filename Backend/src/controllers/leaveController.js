const service = require('../services/leaveService');

// 📄 Danh sách đơn nghỉ (role-based)
exports.getLeaves = async (req, res) => {
    try {
        const data = await service.getLeaves(req.user);
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// 🟢 Tạo đơn
exports.createLeave = async (req, res) => {
    try {
        const { leave_type, start_date, end_date } = req.body;
        await service.createLeave({
            emp_id: req.user.emp_id,
            leave_type,
            start_date,
            end_date
        });
        res.json({ message: "Tạo đơn thành công" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// ✅ Duyệt
exports.approve = async (req, res) => {
    try {
        await service.approve(req.params.id, req.user.emp_id);
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