const db = require('../config/db');

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
