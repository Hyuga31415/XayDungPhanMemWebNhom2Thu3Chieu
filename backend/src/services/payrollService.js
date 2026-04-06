const db = require('../config/db');
const formulaEngine = require('../utils/formulaEngine');

const runPayroll = async (month, year, executedByAdminId) => {
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction(); 
        const [runResult] = await connection.query(
            `INSERT INTO payroll_runs (month, year, executed_by, status) VALUES (?, ?, ?, 'locked')`,
            [month, year, executedByAdminId]
        );
        const payrollRunId = runResult.insertId;

        const [employeesData] = await connection.query(`
            SELECT e.id as employee_id, e.base_salary, e.fixed_allowance,
                   a.standard_days, a.actual_days, a.late_hours
            FROM employees e
            INNER JOIN attendance_summaries a ON e.id = a.employee_id
            WHERE a.month = ? AND a.year = ? AND e.status = 'active'
        `, [month, year]);

        const valuesToInsert = employeesData.map(emp => {
            const result = formulaEngine.calculateNetPay(emp.base_salary, emp.fixed_allowance, emp.standard_days, emp.actual_days, emp.late_hours);
            return [payrollRunId, emp.employee_id, emp.base_salary, emp.fixed_allowance, emp.standard_days, emp.actual_days, result.calculatedActualSalary, result.totalDeductions, result.netPay];
        });

        await connection.query(`INSERT INTO payslips (payroll_run_id, employee_id, snapshot_base_salary, snapshot_allowance, snapshot_standard_days, snapshot_actual_days, calculated_actual_salary, total_deductions, net_pay) VALUES ?`, [valuesToInsert]);
        await connection.commit(); 
        return { success: true, count: valuesToInsert.length };
    } catch (error) {
        await connection.rollback(); 
        throw error;
    } finally { connection.release(); }
};
module.exports = { runPayroll };
