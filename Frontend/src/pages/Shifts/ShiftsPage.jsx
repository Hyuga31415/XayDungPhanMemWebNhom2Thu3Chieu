import React, { useState, useMemo } from 'react';
import { Plus, Calendar } from 'lucide-react';
import useShiftsStore from '../../store/useShiftsStore';
import { ShiftCard } from '../../components/ui/ShiftCard';
import { ShiftForm } from '../../components/ui/ShiftForm';
import { ShiftSchedule } from '../../components/ui/ShiftSchedule';
import { Modal } from '../../components/ui/Modal';

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' },
  { id: 4, name: 'Phạm Văn D' },
  { id: 5, name: 'Hoàng Thị E' },
];

function ShiftsPage() {
  const { shifts, shiftTypes, assignShift, deleteShift, markOvertime, swapShift } = useShiftsStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [showForm, setShowForm] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [searchText, setSearchText] = useState('');

  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const matchSearch =
        shift.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        shift.date.includes(searchText);
      
      if (viewMode === 'month') {
        const shiftDate = new Date(shift.date);
        return (
          matchSearch &&
          shiftDate.getMonth() === currentDate.getMonth() &&
          shiftDate.getFullYear() === currentDate.getFullYear()
        );
      } else {
        const start = new Date(currentDate);
        start.setDate(start.getDate() - start.getDay());
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        const shiftDate = new Date(shift.date);
        return matchSearch && shiftDate >= start && shiftDate < end;
      }
    });
  }, [shifts, currentDate, viewMode, searchText]);

  const handleAssignShift = (data) => {
    assignShift(data.employeeId, data.employeeName, data.shiftId, data.date);
    setShowForm(false);
  };

  const handleSwapShift = (shift) => {
    setSelectedShift(shift);
  };

  return (
    <div className="shifts-page container py-4" style={{ maxWidth: '100%' }}>
      <div className="page-header">
        <h2 className="mb-1">Quản lý ca làm việc</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
          Tạo và quản lý các ca làm việc cho nhân viên
        </p>
      </div>

      <div className="row gy-3" style={{ marginTop: 'var(--space-5)' }}>
        {/* LEFT – Thông tin ca làm việc */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 className="mb-0">Các ca làm việc</h5>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-sm btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  <Plus size={14} />
                  Phân ca
                </button>
              </div>
            </div>
            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredShifts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-5)' }}>
                  Không có ca nào
                </div>
              ) : (
                filteredShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    shiftType={shiftTypes.find((s) => s.id === shift.shiftId)}
                    onEdit={(s) => {
                      setSelectedShift(s);
                      setShowForm(true);
                    }}
                    onDelete={deleteShift}
                    onMarkOvertime={markOvertime}
                  />
                ))
              )}
            </div>
          </div>

          {/* Định nghĩa ca làm việc */}
          <div className="card mt-3 shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Danh sách ca</h5>
            </div>
            <div className="card-body">
              {shiftTypes.map((shift) => (
                <div
                  key={shift.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: shift.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                      {shift.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                      {shift.startTime} - {shift.endTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT – Lịch làm việc */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 className="mb-0" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Calendar size={18} />
                  Lịch làm việc
                </h5>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    Tháng
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`btn btn-sm ${viewMode === 'week' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    Tuần
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <ShiftSchedule
                shifts={shifts}
                shiftTypes={shiftTypes}
                viewMode={viewMode}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
            </div>
          </div>

          {/* Tìm kiếm */}
          <div className="card mt-3 shadow-sm">
            <div className="card-body">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên nhân viên hoặc ngày..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Phân ca */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Phân ca làm việc" width={450}>
        <ShiftForm
          shiftTypes={shiftTypes}
          employees={MOCK_EMPLOYEES}
          onSubmit={handleAssignShift}
          initialData={selectedShift}
        />
      </Modal>
    </div>
  );
}

export default ShiftsPage;
