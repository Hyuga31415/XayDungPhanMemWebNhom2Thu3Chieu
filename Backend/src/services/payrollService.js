const db = require('../config/db');

const runPayroll = async (month, year) => {
    // 1. Lấy danh sách nhân viên và lương cơ bản từ bảng positions
    const [employees] = await db.query(`
        SELECT e.id, p.base_salary 
        FROM employees e 
        JOIN positions p ON e.position_id = p.id 
        WHERE e.status = 'Active'
    `);

    // 2. Tính toán lương cho từng người (giả sử công chuẩn 22 ngày)
    const payrollData = employees.map(emp => {
        const standardDays = 22;
        const actualDays = 22; // Sau này bạn có thể lấy từ bảng chấm công
        const netSalary = (emp.base_salary / standardDays) * actualDays;

        return [emp.id, month, year, emp.base_salary, netSalary, 'Paid'];
    });

    // 3. Lưu vào database
    const query = `INSERT INTO payroll_records (emp_id, month, year, base_salary, net_salary, status) VALUES ?`;
    await db.query(query, [payrollData]);

    return { success: true, count: payrollData.length };
};

module.exports = { runPayroll };
