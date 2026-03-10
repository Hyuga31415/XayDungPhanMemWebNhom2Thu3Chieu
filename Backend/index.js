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

// Route kiểm tra kết nối Database
app.get('/api/db-test', async (req, res) => {
    try {
        // Thử chạy một câu lệnh MySQL cơ bản
        const [rows, fields] = await pool.query('SELECT VERSION() AS db_version');
        
        res.status(200).json({
            success: true,
            message: "Kết nối TiDB thành công! 🎉",
            version: rows[0].db_version
        });
    } catch (error) {
        console.error("Lỗi kết nối DB:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi kết nối Database",
            error: error.message
        });
    }
});

// Route API danh sách nhân viên thực tế (sau này bạn sẽ lấy từ bảng employees)
app.get('/api/users', async (req, res) => {
    try {
        // Tạm thời vẫn dùng dữ liệu mẫu. 
        // Khi bạn tạo bảng xong, thay bằng: const [users] = await pool.query('SELECT * FROM employees');
        const users = [
            { id: 1, name: "Nguyễn Văn A" },
            { id: 2, name: "Trần Thị B" }
        ];
        
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});