import React, { useEffect, useState } from 'react';
import { Plus, Building2, Users, Pencil, Trash2, RefreshCw, User } from 'lucide-react';
import useDepartmentStore from '../../store/useDepartmentStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import useUIStore from '../../store/useUIStore';
import Button from '../../components/ui/Button';
import DepartmentFormModal from './DepartmentFormModal';

// ============================================================
// Department List Page – Card Grid Layout
// ============================================================

const DEPT_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #14b8a6, #06b6d4)',
];

function DepartmentCard({ dept, index, onEdit, onDelete }) {
  const gradient = DEPT_GRADIENTS[index % DEPT_GRADIENTS.length];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: 'var(--space-6)',
        transition: 'all var(--transition-base)',
        cursor: 'default',
        transform: hovered ? 'translateY(-3px)' : undefined,
        boxShadow: hovered ? 'var(--shadow-lg)' : undefined,
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-lg)',
            background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
          }}>
            <Building2 size={20} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {dept.name}
            </h3>
            <span style={{
              fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)',
              background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}>
              {dept.code}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onEdit(dept)}
            style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          ><Pencil size={12} /></button>
          <button
            onClick={() => onDelete(dept)}
            style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          ><Trash2 size={12} /></button>
        </div>
      </div>

      {/* Description */}
      {dept.description && (
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
          {dept.description}
        </p>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={13} color="var(--brand-primary)" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{dept.employeeCount}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Nhân viên</p>
          </div>
        </div>
      </div>

      {/* Manager */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 'var(--radius-md)',
          background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {dept.managerName ? dept.managerName.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase() : '?'}
        </div>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Trưởng phòng</p>
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {dept.managerName || 'Chưa có'}
          </p>
        </div>
      </div>

      {/* Progress bar mimicking headcount */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Headcount</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dept.employeeCount} / 10</span>
        </div>
        <div style={{ height: 4, borderRadius: 'var(--radius-full)', background: 'var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 'var(--radius-full)',
            background: gradient,
            width: `${Math.min((dept.employeeCount / 10) * 100, 100)}%`,
            transition: 'width var(--transition-slow)',
          }} />
        </div>
      </div>
    </div>
  );
}

function DepartmentListPage() {
  const { departments, isLoading, isSubmitting, fetchDepartments, createDepartment, updateDepartment, deleteDepartment } = useDepartmentStore();
  const { employees } = useEmployeeStore();
  const { openConfirm } = useUIStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  useEffect(() => { fetchDepartments(); }, []);

  const openAdd = () => { setEditingDept(null); setModalOpen(true); };
  const openEdit = (dept) => { setEditingDept(dept); setModalOpen(true); };

  const handleDelete = (dept) => {
    openConfirm({
      title: 'Xóa phòng ban',
      message: `Bạn có chắc muốn xóa phòng ban "${dept.name}"? Tất cả nhân viên trong phòng ban sẽ bị ảnh hưởng.`,
      onConfirm: () => deleteDepartment(dept.id),
    });
  };

  const handleFormSubmit = async (data) => {
    const success = editingDept
      ? await updateDepartment(editingDept.id, data)
      : await createDepartment(data);
    if (success) setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(6,182,212,0.3)' }}>
            <Building2 size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Cơ cấu phòng ban</h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{departments.length} phòng ban đang hoạt động</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchDepartments} size="sm">Làm mới</Button>
          <Button icon={Plus} onClick={openAdd} style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 16px rgba(6,182,212,0.3)' }}>
            Thêm phòng ban
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Tổng phòng ban', value: departments.length, color: 'var(--brand-primary)' },
          { label: 'Tổng nhân viên', value: departments.reduce((s, d) => s + d.employeeCount, 0), color: 'var(--color-success)' },
          { label: 'Phòng lớn nhất', value: Math.max(...departments.map((d) => d.employeeCount), 0), color: 'var(--color-warning)' },
        ].map((item) => (
          <div key={item.label} className="glass-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: item.color }}>{item.value}</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <span style={{ width: 32, height: 32, border: '3px solid var(--border-normal)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%' }} className="animate-spin" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          {departments.map((dept, i) => (
            <DepartmentCard key={dept.id} dept={dept} index={i} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <DepartmentFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        department={editingDept}
        isSubmitting={isSubmitting}
        managers={employees}
      />
    </div>
  );
}

export default DepartmentListPage;
