const pool = require('../config/db');

// ============================================================
// 1. LẤY DANH SÁCH PHÒNG BAN (Kèm tên quản lý và số lượng nhân viên)
// ============================================================
const getAllDepartments = async (req, res) => {
    try {
        // Sử dụng 2 lần LEFT JOIN bảng employees:
        // - Lần 1 (m): Lấy thông tin người quản lý (manager)
        // - Lần 2 (e): Đếm số lượng nhân viên thuộc phòng ban
        const query = `
            SELECT 
                d.id, 
                d.name, 
                d.code, 
                d.description,
                d.manager_id AS managerId, /* Đồng bộ với Frontend */
                m.full_name AS managerName, 
                d.status,
                COUNT(e.id) AS employeeCount
            FROM departments d
            LEFT JOIN employees m ON d.manager_id = m.id
            LEFT JOIN employees e ON d.id = e.department_id
            GROUP BY d.id, d.name, d.code, d.description, d.manager_id, m.full_name, d.status
            ORDER BY d.id ASC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng ban:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu phòng ban.' });
    }
};

// ============================================================
// 2. LẤY CHI TIẾT 1 PHÒNG BAN
// ============================================================
const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                d.id, 
                d.name, 
                d.code, 
                d.description,
                d.manager_id AS managerId, /* Đồng bộ với Frontend */
                m.full_name AS managerName, 
                d.status,
                COUNT(e.id) AS employeeCount
            FROM departments d
            LEFT JOIN employees m ON d.manager_id = m.id
            LEFT JOIN employees e ON d.id = e.department_id
            WHERE d.id = ?
            GROUP BY d.id
        `;
        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phòng ban.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 3. THÊM PHÒNG BAN MỚI
// ============================================================
const createDepartment = async (req, res) => {
    try {
        const { name, code, description, managerId, status = 1 } = req.body;

        if (!name || !code) {
            return res.status(400).json({ message: 'Tên và mã phòng ban không được để trống.' });
        }

        const validManagerId = managerId ? parseInt(managerId) : null;

        const insertQuery = `INSERT INTO departments (name, code, description, manager_id, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.query(insertQuery, [name, code, description, validManagerId, status]);

        res.status(201).json({ message: 'Thêm phòng ban thành công', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 4. CẬP NHẬT PHÒNG BAN (Bao gồm việc Gán/Thay đổi Trưởng phòng)
// ============================================================
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, description, managerId, status } = req.body;

        const validManagerId = managerId ? parseInt(managerId) : null;

        const updateQuery = `
            UPDATE departments 
            SET name = ?, code = ?, description = ?, manager_id = ?, status = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(updateQuery, [name, code, description, validManagerId, status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phòng ban để cập nhật.' });
        }

        res.status(200).json({ message: 'Cập nhật phòng ban thành công', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 5. XÓA PHÒNG BAN
// ============================================================
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM departments WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phòng ban để xóa.' });
        }

        // Nhờ khóa ngoại ON DELETE SET NULL bên bảng employees, các nhân viên thuộc phòng này 
        // sẽ tự động được set department_id = NULL chứ không bị xóa mất.
        res.status(200).json({ success: true, message: 'Đã xóa phòng ban.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};