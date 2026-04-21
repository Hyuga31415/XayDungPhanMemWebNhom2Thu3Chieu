import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

export function ShiftForm({ shiftTypes, onSubmit, employees, initialData = null }) {
  const [selectedEmployee, setSelectedEmployee] = useState(initialData?.employeeId || '');
  const [selectedShift, setSelectedShift] = useState(initialData?.shiftId || '');
  const [selectedDate, setSelectedDate] = useState(initialData?.date || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedShift || !selectedDate) {
      alert('Vui lòng điền đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const employee = employees.find((e) => e.id === parseInt(selectedEmployee));
      onSubmit({
        employeeId: parseInt(selectedEmployee),
        employeeName: employee?.name,
        shiftId: parseInt(selectedShift),
        date: selectedDate,
      });
      setSelectedEmployee('');
      setSelectedShift('');
      setSelectedDate('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
          Nhân viên
        </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            cursor: 'pointer',
          }}
        >
          <option value="">Chọn nhân viên</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
          Ca làm việc
        </label>
        <select
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            cursor: 'pointer',
          }}
        >
          <option value="">Chọn ca</option>
          {shiftTypes.map((shift) => (
            <option key={shift.id} value={shift.id}>
              {shift.name} ({shift.startTime} - {shift.endTime})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
          Ngày làm
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        />
      </div>

      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Phân ca'}
      </Button>
    </form>
  );
}
