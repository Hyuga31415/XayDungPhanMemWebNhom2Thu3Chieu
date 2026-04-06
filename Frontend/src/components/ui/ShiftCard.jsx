import React from 'react';
import { Clock, Trash2, Copy } from 'lucide-react';

export function ShiftCard({ shift, shiftType, onEdit, onDelete, onMarkOvertime }) {
  if (!shiftType) return null;

  return (
    <div
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-glass-hover)';
        e.currentTarget.style.borderColor = 'var(--border-normal)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-glass)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div style={{ flex: 1 }}>
        <h6 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
          {shift.employeeName}
        </h6>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: shiftType.color,
            }}
          />
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            {shiftType.name} ({shiftType.startTime} - {shiftType.endTime})
          </span>
        </div>
        {shift.isOvertime && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            <span style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }}>
              Tăng ca
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button
          onClick={() => onMarkOvertime?.(shift.id, !shift.isOvertime)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-xs)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-warning-bg)';
            e.currentTarget.style.color = 'var(--color-warning)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-elevated)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          OT
        </button>
        <button
          onClick={() => onEdit?.(shift)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-glass-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-elevated)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Copy size={14} />
        </button>
        <button
          onClick={() => onDelete?.(shift.id)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--color-danger)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-danger-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-elevated)';
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
