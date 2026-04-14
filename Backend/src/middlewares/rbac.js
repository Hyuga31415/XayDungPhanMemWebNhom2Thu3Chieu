// src/middlewares/rbac.js

// 1. TỪ ĐIỂN PHÂN QUYỀN
const PERMISSIONS = {
    // Tổng quan
    'dashboard:read':       ['Admin', 'HR', 'Staff'], 
    'analytics:read':       ['Admin', 'HR'],
  
    // Nhân sự
    'employee:read':        ['Admin', 'HR', 'Staff'], // Staff bị chặn bởi ownOnly
    'employee:write':       ['Admin', 'HR'],
    'employee:delete':      ['Admin'],
    'department:read':      ['Admin', 'HR', 'Staff'],
    'department:write':     ['Admin'],
  
    // Chấm công
    'attendance:read':      ['Admin', 'HR', 'Staff'], 
    'attendance:checkin':   ['Admin', 'HR', 'Staff'],
    'attendance:adjust':    ['Admin', 'HR'],
    'leave:request':        ['Admin', 'HR', 'Staff'],
    'leave:approve':        ['Admin', 'HR'],
    'shift:read':           ['Admin', 'HR', 'Staff'],
    'shift:write':          ['Admin', 'HR'],
  
    // Payroll
    'payroll:read':         ['Admin', 'HR', 'Staff'], 
    'payroll:write':        ['Admin'],
    'payroll:config':       ['Admin'],
    'payroll:report':       ['Admin', 'HR'],
    'payroll:history:read': ['Admin', 'HR', 'Staff'], 
};

// 2. MIDDLEWARE KIỂM TRA QUYỀN (Action)
const permit = (...actions) => {
    return (req, res, next) => {
        // Đảm bảo user đã đăng nhập (đã qua verifyToken)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Không tìm thấy thông tin phân quyền của người dùng.' });
        }

        const userRole = req.user.role;

        // Kiểm tra xem role của user có nằm trong danh sách được phép của tất cả các action yêu cầu không
        const isAllowed = actions.every(action => 
            PERMISSIONS[action] && PERMISSIONS[action].includes(userRole)
        );

        if (!isAllowed) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này.' });
        }

        next();
    };
};

// 3. MIDDLEWARE KIỂM TRA DỮ LIỆU CÁ NHÂN (Cho Staff)
// Nhận vào một hàm callback để lấy ID mục tiêu từ request (VD: req.params.id)
const ownOnly = (getTargetId) => {
    return (req, res, next) => {
        // Nếu không phải Staff (tức là Admin hoặc HR), cho phép đi tiếp thoải mái
        if (req.user.role !== 'Staff') {
            return next();
        }

        // Ép kiểu về số để so sánh chính xác
        const targetId = parseInt(getTargetId(req));
        
        // Quan trọng: So sánh với emp_id (ID nhân viên) chứ không phải ID tài khoản user
        if (targetId !== req.user.emp_id) {
            return res.status(403).json({ message: 'Bạn chỉ có quyền xem và thao tác trên dữ liệu của chính mình.' });
        }

        next();
    };
};

module.exports = {
    permit,
    ownOnly
};