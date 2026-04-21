import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

function PositionFormModal({ isOpen, onClose, onSubmit, position, isSubmitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (position) {
      reset({ title: position.title });
    } else {
      reset({ title: '' });
    }
  }, [position, isOpen, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const title = position ? 'Chỉnh sửa chức vụ' : 'Thêm chức vụ mới';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={position ? `Cập nhật thông tin chức vụ "${position.title}"` : 'Thêm chức vụ cho hệ thống HRM'}
      width={480}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
          <Button type="submit" form="position-form" loading={isSubmitting} icon={Briefcase}>
            {position ? 'Cập nhật' : 'Thêm chức vụ'}
          </Button>
        </>
      )}
    >
      <form id="position-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          label="Tên chức vụ"
          icon={Briefcase}
          required
          placeholder="Trưởng phòng Kế toán"
          error={errors.title?.message}
          {...register('title', {
            required: 'Vui lòng nhập tên chức vụ',
            minLength: { value: 2, message: 'Tên chức vụ tối thiểu 2 ký tự' },
          })}
        />
      </form>
    </Modal>
  );
}

export default PositionFormModal;