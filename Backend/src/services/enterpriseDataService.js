const db = require('../config/db');

// =============================================
// employee_contracts
// =============================================
const getEmployeeContractsByEmpId = async (empId) => {
    const [rows] = await db.query(`
        SELECT id, emp_id, contract_code, base_salary, sign_date, start_date, end_date, status, created_at
        FROM employee_contracts
        WHERE emp_id = ?
        ORDER BY start_date DESC, id DESC
    `, [empId]);
    return rows;
};

const getActiveContractByEmpIdAndPeriod = async (connection, empId, periodDateSql = 'CURDATE()') => {
    const [rows] = await connection.query(`
        SELECT id, emp_id, contract_code, base_salary, sign_date, start_date, end_date, status
        FROM employee_contracts
        WHERE emp_id = ?
          AND status = 'Active'
          AND start_date <= ${periodDateSql}
          AND (end_date IS NULL OR end_date >= ${periodDateSql})
        ORDER BY start_date DESC, id DESC
        LIMIT 1
    `, [empId]);

    return rows[0] || null;
};

// =============================================
// salary_components + payroll_details
// =============================================
const getSalaryComponents = async (connection) => {
    const [rows] = await connection.query(`
        SELECT id, name, type, is_taxable
        FROM salary_components
        ORDER BY id ASC
    `);
    return rows;
};

const insertPayrollDetails = async (connection, payrollId, detailLines) => {
    if (!Array.isArray(detailLines) || detailLines.length === 0) return;

    const values = detailLines.map((line) => [
        payrollId,
        line.component_id,
        line.amount,
        line.description || null
    ]);

    await connection.query(`
        INSERT INTO payroll_details (payroll_id, component_id, amount, description)
        VALUES ?
    `, [values]);
};

const getPayrollDetailsByPayrollId = async (payrollId) => {
    const [rows] = await db.query(`
        SELECT
            pd.id,
            pd.payroll_id,
            pd.component_id,
            sc.name AS component_name,
            sc.type AS component_type,
            sc.is_taxable,
            pd.amount,
            pd.description
        FROM payroll_details pd
        INNER JOIN salary_components sc ON sc.id = pd.component_id
        WHERE pd.payroll_id = ?
        ORDER BY pd.id ASC
    `, [payrollId]);

    return rows;
};

// =============================================
// employee_job_history
// =============================================
const getEmployeeJobHistoryByEmpId = async (empId) => {
    const [rows] = await db.query(`
        SELECT
            h.id,
            h.emp_id,
            h.old_department_id,
            od.name AS old_department_name,
            h.new_department_id,
            nd.name AS new_department_name,
            h.old_position_id,
            op.title AS old_position_title,
            h.new_position_id,
            np.title AS new_position_title,
            h.effective_date,
            h.reason,
            h.created_at
        FROM employee_job_history h
        LEFT JOIN departments od ON od.id = h.old_department_id
        LEFT JOIN departments nd ON nd.id = h.new_department_id
        LEFT JOIN positions op ON op.id = h.old_position_id
        LEFT JOIN positions np ON np.id = h.new_position_id
        WHERE h.emp_id = ?
        ORDER BY h.effective_date DESC, h.id DESC
    `, [empId]);

    return rows;
};

const insertEmployeeJobHistory = async (connection, payload) => {
    const {
        emp_id,
        old_department_id,
        new_department_id,
        old_position_id,
        new_position_id,
        effective_date,
        reason
    } = payload;

    await connection.query(`
        INSERT INTO employee_job_history (
            emp_id,
            old_department_id,
            new_department_id,
            old_position_id,
            new_position_id,
            effective_date,
            reason
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        emp_id,
        old_department_id,
        new_department_id,
        old_position_id,
        new_position_id,
        effective_date,
        reason || null
    ]);
};

// =============================================
// shifts + employee_shifts
// =============================================
const getShifts = async () => {
    const [rows] = await db.query(`
        SELECT id, shift_name, start_time, end_time, grace_period_mins
        FROM shifts
        ORDER BY start_time ASC
    `);
    return rows;
};

const getEmployeeShiftByDate = async (connection, empId, workDate) => {
    const [rows] = await connection.query(`
        SELECT es.id, es.emp_id, es.work_date, s.id AS shift_id, s.shift_name, s.start_time, s.end_time, s.grace_period_mins
        FROM employee_shifts es
        INNER JOIN shifts s ON s.id = es.shift_id
        WHERE es.emp_id = ? AND es.work_date = ?
        LIMIT 1
    `, [empId, workDate]);

    return rows[0] || null;
};

module.exports = {
    getEmployeeContractsByEmpId,
    getActiveContractByEmpIdAndPeriod,
    getSalaryComponents,
    insertPayrollDetails,
    getPayrollDetailsByPayrollId,
    getEmployeeJobHistoryByEmpId,
    insertEmployeeJobHistory,
    getShifts,
    getEmployeeShiftByDate
};
