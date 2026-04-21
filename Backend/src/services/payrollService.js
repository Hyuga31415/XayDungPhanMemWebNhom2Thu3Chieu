const db = require('../config/db');
const systemConfigService = require('./systemConfigService');
const {
    getSalaryComponents,
    insertPayrollDetails,
    getPayrollDetailsByPayrollId
} = require('./enterpriseDataService');

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const getPeriodBounds = (month, year) => {
    const monthStr = String(month).padStart(2, '0');
    const firstDay = `${year}-${monthStr}-01`;
    const lastDate = new Date(Number(year), Number(month), 0).getDate();
    const lastDay = `${year}-${monthStr}-${String(lastDate).padStart(2, '0')}`;
    return { firstDay, lastDay };
};

const calcComponentAmount = ({ component, ctx }) => {
    const name = String(component.name || '').toLowerCase();
    const {
        payableDays,
        lateDays,
        overtimeHours,
        actualBaseSalary,
        standardWorkDays,
        standardWorkHours,
        latePenaltyAmount,
        bhxhRate,
        lunchAllowancePerDay,
        transportAllowancePerMonth,
        attendanceBonusAmount,
        overtimeRateMultiplier
    } = ctx;

    // Các đoạn rule dưới đây dùng để map component trong DB sang công thức tính tiền thực tế.
    // Ưu tiên nhận diện theo tên để Admin có thể cấu hình danh mục component linh hoạt.
    if (component.type === 'Allowance') {
        if (name.includes('an trua') || name.includes('ăn trưa') || name.includes('lunch')) {
            return payableDays * lunchAllowancePerDay;
        }

        if (name.includes('xang xe') || name.includes('xăng xe') || name.includes('transport')) {
            return payableDays > 0 ? transportAllowancePerMonth : 0;
        }

        if (name.includes('chuyen can') || name.includes('chuyên cần') || name.includes('attendance')) {
            return (lateDays === 0 && payableDays >= standardWorkDays) ? attendanceBonusAmount : 0;
        }

        if (name.includes('ot') || name.includes('overtime') || name.includes('lam them') || name.includes('làm thêm')) {
            const hourlyRate = standardWorkDays > 0 && standardWorkHours > 0
                ? (actualBaseSalary / standardWorkDays / standardWorkHours)
                : 0;
            return overtimeHours * hourlyRate * overtimeRateMultiplier;
        }

        return 0;
    }

    if (component.type === 'Deduction') {
        if (name.includes('di muon') || name.includes('đi muộn') || name.includes('late')) {
            return lateDays * latePenaltyAmount;
        }

        if (name.includes('bhxh') || name.includes('social insurance')) {
            return actualBaseSalary * (bhxhRate / 100);
        }

        if (name.includes('thue') || name.includes('thuế') || name.includes('pit')) {
            return 0;
        }

        return 0;
    }

    return 0;
};

const runPayroll = async (month, year, executedByAdminId) => {
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction(); 

        const [checkExist] = await connection.query(
            `SELECT id FROM payroll_records WHERE month = ? AND year = ? LIMIT 1`,
            [month, year]
        );
        if (checkExist.length > 0) throw new Error('ALREADY_RUN');

        const { firstDay, lastDay } = getPeriodBounds(month, year);

        const configMap = await systemConfigService.getConfigMap();
        const standardWorkDays = toNumber(configMap.STANDARD_WORK_DAYS, 22);
        const standardWorkHours = toNumber(configMap.STANDARD_WORK_HOURS, 8);
        const latePenaltyAmount = toNumber(configMap.LATE_PENALTY_AMOUNT, 50000);
        const bhxhRate = toNumber(configMap.BHXH_RATE_EMPLOYEE, 8);
        const lunchAllowancePerDay = toNumber(configMap.LUNCH_ALLOWANCE_PER_DAY, 0);
        const transportAllowancePerMonth = toNumber(configMap.TRANSPORT_ALLOWANCE_PER_MONTH, 0);
        const attendanceBonusAmount = toNumber(configMap.ATTENDANCE_BONUS_AMOUNT, 0);
        const overtimeRateMultiplier = toNumber(configMap.OVERTIME_RATE_MULTIPLIER, 1.5);

        const salaryComponents = await getSalaryComponents(connection);

        const [employeesData] = await connection.query(`
            SELECT e.id AS employee_id, c.base_salary
            FROM employees e
            INNER JOIN (
                SELECT ec1.emp_id, ec1.base_salary
                FROM employee_contracts ec1
                INNER JOIN (
                    SELECT emp_id, MAX(start_date) AS max_start_date
                    FROM employee_contracts
                    WHERE status = 'Active'
                      AND start_date <= ?
                      AND (end_date IS NULL OR end_date >= ?)
                    GROUP BY emp_id
                ) ec2 ON ec1.emp_id = ec2.emp_id AND ec1.start_date = ec2.max_start_date
            ) c ON c.emp_id = e.id
            WHERE e.status = 'Active'
        `, [lastDay, firstDay]);

        if (employeesData.length === 0) {
             return { success: true, count: 0, message: "Không có nhân viên nào đang làm việc." };
        }

        const [attendanceRows] = await connection.query(`
            SELECT
                emp_id,
                SUM(CASE WHEN status IN ('Present', 'Late') THEN 1 ELSE 0 END) AS payable_days,
                SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) AS late_days,
                COALESCE(SUM(overtime_hours), 0) AS overtime_hours
            FROM attendance_logs
            WHERE work_date BETWEEN ? AND ?
            GROUP BY emp_id
        `, [firstDay, lastDay]);

        const attendanceMap = attendanceRows.reduce((acc, row) => {
            acc[row.emp_id] = {
                payable_days: toNumber(row.payable_days, 0),
                late_days: toNumber(row.late_days, 0),
                overtime_hours: toNumber(row.overtime_hours, 0)
            };
            return acc;
        }, {});

        let processedCount = 0;

        for (const emp of employeesData) {
            const attendance = attendanceMap[emp.employee_id] || {
                payable_days: 0,
                late_days: 0,
                overtime_hours: 0
            };

            const baseSalary = toNumber(emp.base_salary, 0);

            // Tính lương cơ bản thực nhận theo ngày công trong tháng
            const payableDays = Math.min(attendance.payable_days, standardWorkDays);
            const actualBaseSalary = standardWorkDays > 0
                ? (baseSalary / standardWorkDays) * payableDays
                : 0;

            const detailLines = [];
            let totalAllowance = 0;
            let totalDeduction = 0;

            for (const component of salaryComponents) {
                const rawAmount = calcComponentAmount({
                    component,
                    ctx: {
                        payableDays,
                        lateDays: attendance.late_days,
                        overtimeHours: attendance.overtime_hours,
                        actualBaseSalary,
                        standardWorkDays,
                        standardWorkHours,
                        latePenaltyAmount,
                        bhxhRate,
                        lunchAllowancePerDay,
                        transportAllowancePerMonth,
                        attendanceBonusAmount,
                        overtimeRateMultiplier
                    }
                });

                const amount = Math.round(Math.max(0, rawAmount));
                if (amount <= 0) continue;

                if (component.type === 'Allowance') {
                    totalAllowance += amount;
                } else {
                    totalDeduction += amount;
                }

                detailLines.push({
                    component_id: component.id,
                    amount,
                    description: `Tự động tính cho kỳ lương ${String(month).padStart(2, '0')}/${year}`
                });
            }

            const netSalary = Math.max(0, Math.round(actualBaseSalary + totalAllowance - totalDeduction));

            const [payrollInsertResult] = await connection.query(`
                INSERT INTO payroll_records
                (emp_id, month, year, base_salary, total_allowance, total_deduction, net_salary, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'Draft')
            `, [
                emp.employee_id,
                month,
                year,
                baseSalary,
                totalAllowance,
                totalDeduction,
                netSalary
            ]);

            if (detailLines.length > 0) {
                await insertPayrollDetails(connection, payrollInsertResult.insertId, detailLines);
            }

            processedCount += 1;
        }

        await connection.commit(); 
        return { success: true, count: processedCount };

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
    const payrollDetails = await getPayrollDetailsByPayrollId(record.id);

    // Fallback cho dữ liệu cũ: nếu chưa có payroll_details thì sinh chi tiết từ tổng phụ cấp/khấu trừ.
    // Nhờ vậy phiếu lương vẫn giải thích được vì sao baseSalary khác netSalary (ví dụ +1.000.000 phụ cấp).
    const normalizedPayrollDetails = payrollDetails.length > 0
        ? payrollDetails
        : [
            ...(toNumber(record.total_allowance, 0) > 0
                ? [{
                    id: `legacy-allowance-${record.id}`,
                    payroll_id: record.id,
                    component_id: null,
                    component_name: 'Tổng phụ cấp kỳ lương',
                    component_type: 'Allowance',
                    is_taxable: 0,
                    amount: toNumber(record.total_allowance, 0),
                    description: 'Dữ liệu tổng hợp từ phiếu lương cũ.'
                }]
                : []),
            ...(toNumber(record.total_deduction, 0) > 0
                ? [{
                    id: `legacy-deduction-${record.id}`,
                    payroll_id: record.id,
                    component_id: null,
                    component_name: 'Tổng khấu trừ kỳ lương',
                    component_type: 'Deduction',
                    is_taxable: 0,
                    amount: toNumber(record.total_deduction, 0),
                    description: 'Dữ liệu tổng hợp từ phiếu lương cũ (chưa có payroll_details).'
                }]
                : [])
        ];

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
        payroll_details: normalizedPayrollDetails,
        allowances: normalizedPayrollDetails
            .filter(item => item.component_type === 'Allowance')
            .map(item => ({ label: item.component_name, amount: item.amount })),
        deductions: normalizedPayrollDetails
            .filter(item => item.component_type === 'Deduction')
            .map(item => ({ label: item.component_name, amount: item.amount }))
    };
};

module.exports = { runPayroll, getAllPayrolls, getPayrollHistory, getPayrollDetail };