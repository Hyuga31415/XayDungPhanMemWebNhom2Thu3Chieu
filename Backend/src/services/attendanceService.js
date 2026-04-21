const db = require('../config/db');
const { getEmployeeShiftByDate } = require('./enterpriseDataService');

// =============================================
// 🟢 Helper: Lấy ngày hiện tại chuẩn Việt Nam
// =============================================
const getToday = () => {
    return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
};

const timeToMinutes = (timeValue) => {
    if (!timeValue) return null;
    const [hh, mm] = String(timeValue).split(':').map(Number);
    return (hh * 60) + mm;
};

const diffHours = (startDate, endDate) => {
    const ms = endDate.getTime() - startDate.getTime();
    const hours = ms / (1000 * 60 * 60);
    return Number.isFinite(hours) ? Math.max(0, hours) : 0;
};

// =============================================
// 🟢 CHECK-IN
// =============================================
exports.checkIn = async (emp_id) => {
    const today = getToday();
    const now = new Date();
    const connection = await db.getConnection();

    try {
        // 🔍 kiểm tra đã check-in chưa
        const [rows] = await connection.query(
            `SELECT * FROM attendance_logs 
             WHERE emp_id = ? AND DATE(work_date) = ?`,
            [emp_id, today]
        );

        if (rows.length > 0) {
            throw new Error("Đã check-in rồi");
        }

        // ⏰ logic đi trễ theo ca làm việc trong ngày (nếu có)
        let status = "Present";
        const shiftAssignment = await getEmployeeShiftByDate(connection, emp_id, today);

        if (shiftAssignment) {
            const shiftStartMins = timeToMinutes(shiftAssignment.start_time);
            const graceMins = Number(shiftAssignment.grace_period_mins || 0);
            const checkInMins = (now.getHours() * 60) + now.getMinutes();

            if (shiftStartMins !== null && checkInMins > (shiftStartMins + graceMins)) {
                status = "Late";
            }
        } else {
            // Fallback cho trường hợp chưa phân ca
            if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0)) {
                status = "Late";
            }
        }

        // 💾 insert DB
        await connection.query(
            `INSERT INTO attendance_logs (emp_id, work_date, check_in, status)
             VALUES (?, ?, ?, ?)`,
            [emp_id, today, now, status]
        );
    } finally {
        connection.release();
    }
};

// =============================================
// 🔵 CHECK-OUT
// =============================================
exports.checkOut = async (emp_id) => {
    const today = getToday();
    const now = new Date();
    const connection = await db.getConnection();

    try {
        const [rows] = await connection.query(
            `SELECT * FROM attendance_logs 
             WHERE emp_id = ? AND DATE(work_date) = ?`,
            [emp_id, today]
        );

        if (rows.length === 0) {
            throw new Error("Chưa check-in");
        }

        const record = rows[0];

        if (record.check_out) {
            throw new Error("Đã check-out rồi");
        }

        let workingHours = 0;
        let overtimeHours = 0;

        if (record.check_in) {
            // Tính tổng giờ làm thực tế từ lúc check-in đến check-out
            const checkInTime = new Date(record.check_in);
            const actualHours = diffHours(checkInTime, now);

            // Nếu có phân ca thì tách giờ hành chính và OT theo giờ ca
            const shiftAssignment = await getEmployeeShiftByDate(connection, emp_id, today);

            if (shiftAssignment) {
                const startMins = timeToMinutes(shiftAssignment.start_time);
                const endMins = timeToMinutes(shiftAssignment.end_time);

                let scheduledHours = 8;
                if (startMins !== null && endMins !== null) {
                    // Hỗ trợ ca qua đêm: end_time < start_time
                    const durationMins = endMins >= startMins
                        ? (endMins - startMins)
                        : ((24 * 60 - startMins) + endMins);
                    scheduledHours = durationMins / 60;
                }

                workingHours = Math.min(actualHours, scheduledHours);
                overtimeHours = Math.max(0, actualHours - scheduledHours);
            } else {
                // Không có ca: mặc định 8 giờ hành chính
                workingHours = Math.min(actualHours, 8);
                overtimeHours = Math.max(0, actualHours - 8);
            }
        }

        // 👉 update giờ check-out + giờ làm thực tế + OT
        await connection.query(
            `UPDATE attendance_logs 
             SET check_out = ?, working_hours = ?, overtime_hours = ?
             WHERE id = ?`,
            [now, workingHours.toFixed(2), overtimeHours.toFixed(2), record.id]
        );
    } finally {
        connection.release();
    }
};

// =============================================
// 📊 LẤY LỊCH SỬ CHẤM CÔNG
// =============================================
exports.getHistory = async (emp_id) => {
    const [rows] = await db.query(`
        SELECT 
            id,
            emp_id,
            DATE(work_date) as work_date,
            DATE_FORMAT(check_in, '%H:%i:%s') as check_in,
            DATE_FORMAT(check_out, '%H:%i:%s') as check_out,
            working_hours,
            overtime_hours,
            status
        FROM attendance_logs
        WHERE emp_id = ?
        ORDER BY work_date DESC
    `, [emp_id]);

    return rows;
};

// =============================================
// 📈 TỔNG KẾT NGÀY CÔNG (đơn giản)
// =============================================
exports.getSummary = async (emp_id) => {
    const [rows] = await db.query(`
        SELECT 
            COUNT(*) as total_days,
            SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
            SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_days,
            SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days
        FROM attendance_logs
        WHERE emp_id = ?
    `, [emp_id]);

    return rows[0];
};

// =============================================
// ❌ ĐÁNH DẤU NGHỈ (Absent)
// =============================================
exports.markAbsent = async () => {
    const today = getToday();

    await db.query(`
        INSERT INTO attendance_logs (emp_id, work_date, status)
        SELECT id, ?, 'Absent'
        FROM employees
        WHERE id NOT IN (
            SELECT emp_id FROM attendance_logs WHERE DATE(work_date) = ?
        )
    `, [today, today]);
};