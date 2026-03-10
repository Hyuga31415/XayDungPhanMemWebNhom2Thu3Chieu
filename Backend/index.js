// Nạp các biến môi trường từ file .env (nếu chạy ở máy cá nhân)
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Cho phép gọi API từ các domain khác (Frontend)
app.use(express.json()); // Xử lý dữ liệu JSON gửi lên

// Route mặc định (Kiểm tra xem server có hoạt động không)
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server đang hoạt động tốt trên Render! 🚀",
        timestamp: new Date()
    });
});

// Một route API thử nghiệm
app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: "Nguyễn Văn A" },
        { id: 2, name: "Trần Thị B" }
    ];
    res.status(200).json({
        success: true,
        data: users
    });
});

// Bắt port từ Render cấp phát, hoặc dùng 3000 nếu chạy local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});