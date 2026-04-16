const payrollService = require('../services/payrollService');

const runPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        const result = await payrollService.runPayroll(month, year);
        res.status(200).json({ message: "Tính lương thành công!", data: result });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tính lương", error: error.message });
    }
};

module.exports = { runPayroll };
