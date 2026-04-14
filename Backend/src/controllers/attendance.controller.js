const service = require('../services/attendance.service');

exports.checkIn = async (req, res) => {
    try {
        const { emp_id } = req.body;
        await service.checkIn(emp_id);
        res.json({ message: "Check-in thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.checkOut = async (req, res) => {
    try {
        const { emp_id } = req.body;
        await service.checkOut(emp_id);
        res.json({ message: "Check-out thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const data = await service.getHistory(req.params.emp_id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};