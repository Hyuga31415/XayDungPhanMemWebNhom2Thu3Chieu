const payrollService = require('../services/payrollService');

const runPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        const executedByAdminId = req.user.id; 

        if (!month || !year) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tháng và năm!' });
        }

        const result = await payrollService.runPayroll(month, year, executedByAdminId);
        res.status(200).json({ message: `Chốt bảng lương tháng ${month}/${year} thành công!`, data: result });
    } catch (error) {
        if (error.message === 'ALREADY_RUN') return res.status(400).json({ message: 'Tháng này đã được chốt lương, không thể chạy lại!' });
        res.status(500).json({ message: 'Lỗi hệ thống khi chốt lương.', error: error.message });
    }
};

const getAllPayrolls = async (req, res) => {
    try {
        const result = await payrollService.getAllPayrolls();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách lương.' });
    }
};

const getPayrollHistory = async (req, res) => {
    try {
        const result = await payrollService.getPayrollHistory(req.user);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy lịch sử lương.' });
    }
};

const getPayrollDetail = async (req, res) => {
    try {
        const recordId = req.params.id;
        const result = await payrollService.getPayrollDetail(recordId, req.user);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Không tìm thấy phiếu lương này.' });
        if (error.message === 'FORBIDDEN') return res.status(403).json({ message: 'Bạn không có quyền xem phiếu lương của người khác.' });
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết lương.' });
    }
};

module.exports = { runPayroll, getAllPayrolls, getPayrollHistory, getPayrollDetail };