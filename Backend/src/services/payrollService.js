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
    // JOIN với bảng employees để lấy tên hiển thị ra bảng
    const query = `
        SELECT pr.*, e.full_name as name, e.emp_code
        FROM payroll_records pr
        JOIN employees e ON pr.emp_id = e.id
        ORDER BY pr.year DESC, pr.month DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

module.exports = { runPayroll, getAllPayrolls };