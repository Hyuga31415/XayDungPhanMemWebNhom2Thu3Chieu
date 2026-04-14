const db = require('../config/db');

exports.checkIn = async (emp_id) => {
    const today = new Date().toISOString().slice(0, 10);

    // check đã check-in chưa
    const [rows] = await db.query(
        `SELECT * FROM attendance_logs 
         WHERE emp_id = ? AND work_date = ?`,
        [emp_id, today]
    );

    if (rows.length > 0) {
        throw new Error("Đã check-in rồi");
    }

    const now = new Date();

    // logic đi muộn (sau 8h30)
    const hour = now.getHours();
    const minute = now.getMinutes();
    let status = "Present";

    if (hour > 8 || (hour === 8 && minute > 30)) {
        status = "Late";
    }

    await db.query(
        `INSERT INTO attendance_logs (emp_id, work_date, check_in, status)
         VALUES (?, ?, ?, ?)`,
        [emp_id, today, now, status]
    );
};
exports.checkOut = async (emp_id) => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();

    const [rows] = await db.query(
        `SELECT * FROM attendance_logs 
         WHERE emp_id = ? AND work_date = ?`,
        [emp_id, today]
    );

    if (rows.length === 0) {
        throw new Error("Chưa check-in");
    }

    const record = rows[0];

    await db.query(
        `UPDATE attendance_logs 
         SET check_out = ?
         WHERE id = ?`,
        [now, record.id]
    );
};