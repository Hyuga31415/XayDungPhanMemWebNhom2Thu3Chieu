import React from 'react';

// ============================================================
// Badge Component
// ============================================================

const variants = {
  success: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', dot: '#10b981' },
  warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', dot: '#f59e0b' },
  danger:  { bg: 'var(--color-danger-bg)',  color: 'var(--color-danger)',  dot: '#ef4444' },
  info:    { bg: 'var(--color-info-bg)',    color: 'var(--color-info)',    dot: '#3b82f6' },
  default: { bg: 'rgba(255,255,255,0.08)',  color: 'var(--text-secondary)', dot: '#6b6b85' },
  brand:   { bg: 'rgba(99,102,241,0.15)',   color: 'var(--brand-primary)', dot: '#6366f1' },
};

// Ánh xạ trực tiếp từ ENUM trong HRM.sql
// employees.status ENUM('Active', 'Resigned')
export const STATUS_MAP = {
  Active:   { variant: 'success', label: 'Đang làm' },
  Resigned: { variant: 'danger',  label: 'Đã nghỉ'  },
  // Giữ lại lowercase để backward compat nếu cần
  active:   { variant: 'success', label: 'Đang làm' },
  on_leave: { variant: 'warning', label: 'Nghỉ phép' },
  inactive: { variant: 'danger',  label: 'Đã nghỉ'  },
};

export function Badge({ variant = 'default', children, dot = true, size = 'sm' }) {
  const v = variants[variant] || variants.default;
  const sz = size === 'sm' ? '11px' : '13px';

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: 'var(--radius-full)',
        fontSize: sz, fontWeight: 600,
        background: v.bg, color: v.color,
        letterSpacing: '0.02em', whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%', background: v.dot, flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
