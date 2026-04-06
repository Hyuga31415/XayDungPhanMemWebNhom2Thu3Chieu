const pool = require('../config/db');

// ============================================================
// 1. LẤY DANH SÁCH NHÂN VIÊN (Có phân trang, tìm kiếm, lọc)
// ============================================================
const getAllEmployees = async (req, res) => {
    try {
        const { search, departmentId, status, page = 1, limit = 8 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        let queryParams = [];
        let countParams = [];
        
        let baseQuery = `
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            WHERE 1=1
        `;

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
            queryParams.push(parseInt(departmentId));
            countParams.push(parseInt(departmentId));
        }

        // Lọc theo trạng thái
        if (status) {
            baseQuery += ` AND e.status = ?`;
            queryParams.push(status);
            countParams.push(status);
        }

        // 1. Lấy tổng số dòng để tính phân trang
        const countQuery = `SELECT COUNT(e.id) as total ` + baseQuery;
        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitNum) || 1;

        // 2. Lấy dữ liệu thực tế (Lưu ý: Đổi tên cột AS để khớp với frontend)
        const dataQuery = `
            SELECT 
                e.id, e.emp_code, e.full_name, e.email, e.department_id, e.position_id, e.status,
                DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date, /* Ép cứng thành chuỗi YYYY-MM-DD */
                e.full_name AS fullName, 
                d.name AS departmentName, 
                p.title AS position, 
                p.base_salary,
                'male' AS gender, 
                'NA' AS avatar    
            ${baseQuery}
            ORDER BY e.id DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(limitNum, offset);
        
        const [data] = await pool.query(dataQuery, queryParams);

        res.status(200).json({ data, total, page: parseInt(page), totalPages });
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
                e.department_id, 
                e.position_id, 
                e.status,
                /* Ép định dạng ngày để tránh lệch múi giờ và giúp input date hiển thị đúng */
                DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date,
                e.full_name AS fullName, 
                d.name AS departmentName, 
                p.title AS position, 
                p.base_salary,
                'male' AS gender, 
                'NA' AS avatar
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            WHERE e.id = ?
        `;
        
        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
        }

        // Trả về object nhân viên đầu tiên tìm thấy
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

        // Tự động tạo mã nhân viên (emp_code) dạng EMP001, EMP002...
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
        // Bắt lỗi duplicate email hoặc emp_code
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(422).json({ message: 'Email này đã tồn tại trong hệ thống.' });
        }
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 4. CẬP NHẬT NHÂN VIÊN
// ============================================================
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, gender, department_id, position_id, hire_date, status } = req.body;

        const updateQuery = `
            UPDATE employees 
            SET full_name = ?, email = ?, gender = ?, department_id = ?, position_id = ?, hire_date = ?, status = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(updateQuery, [
            fullName, email, gender, department_id, position_id, hire_date, status, id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật.' });
        }

        res.status(200).json({ message: 'Cập nhật thành công', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
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
        // Ràng buộc khóa ngoại: Xóa user, bảng lương... liên quan (đã set CASCADE trong DB nên an toàn)
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

// ============================================================
// 6. LẤY THỐNG KÊ (Cho Dashboard)
// ============================================================
const getStats = async (req, res) => {
    try {
        // Dùng Promise.all để chạy song song nhiều câu Query, tối ưu tốc độ response
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
                SELECT p.title, p.base_salary as salary, COUNT(e.id) as count 
                FROM positions p 
                LEFT JOIN employees e ON p.id = e.position_id 
                GROUP BY p.id
            `),
            // Query đếm số lượng nam/nữ
            pool.query(`SELECT gender, COUNT(*) as count FROM employees GROUP BY gender`)
        ]);

        const total = totalRes[0].total;
        let active = 0;
        let resigned = 0;

        statusRes.forEach(row => {
            if (row.status === 'Active') active = row.count;
            if (row.status === 'Resigned') resigned = row.count;
        });

        // Xử lý mảng giới tính cho Frontend
        let maleCount = 0;
        let femaleCount = 0;
        genderRes.forEach(row => {
            if (row.gender === 'male') maleCount = row.count;
            if (row.gender === 'female') femaleCount = row.count;
        });

        // Cập nhật lại kết quả trả về để khớp 100% với form mẫu của Frontend
        res.status(200).json({
            total,
            active,
            resigned,
            newThisMonth: 0, // Thêm trường này (hardcode tạm vì DB chưa có logic tính)
            retentionRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0,
            byDepartment: deptRes,
            // Trả về đúng format mảng { name, value } mà Frontend đang map()
            byGender: [
                { name: 'Nam', value: maleCount },
                { name: 'Nữ', value: femaleCount }
            ],
            recruitmentTrend: yearRes.map(y => ({ month: y.year.toString(), count: y.count })),
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
        const [rows] = await pool.query('SELECT * FROM positions ORDER BY base_salary DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.', error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getStats,
    getPositions
};