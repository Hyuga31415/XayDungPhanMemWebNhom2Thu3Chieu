const db = require('../config/db'); // Import file db.js của bạn
const formulaEngine = require('../utils/formulaEngine'); // File chứa hàm tính toán

const runPayroll = async (month, year, executedByAdminId) => {
    const connection = await db.getConnection(); // Rút connection từ Pool
    
    try {
        await connection.beginTransaction(); // Khóa Transaction

        // 1. Tạo kỳ lương mới
        const [runResult] = await connection.query(
            `INSERT INTO payroll_runs (month, year, executed_by, status) VALUES (?, ?, ?, 'locked')`,
            [month, year, executedByAdminId]
        );
        const payrollRunId = runResult.insertId;

        // 2. Query TỔNG HỢP CHÉO từ BE1 và BE2
        const [employeesData] = await connection.query(`
            SELECT 
                e.id as employee_id, e.base_salary, e.fixed_allowance,
                a.standard_days, a.actual_days, a.late_hours
            FROM employees e
            INNER JOIN attendance_summaries a ON e.id = a.employee_id
            WHERE a.month = ? AND a.year = ? AND e.status = 'active'
        `, [month, year]);

        if (employeesData.length === 0) {
            throw new Error('Không có dữ liệu chấm công hợp lệ để chốt lương!');
        }

        // 3. Tính toán qua Rule Engine
        const valuesToInsert = employeesData.map(emp => {
            const result = formulaEngine.calculateNetPay(
                emp.base_salary, emp.fixed_allowance, 
                emp.standard_days, emp.actual_days, emp.late_hours
            );

            // Thứ tự phải khớp với câu INSERT bên dưới
            return [
                payrollRunId, emp.employee_id, 
                emp.base_salary, emp.fixed_allowance, emp.standard_days, emp.actual_days,
                result.calculatedActualSalary, result.totalDeductions, result.netPay
            ];
        });

        // 4. BULK INSERT tốc độ cao (Lưu Snapshot)
        await connection.query(`
            INSERT INTO payslips (
                payroll_run_id, employee_id, 
                snapshot_base_salary, snapshot_allowance, snapshot_standard_days, snapshot_actual_days, 
                calculated_actual_salary, total_deductions, net_pay
            ) VALUES ? 
        `, [valuesToInsert]);

        await connection.commit(); // Chốt dữ liệu
        return { success: true, totalProcessed: valuesToInsert.length };

    } catch (error) {
        await connection.rollback(); // Hoàn tác nếu có lỗi
        throw error;
    } finally {
        connection.release(); // Trả connection lại cho Pool
    }
};

module.exports = { runPayroll };
