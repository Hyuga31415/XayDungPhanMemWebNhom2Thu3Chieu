import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ChevronLeft, ChevronRight,
  Settings, LogOut, Briefcase, BarChart3, Clock, Calendar, Layers,
  Menu, Wallet,
} from 'lucide-react';
import useUIStore from '../../store/useUIStore';
import '../../styles/layout.css';

// ============================================================
// Sidebar Component
// ============================================================

const navItems = [
  {
    section: 'Tổng quan',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/analytics', icon: BarChart3, label: 'Phân tích' },
    ],
  },
  {
    section: 'Quản lý nhân sự',
    items: [
      { to: '/employees', icon: Users, label: 'Nhân viên' },
      { to: '/departments', icon: Building2, label: 'Phòng ban' },
      { to: '/positions', icon: Briefcase, label: 'Chức vụ' },
    ],
  },
  {
    section: 'Chấm công & Nghỉ phép',
    items: [
      { to: '/attendance', icon: Clock, label: 'Chấm công' },
      { to: '/leave-requests', icon: Calendar, label: 'Nghỉ phép' },
      { to: '/shifts', icon: Layers, label: 'Ca làm việc' },
    ],
  },
  {
    section: 'Payroll',
    items: [
      { to: '/payroll/management', icon: Wallet, label: 'Bang luong' },
      { to: '/payroll/history', icon: Wallet, label: 'Lich su luong' },
      { to: '/payroll/reports', icon: Wallet, label: 'Bao cao luong' },
      { to: '/payroll/settings', icon: Wallet, label: 'Cau hinh luong' },
      { to: '/payroll/detail', icon: Wallet, label: 'Chi tiet luong' },
    ],
  },
  {
    section: 'Payroll',
    items: [
      { to: '/payroll/management', icon: Wallet, label: 'Bang luong' },
      { to: '/payroll/history', icon: Wallet, label: 'Lich su luong' },
      { to: '/payroll/reports', icon: Wallet, label: 'Bao cao luong' },
      { to: '/payroll/settings', icon: Wallet, label: 'Cau hinh luong' },
      { to: '/payroll/detail', icon: Wallet, label: 'Chi tiet luong' },
    ],
  },
];

function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

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
        {navItems.map((group) => (
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
        <div className="nav-item" title={isSidebarCollapsed ? 'Cài đặt' : undefined}>
          <Settings size={18} />
          <span className="nav-label">Cài đặt</span>
        </div>
        <div className="nav-item" style={{ color: 'var(--color-danger)' }} title={isSidebarCollapsed ? 'Đăng xuất' : undefined}>
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
