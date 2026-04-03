import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Hash, AlignLeft, User } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';

// ============================================================
// Department Form Modal
// ============================================================

function DepartmentFormModal({ isOpen, onClose, onSubmit, department, isSubmitting, managers }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        code: department.code,
        description: department.description,
        managerId: department.managerId || '',
      });
    } else {
      reset({ name: '', code: '', description: '', managerId: '' });
    }
  }, [department, isOpen]);

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
      <form id="dept-form" onSubmit={handleSubmit(onSubmit)}>
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
              pattern: { value: /^[A-Z_]+$/, message: 'Chỉ dùng chữ hoa và dấu gạch dưới' },
            })}
          />
          <Select
            label="Trưởng phòng"
            {...register('managerId')}
          >
            <option value="">-- Chưa có --</option>
            {(managers || []).map((m) => (
              <option key={m.id} value={m.id}>{m.fullName}</option>
            ))}
          </Select>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Mô tả
            </label>
            <textarea
              placeholder="Mô tả chức năng và nhiệm vụ của phòng ban..."
              rows={3}
              style={{
                width: '100%', padding: '9px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-normal)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-family)',
                outline: 'none', resize: 'vertical',
                transition: 'border-color var(--transition-fast)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px #6366f11f'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-normal)'; e.target.style.boxShadow = ''; }}
              {...register('description')}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default DepartmentFormModal;
