const db = require('../config/db');

// 📄 Danh sách đơn nghỉ theo role
exports.getLeaves = async (user) => {
    if (user.role === 'Admin' || user.role === 'HR') {
        const [rows] = await db.query(`
            SELECT id, emp_id, leave_type, start_date, end_date, status, approved_by, created_at
            FROM leave_requests
            ORDER BY created_at DESC, id DESC
        `);
        return rows;
    }

    const [rows] = await db.query(`
        SELECT id, emp_id, leave_type, start_date, end_date, status, approved_by, created_at
        FROM leave_requests
        WHERE emp_id = ?
        ORDER BY created_at DESC, id DESC
    `, [user.emp_id]);
    return rows;
};

// 🟢 Tạo đơn
exports.createLeave = async (data) => {
    await db.query(
        `INSERT INTO leave_requests 
        (emp_id, leave_type, start_date, end_date)
        VALUES (?, ?, ?, ?)`,
        [data.emp_id, data.leave_type, data.start_date, data.end_date]
    );
};

// ✅ Duyệt
exports.approve = async (id, manager_id) => {
    await db.query(
        `UPDATE leave_requests 
         SET status = 'Approved', approved_by = ?
         WHERE id = ?`,
        [manager_id, id]
    );
};

// ❌ Từ chối
exports.reject = async (id) => {
    await db.query(
        `UPDATE leave_requests 
         SET status = 'Rejected'
         WHERE id = ?`,
        [id]
    );
};
