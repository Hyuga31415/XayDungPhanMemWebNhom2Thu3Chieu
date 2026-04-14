const payrollService = require('../services/payrollService');

const runPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        const executedByAdminId = req.user.id; 

        if (!month || !year) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tháng và năm!' });
        }

        const result = await payrollService.runPayroll(month, year, executedByAdminId);
        
        res.status(200).json({
            message: `Chốt bảng lương tháng ${month}/${year} thành công!`,
            data: result
        });
    } catch (error) {
        console.error('Lỗi Run Payroll:', error);
        if (error.message === 'ALREADY_RUN') {
            return res.status(400).json({ message: 'Tháng này đã được chốt lương, không thể chạy lại!' });
        }
        res.status(500).json({ message: 'Lỗi hệ thống khi chốt lương.', error: error.message });
    }
};

const getAllPayrolls = async (req, res) => {
    try {
        const result = await payrollService.getAllPayrolls();
        res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi Get Payrolls:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách lương.' });
    }
};

module.exports = { runPayroll, getAllPayrolls };