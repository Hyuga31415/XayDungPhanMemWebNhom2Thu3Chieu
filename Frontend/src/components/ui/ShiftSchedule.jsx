import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export function ShiftSchedule({ shifts, shiftTypes, viewMode = 'month', currentDate, onDateChange }) {
  const days = useMemo(() => {
    if (viewMode === 'month') {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    }

    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d.getDate();
    });
  }, [currentDate, viewMode]);

  const getShiftsForDay = (day) => {
    if (!day) return [];
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;
    return shifts.filter((s) => s.date === dateStr);
  };

  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div style={{ padding: 'var(--space-4)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h5 style={{ color: 'var(--text-primary)', margin: 0 }}>
          {viewMode === 'month'
            ? currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
            : `Tuần ${Math.ceil(currentDate.getDate() / 7)}`}
        </h5>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              onDateChange?.(newDate);
            }}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              onDateChange?.(newDate);
            }}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-2)' }}>
        {dayLabels.map((label) => (
          <div
            key={label}
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              padding: 'var(--space-2)',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
        ))}

        {days.map((day, idx) => {
          const dayShifts = getShiftsForDay(day);
          return (
            <div
              key={idx}
              style={{
                background: day ? 'var(--bg-elevated)' : 'transparent',
                border: day ? '1px solid var(--border-subtle)' : 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2)',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {day && (
                <>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    {day}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {dayShifts.map((shift) => {
                      const shiftType = shiftTypes.find((s) => s.id === shift.shiftId);
                      return (
                        <div
                          key={shift.id}
                          style={{
                            background: shiftType?.color || 'var(--text-muted)',
                            color: '#fff',
                            padding: '4px 6px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-xs)',
                            lineHeight: 1.2,
                          }}
                        >
                          <div>{shift.employeeName}</div>
                          <div style={{ opacity: 0.8 }}>{shiftType?.name}</div>
                          {shift.isOvertime && <div style={{ fontWeight: 600 }}>OT</div>}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
