import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
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
};

function Header() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: 'HRM', subtitle: '' };

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

        {/* User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div className="header-avatar">HR</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Admin
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              HR Manager
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
