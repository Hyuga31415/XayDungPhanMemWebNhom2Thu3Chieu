const pool = require('../config/db');

// ============================================================
// 1. LẤY DANH SÁCH CHỨC VỤ
// ============================================================
const getAllPositions = async (req, res) => {
    try {
        const query = `
            SELECT
                p.id,
                p.title,
                p.created_at,
                COUNT(e.id) AS employeeCount
            FROM positions p
            LEFT JOIN employees e ON e.position_id = p.id
            GROUP BY p.id, p.title, p.created_at
            ORDER BY p.id ASC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Loi lay danh sach chuc vu:', error);
        res.status(500).json({ message: 'Loi server khi lay du lieu chuc vu.' });
    }
};

// ============================================================
// 2. LẤY CHI TIẾT 1 CHỨC VỤ
// ============================================================
const getPositionById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT
                p.id,
                p.title,
                p.created_at,
                COUNT(e.id) AS employeeCount
            FROM positions p
            LEFT JOIN employees e ON e.position_id = p.id
            WHERE p.id = ?
            GROUP BY p.id, p.title, p.created_at
        `;

        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Khong tim thay chuc vu.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Loi server.', error: error.message });
    }
};

// ============================================================
// 3. THÊM CHỨC VỤ MỚI
// ============================================================
const createPosition = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !String(title).trim()) {
            return res.status(400).json({ message: 'Ten chuc vu khong duoc de trong.' });
        }

        const [result] = await pool.query(
            'INSERT INTO positions (title) VALUES (?)',
            [String(title).trim()]
        );

        res.status(201).json({ message: 'Them chuc vu thanh cong', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Loi server.', error: error.message });
    }
};

// ============================================================
// 4. CẬP NHẬT CHỨC VỤ
// ============================================================
const updatePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title || !String(title).trim()) {
            return res.status(400).json({ message: 'Ten chuc vu khong duoc de trong.' });
        }

        const [result] = await pool.query(
            'UPDATE positions SET title = ? WHERE id = ?',
            [String(title).trim(), id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Khong tim thay chuc vu de cap nhat.' });
        }

        res.status(200).json({ message: 'Cap nhat chuc vu thanh cong', id });
    } catch (error) {
        res.status(500).json({ message: 'Loi server.', error: error.message });
    }
};

// ============================================================
// 5. XÓA CHỨC VỤ
// ============================================================
const deletePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM positions WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Khong tim thay chuc vu de xoa.' });
        }

        res.status(200).json({ success: true, message: 'Da xoa chuc vu.' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'Khong the xoa chuc vu dang duoc gan cho nhan vien.' });
        }
        res.status(500).json({ message: 'Loi server.', error: error.message });
    }
};

module.exports = {
    getAllPositions,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition
};
