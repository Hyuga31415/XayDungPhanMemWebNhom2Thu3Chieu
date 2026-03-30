import React, { forwardRef } from 'react';

// ============================================================
// Input Component
// ============================================================

export const Input = forwardRef(function Input(
  { label, error, icon: Icon, suffix, hint, required, containerStyle, ...props },
  ref
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <span style={{
            position: 'absolute', left: 12,
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <Icon size={15} />
          </span>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: Icon ? '9px 12px 9px 36px' : '9px 12px',
            paddingRight: suffix ? 36 : 12,
            background: 'var(--bg-elevated)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-normal)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family)',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--border-focus)';
            e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-normal)';
            e.target.style.boxShadow = '';
          }}
          {...props}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 12, color: 'var(--text-muted)', fontSize: 13 }}>
            {suffix}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: 11, color: 'var(--color-danger)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, required, containerStyle, children, ...props },
  ref
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <select
        ref={ref}
        style={{
          width: '100%', padding: '9px 12px',
          background: 'var(--bg-elevated)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-normal)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-sm)',
          fontFamily: 'var(--font-family)',
          outline: 'none',
          cursor: 'pointer',
          transition: 'border-color var(--transition-fast)',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--border-focus)'; }}
        onBlur={(e) => { e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-normal)'; }}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 11, color: 'var(--color-danger)' }}>{error}</span>}
    </div>
  );
});

export default Input;
