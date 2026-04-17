const service = require('../services/attendanceService');

exports.checkIn = async (req, res) => {
    try {
        await service.checkIn(req.body.emp_id);
        res.json({ message: "Check-in thành công" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

exports.checkOut = async (req, res) => {
    try {
        await service.checkOut(req.body.emp_id);
        res.json({ message: "Check-out thành công" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const data = await service.getHistory(req.params.emp_id);
        res.json(data);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const data = await service.getSummary(req.params.emp_id);
        res.json(data);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};