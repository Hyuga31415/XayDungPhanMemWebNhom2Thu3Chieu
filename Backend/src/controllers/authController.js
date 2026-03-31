const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ============================================================
// 1. API ĐĂNG NHẬP & CẤP TOKEN
// ============================================================
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Kiểm tra input cơ bản
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp username và password.' });
        }

        // 2. Tìm user trong database
        // Chỉ lấy user đang hoạt động bằng cách JOIN với bảng employees (status = 'Active')
        const query = `
            SELECT u.*, e.status as emp_status 
            FROM users u
            JOIN employees e ON u.emp_id = e.id
            WHERE u.username = ?
        `;
        const [users] = await pool.query(query, [username]);
        
        if (users.length === 0) {
            // Dùng chung 1 thông báo lỗi để tránh việc hacker dò tìm username có tồn tại hay không
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
        }

        const user = users[0];

        // 3. Kiểm tra trạng thái nhân viên (Nếu đã nghỉ việc thì chặn đăng nhập)
        if (user.emp_status !== 'Active') {
            return res.status(403).json({ message: 'Tài khoản này đã bị vô hiệu hóa do nhân viên đã nghỉ việc.' });
        }

        // 4. So sánh mật khẩu (Bcrypt)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
        }

        // 5. Cấp phát Token (JWT)
        const payload = {
            id: user.id,
            emp_id: user.emp_id,
            role: user.role
        };

        // Ký token với Secret Key và đặt thời gian sống (1 ngày)
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        // 6. Trả kết quả về cho Client (Khớp với axiosClient bên React)
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user.id,
                emp_id: user.emp_id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Lỗi server hệ thống.', error: error.message });
    }
};

// ============================================================
// 2. HÀM HỖ TRỢ BĂM MẬT KHẨU (Dùng khi tạo User mới)
// ============================================================
const hashPassword = async (plainPassword) => {
    // Salt rounds mặc định là 10 (cân bằng giữa bảo mật và hiệu suất)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
};

module.exports = {
    login,
    hashPassword
};