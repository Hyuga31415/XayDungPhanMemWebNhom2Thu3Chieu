const payrollService = require('../services/payrollService');

const runPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        const executedByAdminId = 1; // Tạm thời để 1, sau này lấy từ token người dùng

        if (!month || !year) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tháng và năm!' });
        }

        const result = await payrollService.runPayroll(month, year, executedByAdminId);
        res.status(200).json({
            message: 'Chốt bảng lương thành công!',
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { runPayroll };
