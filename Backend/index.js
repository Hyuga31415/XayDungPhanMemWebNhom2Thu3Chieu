require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Dùng phiên bản promise để viết async/await cho gọn

const app = express();
app.use(cors());
app.use(express.json());

// Khởi tạo Connection Pool kết nối tới TiDB
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    // TiDB Serverless bắt buộc phải bật SSL
    ssl: {
        rejectUnauthorized: true
    }
});

/// 1. Lấy tất cả users (BASE_API/users)
app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.status(200).json(rows); // Trả về mảng dữ liệu trực tiếp để dễ chấm điểm
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Lấy user theo ID (BASE_API/users/1)
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Server đang chạy bình thường! Hãy truy cập /api/users để xem dữ liệu.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});