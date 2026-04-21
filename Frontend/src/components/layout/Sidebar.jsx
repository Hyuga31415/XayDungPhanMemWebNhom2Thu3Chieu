import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ChevronRight,
  Settings, LogOut, Briefcase, BarChart3, Clock, Calendar, Layers,
  Menu, Wallet, Receipt
} from 'lucide-react';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';
import '../../styles/layout.css';

// ============================================================
// Sidebar Component - Đã tích hợp Phân quyền (RBAC)
// ============================================================

// Định nghĩa cấu hình Menu kèm theo các Role được phép truy cập
const navItems = [
  {
    section: 'Tổng quan',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'HR', 'Staff'] },
      { to: '/analytics', icon: BarChart3, label: 'Phân tích', roles: ['Admin', 'HR'] }, // Staff không xem phân tích tổng
    ],
  },
  {
    section: 'Quản lý nhân sự',
    items: [
      { to: '/profile', icon: Users, label: 'Hồ sơ của tôi', roles: ['Admin', 'HR', 'Staff'] },
      { to: '/employees', icon: Users, label: 'Nhân viên', roles: ['Admin', 'HR'] },
      { to: '/departments', icon: Building2, label: 'Phòng ban', roles: ['Admin'] },
      { to: '/positions', icon: Briefcase, label: 'Chức vụ', roles: ['Admin'] },
    ],
  },
  {
    section: 'Chấm công & Nghỉ phép',
    items: [
      { to: '/attendance', icon: Clock, label: 'Chấm công', roles: ['Admin', 'HR', 'Staff'] },
      { to: '/leave-requests', icon: Calendar, label: 'Nghỉ phép', roles: ['Admin', 'HR', 'Staff'] },
      { to: '/shifts', icon: Layers, label: 'Ca làm việc', roles: ['Admin', 'HR'] },
    ],
  },
  {
    section: 'Payroll',
    items: [
      { to: '/payroll/management', icon: Wallet, label: 'Bảng lương', roles: ['Admin', 'HR'] }, // Của toàn công ty
      { to: '/payroll/history', icon: Wallet, label: 'Lịch sử lương', roles: ['Admin', 'HR', 'Staff'] }, // Lịch sử cá nhân
      { to: '/payroll/reports', icon: BarChart3, label: 'Báo cáo lương', roles: ['Admin', 'HR'] },
      { to: '/payroll/settings', icon: Settings, label: 'Cấu hình lương', roles: ['Admin'] }, // Chỉ Admin
      { to: '/payroll/detail', icon: Receipt, label: 'Phiếu lương', roles: ['Admin', 'HR', 'Staff'] }, // Phiếu lương cá nhân
    ],
  },
];

function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  
  // Lấy thông tin user hiện tại và hàm logout từ AuthStore
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Mặc định nếu chưa load kịp thì coi như Staff (quyền thấp nhất) để an toàn
  const userRole = user?.role || 'Staff'; 

  // LỌC MENU THEO ROLE: Chỉ giữ lại những group và item mà user có quyền xem
  const allowedNavItems = navItems
    .map((group) => {
      // Lọc các item con bên trong từng section
      const filteredItems = group.items.filter((item) => item.roles.includes(userRole));
      return { ...group, items: filteredItems };
    })
    // Bỏ đi những section trống (ví dụ Staff sẽ bị rỗng nguyên section "Quản lý nhân sự")
    .filter((group) => group.items.length > 0);

  // Xử lý đăng xuất từ Sidebar
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Users size={18} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">HRM System</span>
          <span className="sidebar-logo-subtitle">Quản lý nhân sự</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {allowedNavItems.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-title">{group.section}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="nav-icon" size={18} />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Nút cài đặt (Chỉ Admin thấy) */}
        {userRole === 'Admin' && (
          <div className="nav-item" title={isSidebarCollapsed ? 'Cài đặt' : undefined}>
            <Settings size={18} />
            <span className="nav-label">Cài đặt</span>
          </div>
        )}
        
        {/* Nút Đăng xuất */}
        <div 
          className="nav-item" 
          style={{ color: 'var(--color-danger)', cursor: 'pointer' }} 
          title={isSidebarCollapsed ? 'Đăng xuất' : undefined}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="nav-label">Đăng xuất</span>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div style={{ padding: '0 var(--space-3) var(--space-3)' }}>
        <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
          <span className="nav-label">Thu gọn</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;