import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Pencil, Trash2, RefreshCw, Users } from 'lucide-react';
import usePositionStore from '../../store/usePositionStore';
import useUIStore from '../../store/useUIStore';
import Button from '../../components/ui/Button';
import PositionFormModal from './PositionFormModal';

function PositionListPage() {
  const {
    positions,
    isLoading,
    isSubmitting,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
  } = usePositionStore();

  const { openConfirm } = useUIStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const openAdd = () => {
    setEditingPosition(null);
    setModalOpen(true);
  };

  const openEdit = (position) => {
    setEditingPosition(position);
    setModalOpen(true);
  };

  const handleDelete = (position) => {
    openConfirm({
      title: 'Xóa chức vụ',
      message: `Bạn có chắc muốn xóa chức vụ "${position.title}"?`,
      onConfirm: () => deletePosition(position.id),
    });
  };

  const handleFormSubmit = async (data) => {
    const success = editingPosition
      ? await updatePosition(editingPosition.id, data)
      : await createPosition(data);

    if (success) setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
            <Briefcase size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Quản lý chức vụ</h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{positions.length} chức vụ trong hệ thống</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchPositions} size="sm">Làm mới</Button>
          <Button icon={Plus} onClick={openAdd}>Thêm chức vụ</Button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span style={{ width: 32, height: 32, border: '3px solid var(--border-normal)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%' }} className="animate-spin" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Tên chức vụ</th>
                  <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Nhân viên</th>
                  <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Ngày tạo</th>
                  <th style={{ textAlign: 'center', padding: 12, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: 12, borderBottom: '1px dashed var(--border-subtle)' }}>{item.id}</td>
                    <td style={{ padding: 12, borderBottom: '1px dashed var(--border-subtle)', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</td>
                    <td style={{ padding: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Users size={13} /> {item.employeeCount || 0}
                      </span>
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px dashed var(--border-subtle)' }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px dashed var(--border-subtle)', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button onClick={() => openEdit(item)} style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--brand-primary)', cursor: 'pointer' }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(item)} style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--color-danger)', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {positions.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      Chưa có chức vụ nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PositionFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        position={editingPosition}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default PositionListPage;