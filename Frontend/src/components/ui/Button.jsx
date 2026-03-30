import React from 'react';

// ============================================================
// Button Component
// ============================================================

const sizeMap = {
  sm: { padding: '6px 12px', fontSize: '12px', height: '30px', iconSize: 14 },
  md: { padding: '8px 18px', fontSize: '13px', height: '36px', iconSize: 16 },
  lg: { padding: '10px 24px', fontSize: '15px', height: '42px', iconSize: 18 },
};

const variantStyles = {
  primary: {
    background: 'var(--brand-gradient)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--shadow-brand)',
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-normal)',
  },
  danger: {
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    border: '1px solid #ef444440',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
  },
  success: {
    background: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    border: '1px solid #10b98140',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style,
  ...props
}) {
  const sz = sizeMap[size];
  const vs = variantStyles[variant] || variantStyles.primary;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: sz.padding,
    height: sz.height,
    fontSize: sz.fontSize,
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.55 : 1,
    transition: 'all var(--transition-fast)',
    width: fullWidth ? '100%' : undefined,
    fontFamily: 'var(--font-family)',
    whiteSpace: 'nowrap',
    ...vs,
    ...style,
  };

  return (
    <button
      type={type}
      style={baseStyle}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.filter = 'brightness(1.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'primary') e.currentTarget.style.boxShadow = 'var(--shadow-brand-lg)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = '';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = vs.boxShadow || '';
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: sz.iconSize, height: sz.iconSize, border: '2px solid currentColor',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
          }}
        />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={sz.iconSize} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={sz.iconSize} />}
    </button>
  );
}

export default Button;
