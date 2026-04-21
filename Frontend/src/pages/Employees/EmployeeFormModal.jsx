import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Calendar } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import useDepartmentStore from '../../store/useDepartmentStore';
import { employeeService } from '../../api/employeeService'; // Import service để gọi API

// ============================================================
// Employee Form Modal – Gọi 100% dữ liệu thật
// ============================================================

const STATUS_OPTIONS = [
  { value: 'Active',   label: 'Đang làm' },
  { value: 'Resigned', label: 'Đã nghỉ'  },
];

const GENDER_OPTIONS = [
  { value: 'male',   label: 'Nam' },
  { value: 'female', label: 'Nữ'  },
];

function EmployeeFormModal({ isOpen, onClose, onSubmit, employee, isSubmitting }) {
  const { departments, fetchDepartments } = useDepartmentStore();
  
  // State quản lý danh sách chức vụ gọi từ API
  const [positions, setPositions] = useState([]);

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm();

  // Gọi API lấy departments và positions khi modal mở lần đầu
  useEffect(() => {
    fetchDepartments();
    const fetchPositions = async () => {
      try {
        const data = await employeeService.getPositions();
        setPositions(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chức vụ:', error);
      }
    };
    fetchPositions();
  }, []);

  // Cập nhật giá trị form khi prop `employee` thay đổi (Edit mode)
  useEffect(() => {
    if (employee) {
      reset({
        full_name:     employee.full_name || employee.fullName,
        email:         employee.email,
        gender:        employee.gender || 'male',
        department_id: employee.department_id,
        position_id:   employee.position_id,
        hire_date:     employee.hire_date,
        status:        employee.status,
      });
    } else {
      reset({
        full_name: '', email: '', gender: 'male',
        department_id: '', position_id: '', hire_date: '', status: 'Active',
      });
    }
  }, [employee, isOpen, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data); // Chuyển thẳng data ra ngoài page xử lý. Payload formatting đã được lo bên employeeService.js
  };

  const isEdit = !!employee;
  const title    = isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới';
  const subtitle = isEdit
    ? `Cập nhật thông tin cho ${employee.full_name || employee.fullName} (${employee.emp_code})`
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

          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              label="Họ và tên"
              icon={User}
              required
              placeholder="Nguyễn Văn A"
              error={errors.full_name?.message}
              {...register('full_name', {
                required: 'Vui lòng nhập họ tên',
                minLength: { value: 2, message: 'Ít nhất 2 ký tự' },
              })}
            />
          </div>

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

          <Select label="Giới tính" {...register('gender')}>
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>

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

          <Select
            label="Chức vụ"
            required
            error={errors.position_id?.message}
            {...register('position_id', { required: 'Vui lòng chọn chức vụ' })}
          >
            <option value="">-- Chọn chức vụ --</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </Select>

          <div style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--text-muted)' }}>
            Lương cơ bản hiện được quản lý theo hợp đồng riêng của từng nhân viên.
          </div>

          <Input
            label="Ngày vào làm"
            icon={Calendar}
            required
            type="date"
            error={errors.hire_date?.message}
            {...register('hire_date', { required: 'Vui lòng chọn ngày vào làm' })}
          />

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