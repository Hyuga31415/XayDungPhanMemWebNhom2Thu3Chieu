import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================================
// Table Component
// ============================================================

export function Table({ columns, data, loading, emptyText = 'Không có dữ liệu', rowKey = 'id' }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
        <thead>
          <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '12px 16px',
                  textAlign: col.align || 'left',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  width: col.width,
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '48px 16px', textAlign: 'center' }}>
                <span style={{
                  display: 'inline-block', width: 28, height: 28,
                  border: '3px solid var(--border-normal)',
                  borderTopColor: 'var(--brand-primary)',
                  borderRadius: '50%', animation: 'spin 0.75s linear infinite',
                }} />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row[rowKey]}
                style={{
                  borderBottom: rowIdx < data.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background var(--transition-fast)',
                  animation: `fadeIn 200ms ease ${rowIdx * 30}ms both`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-glass-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '12px 16px',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-primary)',
                      textAlign: col.align || 'left',
                      maxWidth: col.maxWidth,
                      overflow: col.maxWidth ? 'hidden' : undefined,
                      textOverflow: col.maxWidth ? 'ellipsis' : undefined,
                      whiteSpace: col.maxWidth ? 'nowrap' : undefined,
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Pagination ──────────────────────────────────────────────
export function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-4)', flexWrap: 'wrap', gap: 12 }}>
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
        Hiển thị <strong style={{ color: 'var(--text-primary)' }}>{start}–{end}</strong> / {total} kết quả
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <PageBtn disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={14} />
        </PageBtn>
        {pages.map((p) => (
          <PageBtn key={p} active={p === page} onClick={() => onPageChange(p)}>{p}</PageBtn>
        ))}
        <PageBtn disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={14} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: 'var(--radius-md)',
        border: active ? 'none' : '1px solid var(--border-subtle)',
        background: active ? 'var(--brand-gradient)' : 'var(--bg-elevated)',
        color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontSize: 'var(--font-size-sm)', fontWeight: active ? 700 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all var(--transition-fast)',
        opacity: disabled ? 0.4 : 1,
        boxShadow: active ? 'var(--shadow-brand)' : undefined,
      }}
    >
      {children}
    </button>
  );
}

export default Table;
