import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Briefcase, Calendar, Building2, DollarSign } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import useDepartmentStore from '../../store/useDepartmentStore';
import { mockPositions } from '../../api/employeeService';

// ============================================================
// Employee Form Modal – Add / Edit
// Ánh xạ từ HRM.sql schema:
//   emp_code, full_name, email, department_id, position_id, hire_date
//   status ENUM('Active', 'Resigned')
// ============================================================

// Status theo ENUM trong HRM.sql
const STATUS_OPTIONS = [
  { value: 'Active',   label: 'Đang làm' },
  { value: 'Resigned', label: 'Đã nghỉ'  },
];

const GENDER_OPTIONS = [
  { value: 'male',   label: 'Nam' },
  { value: 'female', label: 'Nữ'  },
];

function formatSalary(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ';
}

function EmployeeFormModal({ isOpen, onClose, onSubmit, employee, isSubmitting }) {
  const { departments, fetchDepartments } = useDepartmentStore();
  const [selectedPosition, setSelectedPosition] = useState(null);

  const {
    register, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm();

  useEffect(() => { fetchDepartments(); }, []);

  useEffect(() => {
    if (employee) {
      reset({
        fullName:      employee.fullName,
        email:         employee.email,
        gender:        employee.gender || 'male',
        department_id: employee.department_id,
        position_id:   employee.position_id,
        hire_date:     employee.hire_date,
        status:        employee.status,
      });
      setSelectedPosition(mockPositions.find((p) => p.id === employee.position_id) || null);
    } else {
      reset({
        fullName: '', email: '', gender: 'male',
        department_id: '', position_id: '', hire_date: '', status: 'Active',
      });
      setSelectedPosition(null);
    }
  }, [employee, isOpen]);

  // Khi đổi position → hiển thị mức lương tương ứng
  const watchedPositionId = watch('position_id');
  useEffect(() => {
    const pos = mockPositions.find((p) => p.id === Number(watchedPositionId));
    setSelectedPosition(pos || null);
  }, [watchedPositionId]);

  const handleFormSubmit = (data) => {
    const dept = departments.find((d) => d.id === Number(data.department_id));
    const pos  = mockPositions.find((p) => p.id === Number(data.position_id));
    onSubmit({
      ...data,
      department_id:  Number(data.department_id),
      departmentName: dept?.name || '',
      position_id:    Number(data.position_id),
      position:       pos?.title || '',
      base_salary:    pos?.base_salary || 0,
    });
  };

  const isEdit = !!employee;
  const title    = isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới';
  const subtitle = isEdit
    ? `Cập nhật thông tin cho ${employee.fullName} (${employee.emp_code})`
    : 'Điền đầy đủ thông tin nhân viên mới';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      width={620}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
          <Button
            type="submit"
            form="employee-form"
            loading={isSubmitting}
            icon={User}
          >
            {isEdit ? 'Cập nhật' : 'Thêm nhân viên'}
          </Button>
        </>
      }
    >
      <form id="employee-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>

          {/* Họ tên – span full */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              label="Họ và tên"
              icon={User}
              required
              placeholder="Nguyễn Văn A"
              error={errors.fullName?.message}
              {...register('fullName', {
                required: 'Vui lòng nhập họ tên',
                minLength: { value: 2, message: 'Ít nhất 2 ký tự' },
              })}
            />
          </div>

          {/* Email */}
          <Input
            label="Email"
            icon={Mail}
            required
            type="email"
            placeholder="nva@company.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Email không hợp lệ' },
            })}
          />

          {/* Giới tính */}
          <Select label="Giới tính" {...register('gender')}>
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>

          {/* Phòng ban – ánh xạ department_id */}
          <Select
            label="Phòng ban"
            required
            error={errors.department_id?.message}
            {...register('department_id', { required: 'Vui lòng chọn phòng ban' })}
          >
            <option value="">-- Chọn phòng ban --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>

          {/* Chức vụ – ánh xạ position_id từ bảng positions */}
          <Select
            label="Chức vụ"
            required
            error={errors.position_id?.message}
            {...register('position_id', { required: 'Vui lòng chọn chức vụ' })}
          >
            <option value="">-- Chọn chức vụ --</option>
            {mockPositions.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </Select>

          {/* Hiển thị mức lương từ position */}
          {selectedPosition && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <DollarSign size={15} color="var(--brand-primary)" />
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Mức lương cơ bản:
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {formatSalary(selectedPosition.base_salary)}
                </span>
              </div>
            </div>
          )}

          {/* Ngày vào làm – hire_date */}
          <Input
            label="Ngày vào làm (hire_date)"
            icon={Calendar}
            required
            type="date"
            error={errors.hire_date?.message}
            {...register('hire_date', { required: 'Vui lòng chọn ngày vào làm' })}
          />

          {/* Trạng thái – ENUM('Active', 'Resigned') */}
          <Select label="Trạng thái" {...register('status')}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
      </form>
    </Modal>
  );
}

export default EmployeeFormModal;
