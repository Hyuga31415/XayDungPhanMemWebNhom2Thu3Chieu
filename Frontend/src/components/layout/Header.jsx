import React, { useState } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import '../../styles/layout.css';

// ============================================================
// Header Component
// ============================================================

const PAGE_META = {
  '/dashboard':   { title: 'Dashboard',     subtitle: 'Tổng quan hệ thống nhân sự' },
  '/employees':   { title: 'Nhân viên',     subtitle: 'Quản lý danh sách nhân viên' },
  '/departments': { title: 'Phòng ban',     subtitle: 'Cơ cấu tổ chức doanh nghiệp' },
  '/positions':   { title: 'Chức vụ',      subtitle: 'Danh mục vị trí công việc' },
  '/analytics':   { title: 'Phân tích',    subtitle: 'Báo cáo và chỉ số nhân sự' },
  '/attendance':  { title: 'Chấm công',    subtitle: 'Quản lý thời gian làm việc' },
  '/leave-requests': { title: 'Nghỉ phép', subtitle: 'Yêu cầu và quản lý nghỉ phép' },
};

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const meta = PAGE_META[pathname] || { title: 'HRM', subtitle: '' };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header-breadcrumb">
        <span className="header-page-title">{meta.title}</span>
        <span className="header-page-subtitle">{meta.subtitle}</span>
      </div>

      <div className="header-actions">
        {/* Search trigger */}
        <button className="header-icon-btn" title="Tìm kiếm">
          <Search size={16} />
        </button>

        {/* Notifications */}
        <button className="header-icon-btn" title="Thông báo" style={{ position: 'relative' }}>
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--color-danger)',
            border: '1px solid var(--bg-surface)',
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

        {/* User Menu Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div className="header-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {user?.name || 'User'}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                {user?.role || 'Member'}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 'var(--space-2)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-normal)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              minWidth: '200px',
              zIndex: 100,
              overflow: 'hidden',
            }}>
              {/* User Info */}
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <p style={{
                  margin: 0,
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {user?.name || 'User'}
                </p>
                <p style={{
                  margin: '4px 0 0',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-muted)',
                }}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-glass)';
                  e.currentTarget.style.color = 'var(--color-danger)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
