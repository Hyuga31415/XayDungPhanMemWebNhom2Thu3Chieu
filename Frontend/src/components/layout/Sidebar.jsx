import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ChevronLeft, ChevronRight,
  Settings, LogOut, Briefcase, BarChart3, ShieldCheck
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
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo Area */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ShieldCheck size={22} color="white" strokeWidth={2.5} />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">HRM <span style={{ color: 'var(--brand-primary)' }}>Pro</span></span>
          <span className="sidebar-logo-subtitle">Enterprise Suite</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.section} style={{ marginBottom: 'var(--space-2)' }}>
            <div className="sidebar-section-title">{group.section}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="nav-icon" size={20} />
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <span>AD</span>
        </div>
        <div className="user-info">
          <span className="user-name">Adminstrator</span>
          <span className="user-role">HR Manager</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sidebar-footer">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={20} className="nav-icon" />
          <span className="nav-label">Cài đặt</span>
        </NavLink>
        
        <div 
          className="nav-item" 
          style={{ color: 'var(--color-danger)' }}
        >
          <LogOut size={20} className="nav-icon" style={{ color: 'inherit' }} />
          <span className="nav-label">Đăng xuất</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
