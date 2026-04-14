const db = require('../config/db');
const formulaEngine = require('../utils/formulaEngine');

const runPayroll = async (month, year, executedByAdminId) => {
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction(); 

        const [checkExist] = await connection.query(
            `SELECT id FROM payroll_records WHERE month = ? AND year = ? LIMIT 1`,
            [month, year]
        );
        if (checkExist.length > 0) throw new Error('ALREADY_RUN');

        const [employeesData] = await connection.query(`
            SELECT e.id as employee_id, p.base_salary
            FROM employees e
            INNER JOIN positions p ON e.position_id = p.id
            WHERE e.status = 'Active'
        `);

        if (employeesData.length === 0) {
             return { success: true, count: 0, message: "Không có nhân viên nào đang làm việc." };
        }

        const valuesToInsert = employeesData.map(emp => {
            const standardDays = 22;
            const actualDays = 22; 
            const lateHours = 0;
            const fixedAllowance = 1000000; 

            const result = formulaEngine.calculateNetPay(emp.base_salary, fixedAllowance, standardDays, actualDays, lateHours);

            return [emp.employee_id, month, year, emp.base_salary, fixedAllowance, result.totalDeductions, result.netPay, 'Draft'];
        });

        await connection.query(`
            INSERT INTO payroll_records 
            (emp_id, month, year, base_salary, total_allowance, total_deduction, net_salary, status) 
            VALUES ?
        `, [valuesToInsert]);
        
        await connection.commit(); 
        return { success: true, count: valuesToInsert.length };

    } catch (error) {
        await connection.rollback(); 
        throw error;
    } finally { 
        connection.release(); 
    }
};

const getAllPayrolls = async () => {
    const query = `
        SELECT pr.*, e.full_name as name, e.emp_code
        FROM payroll_records pr
        JOIN employees e ON pr.emp_id = e.id
        ORDER BY pr.year DESC, pr.month DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

// 1. Lấy Lịch sử lương (Theo Role)
const getPayrollHistory = async (user) => {
    if (user.role === 'Admin' || user.role === 'HR') {
        // Admin/HR: Gom nhóm theo tháng/năm, tính tổng tiền toàn công ty
        const query = `
            SELECT 
                CONCAT(LPAD(month, 2, '0'), '/', year) as monthStr,
                year, month,
                SUM(net_salary) as totalPaid,
                COUNT(id) as employees,
                MAX(status) as status
            FROM payroll_records
            GROUP BY year, month
            ORDER BY year DESC, month DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    } else {
        // Staff: Lấy danh sách phiếu lương của chính mình qua các tháng
        const query = `
            SELECT 
                id as recordId,
                CONCAT(LPAD(month, 2, '0'), '/', year) as monthStr,
                year, month,
                net_salary as totalPaid,
                1 as employees,
                status
            FROM payroll_records
            WHERE emp_id = ?
            ORDER BY year DESC, month DESC
        `;
        const [rows] = await db.query(query, [user.emp_id]);
        return rows;
    }
};

// 2. Lấy Chi tiết phiếu lương
const getPayrollDetail = async (recordId, user) => {
    const query = `
        SELECT 
            pr.*, 
            e.full_name as name, e.emp_code, 
            d.name as departmentName, 
            p.title as positionTitle
        FROM payroll_records pr
        JOIN employees e ON pr.emp_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN positions p ON e.position_id = p.id
        WHERE pr.id = ?
    `;
    const [rows] = await db.query(query, [recordId]);
    
    if (rows.length === 0) throw new Error('NOT_FOUND');

    const record = rows[0];

    // Bảo mật: Nếu là Staff, chỉ được xem phiếu của chính mình
    if (user.role === 'Staff' && record.emp_id !== user.emp_id) {
        throw new Error('FORBIDDEN');
    }

    // Format dữ liệu trả về cho FE dễ dùng
    return {
        id: record.id,
        name: record.name,
        emp_code: record.emp_code,
        position: record.positionTitle,
        department: record.departmentName,
        period: `${String(record.month).padStart(2, '0')}/${record.year}`,
        baseSalary: record.base_salary,
        netSalary: record.net_salary,
        status: record.status,
        allowances: [
            { label: 'Phụ cấp cố định', amount: record.total_allowance }
        ],
        deductions: [
            { label: 'Khấu trừ (Đi muộn/Nghỉ)', amount: record.total_deduction }
        ]
    };
};

module.exports = { runPayroll, getAllPayrolls, getPayrollHistory, getPayrollDetail };