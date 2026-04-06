const payrollService = require('../services/payrollService');

const executePayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        // Tạm thời gán adminId = 1 nếu chưa tích hợp xác thực token
        const adminId = req.user?.id || 1; 

        if (!month || !year) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp month và year.' });
        }

        const result = await payrollService.runPayroll(month, year, adminId);
        
        return res.status(200).json({
            success: true,
            message: `Chốt bảng lương tháng ${month}/${year} thành công!`,
            data: result
        });

    } catch (error) {
        console.error('Lỗi tính lương:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { executePayroll };
