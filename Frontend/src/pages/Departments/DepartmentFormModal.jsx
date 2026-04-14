import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Hash } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';

// ============================================================
// Department Form Modal - Đã lược bỏ dữ liệu MOCK
// ============================================================

function DepartmentFormModal({ isOpen, onClose, onSubmit, department, isSubmitting, managers }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        code: department.code,
        description: department.description,
        // Backend trả về managerId qua alias (d.manager_id AS managerId)
        manager_id: department.managerId || '', 
        status: department.status ?? 1,
      });
    } else {
      reset({ name: '', code: '', description: '', manager_id: '', status: 1 });
    }
  }, [department, isOpen, reset]);

  const handleFormSubmit = (data) => {
    // Chuyển data ra ngoài để Page xử lý submit lên API
    onSubmit(data);
  };

  const title = department ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={department ? `Cập nhật thông tin phòng ban "${department.name}"` : 'Thêm cơ cấu tổ chức mới'}
      width={520}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
          <Button type="submit" form="dept-form" loading={isSubmitting} icon={Building2}>
            {department ? 'Cập nhật' : 'Thêm phòng ban'}
          </Button>
        </>
      }
    >
      <form id="dept-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Tên phòng ban"
            icon={Building2}
            required
            placeholder="Phòng Kỹ thuật"
            error={errors.name?.message}
            {...register('name', { required: 'Vui lòng nhập tên phòng ban' })}
          />
          <Input
            label="Mã phòng ban"
            icon={Hash}
            required
            placeholder="TECH"
            error={errors.code?.message}
            {...register('code', {
              required: 'Vui lòng nhập mã phòng ban',
              pattern: { value: /^[A-Z0-9_]+$/, message: 'Chỉ dùng chữ hoa, số và gạch dưới' },
            })}
          />
          <Select
            label="Trưởng phòng"
            {...register('manager_id')}
          >
            <option value="">-- Chưa có --</option>
            {/* managers được truyền từ DepartmentListPage (lấy từ store) */}
            {(managers || []).map((m) => (
              <option key={m.id} value={m.id}>{m.full_name || m.fullName}</option>
            ))}
          </Select>
          <Select label="Trạng thái" {...register('status')}>
            <option value={1}>Đang hoạt động</option>
            <option value={0}>Ngưng hoạt động</option>
          </Select>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Mô tả
            </label>
            <textarea
              placeholder="Mô tả chức năng..."
              rows={3}
              style={{
                width: '100%', padding: '9px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-normal)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                outline: 'none', resize: 'vertical',
              }}
              {...register('description')}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default DepartmentFormModal;