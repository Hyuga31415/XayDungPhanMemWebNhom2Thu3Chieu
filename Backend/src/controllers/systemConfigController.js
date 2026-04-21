const systemConfigService = require('../services/systemConfigService');

const getConfigs = async (req, res) => {
    try {
        const rows = await systemConfigService.getAllConfigs();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Loi server khi lay cau hinh he thong.', error: error.message });
    }
};

const updateConfigs = async (req, res) => {
    try {
        const items = req.body?.items;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Du lieu cap nhat khong hop le.' });
        }

        const result = await systemConfigService.updateConfigs(items, req.user?.emp_id || null);
        res.status(200).json({ message: 'Cap nhat cau hinh thanh cong.', ...result });
    } catch (error) {
        res.status(500).json({ message: 'Loi server khi cap nhat cau hinh he thong.', error: error.message });
    }
};

module.exports = {
    getConfigs,
    updateConfigs
};
