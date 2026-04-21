const db = require('../config/db');

// =============================================
// 🟢 Helper: Lấy ngày hiện tại chuẩn Việt Nam
// =============================================
const getToday = () => {
    return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
};

// =============================================
// 🟢 CHECK-IN
// =============================================
exports.checkIn = async (emp_id) => {
    const today = getToday();
    const now = new Date();

    // 🔍 kiểm tra đã check-in chưa
    const [rows] = await db.query(
        `SELECT * FROM attendance_logs 
         WHERE emp_id = ? AND DATE(work_date) = ?`,
        [emp_id, today]
    );

    if (rows.length > 0) {
        throw new Error("Đã check-in rồi");
    }

    // ⏰ logic đi trễ
    let status = "Present";
    if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0)) {
        status = "Late";
    }

    // 💾 insert DB
    await db.query(
        `INSERT INTO attendance_logs (emp_id, work_date, check_in, status)
         VALUES (?, ?, ?, ?)`,
        [emp_id, today, now, status]
    );
};

// =============================================
// 🔵 CHECK-OUT
// =============================================
exports.checkOut = async (emp_id) => {
    const today = getToday();
    const now = new Date();

    const [rows] = await db.query(
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

    // 👉 chỉ update giờ, KHÔNG đổi status
    await db.query(
        `UPDATE attendance_logs 
         SET check_out = ?
         WHERE id = ?`,
        [now, record.id]
    );
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