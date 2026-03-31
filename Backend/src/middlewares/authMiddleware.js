const jwt = require('jsonwebtoken');

// ============================================================
// 1. XÁC THỰC TOKEN (Authentication)
// ============================================================
const verifyToken = (req, res, next) => {
    // Client gửi token qua header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401: Frontend sẽ hứng lỗi này, xóa token ở localStorage và đẩy về /login
        return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện chức năng này.' });
    }

    // Tách lấy chuỗi token (Bỏ chữ "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // Giải mã token bằng Secret Key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn payload (id, emp_id, role) vào req để các bước sau sử dụng
        req.user = decoded;
        
        // Cho phép request đi tiếp vào Controller
        next();
    } catch (error) {
        // Lỗi này xảy ra khi token sai, bị sửa đổi, hoặc đã hết hạn (sau 1 ngày)
        return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.' });
    }
};

// ============================================================
// 2. PHÂN QUYỀN VAI TRÒ (Authorization)
// ============================================================
// Hàm này nhận vào một mảng các role được phép truy cập
// Ví dụ: requireRole(['Admin', 'HR'])
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Kiểm tra xem role của user hiện tại có nằm trong danh sách cho phép không
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            // 403: Frontend sẽ hiển thị thông báo "Bạn không có quyền thực hiện thao tác này."
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này.' });
        }
        
        // Nếu hợp lệ thì đi tiếp
        next();
    };
};

module.exports = {
    verifyToken,
    requireRole
};