const pool = require('../config/db');
const {
    getEmployeeJobHistoryByEmpId,
    insertEmployeeJobHistory,
    getEmployeeContractsByEmpId
} = require('../services/enterpriseDataService');

// ============================================================
// 1. LẤY DANH SÁCH NHÂN VIÊN (Có phân trang, tìm kiếm, lọc)
// ============================================================
const getAllEmployees = async (req, res) => {
    try {
        const { search, departmentId, status, page = 1, limit = 8 } = req.query;
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const limitNum = parseInt(limit, 10);

        const queryParams = [];
        const countParams = [];

        let baseQuery = `
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            LEFT JOIN employee_contracts ec
                ON ec.emp_id = e.id
                AND ec.status = 'Active'
                AND ec.start_date <= CURDATE()
                AND (ec.end_date IS NULL OR ec.end_date >= CURDATE())
            WHERE 1=1
        `;

        // Nếu là Staff, ép buộc chỉ được lấy dữ liệu của chính mình
        if (req.user.role === 'Staff') {
            baseQuery += ` AND e.id = ?`;
            queryParams.push(req.user.emp_id);
            countParams.push(req.user.emp_id);
        }

        // Lọc theo từ khóa tìm kiếm
        if (search) {
            baseQuery += ` AND (e.full_name LIKE ? OR e.emp_code LIKE ? OR e.email LIKE ?)`;
            const searchStr = `%${search}%`;
            queryParams.push(searchStr, searchStr, searchStr);
            countParams.push(searchStr, searchStr, searchStr);
        }

        // Lọc theo phòng ban
        if (departmentId) {
            baseQuery += ` AND e.department_id = ?`;
            queryParams.push(parseInt(departmentId, 10));
            countParams.push(parseInt(departmentId, 10));
        }

        // Lọc theo trạng thái
        if (status) {
            baseQuery += ` AND e.status = ?`;
            queryParams.push(status);
            countParams.push(status);
        }

        const countQuery = `SELECT COUNT(DISTINCT e.id) as total ` + baseQuery;
        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitNum) || 1;

        const dataQuery = `
            SELECT
                e.id, e.emp_code, e.full_name, e.email, e.gender, e.department_id, e.position_id, e.status,
                DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date,
                e.full_name AS fullName,
                d.name AS departmentName,
                p.title AS position,
                ec.base_salary,
                'NA' AS avatar
            ${baseQuery}
            GROUP BY e.id
            ORDER BY e.id DESC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(limitNum, offset);
        const [data] = await pool.query(dataQuery, queryParams);

        res.status(200).json({ data, total, page: parseInt(page, 10), totalPages });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu.' });
    }
};

// ============================================================
// 2. LẤY CHI TIẾT 1 NHÂN VIÊN
// ============================================================
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT
                e.id,
                e.emp_code,
                e.full_name,
                e.email,
                e.gender,
                e.department_id,
                e.position_id,
                e.status,
                DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date,
                e.full_name AS fullName,
                d.name AS departmentName,
                p.title AS position,
                ec.base_salary,
                'NA' AS avatar
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            LEFT JOIN employee_contracts ec
                ON ec.emp_id = e.id
                AND ec.status = 'Active'
                AND ec.start_date <= CURDATE()
                AND (ec.end_date IS NULL OR ec.end_date >= CURDATE())
            WHERE e.id = ?
            ORDER BY ec.start_date DESC
            LIMIT 1
        `;

        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Lỗi lấy chi tiết nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 3. THÊM NHÂN VIÊN MỚI
// ============================================================
const createEmployee = async (req, res) => {
    try {
        const { fullName, email, gender, department_id, position_id, hire_date, status = 'Active' } = req.body;

        const [maxIdResult] = await pool.query('SELECT MAX(id) as maxId FROM employees');
        const nextId = (maxIdResult[0].maxId || 0) + 1;
        const emp_code = `EMP${String(nextId).padStart(3, '0')}`;

        const insertQuery = `
            INSERT INTO employees (emp_code, full_name, email, gender, department_id, position_id, hire_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(insertQuery, [
            emp_code, fullName, email, gender, department_id, position_id, hire_date, status
        ]);

        res.status(201).json({
            message: 'Thêm nhân viên thành công',
            id: result.insertId,
            emp_code
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(422).json({ message: 'Email này đã tồn tại trong hệ thống.' });
        }
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 4. CẬP NHẬT NHÂN VIÊN + GHI LỊCH SỬ CÔNG TÁC
// ============================================================
const updateEmployee = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        const { fullName, email, gender, department_id, position_id, hire_date, status, change_reason } = req.body;

        await connection.beginTransaction();

        const [currentRows] = await connection.query(`
            SELECT id, department_id, position_id
            FROM employees
            WHERE id = ?
            LIMIT 1
        `, [id]);

        if (currentRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật.' });
        }

        const current = currentRows[0];

        const [result] = await connection.query(`
            UPDATE employees
            SET full_name = ?, email = ?, gender = ?, department_id = ?, position_id = ?, hire_date = ?, status = ?
            WHERE id = ?
        `, [
            fullName, email, gender, department_id, position_id, hire_date, status, id
        ]);

        const deptChanged = Number(current.department_id) !== Number(department_id);
        const positionChanged = Number(current.position_id) !== Number(position_id);

        if (deptChanged || positionChanged) {
            // Lưu vết biến động phòng ban/chức vụ để phục vụ truy vết thăng chức, điều chuyển.
            await insertEmployeeJobHistory(connection, {
                emp_id: Number(id),
                old_department_id: current.department_id,
                new_department_id: Number(department_id),
                old_position_id: current.position_id,
                new_position_id: Number(position_id),
                effective_date: new Date().toLocaleDateString('en-CA'),
                reason: change_reason || 'Cập nhật thông tin nhân sự'
            });
        }

        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật.' });
        }

        res.status(200).json({ message: 'Cập nhật thành công', id });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    } finally {
        connection.release();
    }
};

// ============================================================
// 5. XÓA NHÂN VIÊN
// ============================================================
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa.' });
        }

        res.status(200).json({ success: true, message: 'Đã xóa nhân viên.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 6. LẤY THỐNG KÊ (Cho Dashboard)
// ============================================================
const getStats = async (req, res) => {
    try {
        const [
            [totalRes],
            [statusRes],
            [deptRes],
            [yearRes],
            [salaryRes],
            [genderRes]
        ] = await Promise.all([
            pool.query(`SELECT COUNT(*) as total FROM employees`),
            pool.query(`SELECT status, COUNT(*) as count FROM employees GROUP BY status`),
            pool.query(`
                SELECT REPLACE(REPLACE(d.name, 'Phòng ', ''), 'Ban ', '') as name, COUNT(e.id) as count
                FROM departments d
                LEFT JOIN employees e ON d.id = e.department_id
                GROUP BY d.id
            `),
            pool.query(`
                SELECT YEAR(hire_date) as year, COUNT(*) as count
                FROM employees
                GROUP BY YEAR(hire_date)
                ORDER BY year ASC
            `),
            pool.query(`
                SELECT
                    p.title,
                    COALESCE(AVG(ec.base_salary), 0) as salary,
                    COUNT(e.id) as count
                FROM positions p
                LEFT JOIN employees e ON p.id = e.position_id
                LEFT JOIN employee_contracts ec
                    ON ec.emp_id = e.id
                    AND ec.status = 'Active'
                    AND ec.start_date <= CURDATE()
                    AND (ec.end_date IS NULL OR ec.end_date >= CURDATE())
                GROUP BY p.id
            `),
            pool.query(`SELECT gender, COUNT(*) as count FROM employees GROUP BY gender`)
        ]);

        const total = totalRes[0].total;
        let active = 0;
        let resigned = 0;

        statusRes.forEach((row) => {
            if (row.status === 'Active') active = row.count;
            if (row.status === 'Resigned') resigned = row.count;
        });

        let maleCount = 0;
        let femaleCount = 0;
        genderRes.forEach((row) => {
            if (row.gender === 'male') maleCount = row.count;
            if (row.gender === 'female') femaleCount = row.count;
        });

        res.status(200).json({
            total,
            active,
            resigned,
            newThisMonth: 0,
            retentionRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0,
            byDepartment: deptRes,
            byGender: [
                { name: 'Nam', value: maleCount },
                { name: 'Nữ', value: femaleCount }
            ],
            recruitmentTrend: yearRes.map((y) => ({ month: y.year.toString(), count: y.count })),
            bySalary: salaryRes
        });

    } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu thống kê.' });
    }
};

// ============================================================
// 7. LẤY DANH SÁCH CHỨC VỤ (Positions)
// ============================================================
const getPositions = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM positions ORDER BY title ASC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 8. LẤY LỊCH SỬ CÔNG TÁC THEO NHÂN VIÊN
// ============================================================
const getJobHistory = async (req, res) => {
    try {
        const empId = Number(req.params.id);
        const rows = await getEmployeeJobHistoryByEmpId(empId);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy lịch sử công tác.', error: error.message });
    }
};

// ============================================================
// 9. LẤY DANH SÁCH HỢP ĐỒNG THEO NHÂN VIÊN
// ============================================================
const getContracts = async (req, res) => {
    try {
        const empId = Number(req.params.id);
        const rows = await getEmployeeContractsByEmpId(empId);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy hợp đồng.', error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getStats,
    getPositions,
    getJobHistory,
    getContracts
};
