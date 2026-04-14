const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ============================================================
// 1. API ĐĂNG NHẬP & CẤP TOKEN
// ============================================================
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp username và password.' });
        }

        const query = `
            SELECT u.*, e.status as emp_status 
            FROM users u
            JOIN employees e ON u.emp_id = e.id
            WHERE u.username = ?
        `;
        const [users] = await pool.query(query, [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
        }

        const user = users[0];

        if (user.emp_status !== 'Active') {
            return res.status(403).json({ message: 'Tài khoản này đã bị vô hiệu hóa do nhân viên đã nghỉ việc.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
        }

        const payload = {
            id: user.id,
            emp_id: user.emp_id,
            role: user.role
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

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
// 2. API LẤY THÔNG TIN USER HIỆN TẠI (Dùng khi F5 load lại web)
// ============================================================
const getMe = async (req, res) => {
    try {
        // req.user.id có được từ middleware verifyToken
        const userId = req.user.id;

        const query = `
            SELECT u.id, u.emp_id, u.username, u.role, e.full_name, e.status as emp_status, e.gender 
            FROM users u
            JOIN employees e ON u.emp_id = e.id
            WHERE u.id = ?
        `;
        
        const [users] = await pool.query(query, [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const user = users[0];

        // Nếu nhân viên đã nghỉ việc, không cho lấy thông tin
        if (user.emp_status !== 'Active') {
            return res.status(403).json({ message: 'Tài khoản này đã bị vô hiệu hóa.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Lỗi server hệ thống.', error: error.message });
    }
};

// ============================================================
// 3. HÀM HỖ TRỢ BĂM MẬT KHẨU
// ============================================================
const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
};

module.exports = {
    login,
    getMe,
    hashPassword
};