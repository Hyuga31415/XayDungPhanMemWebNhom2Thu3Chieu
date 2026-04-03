import { create } from 'zustand';
import { departmentService } from '../api/departmentService';
import toast from 'react-hot-toast';

const useDepartmentStore = create((set, get) => ({
  departments: [],
  isLoading: false,
  isSubmitting: false,

  fetchDepartments: async () => {
    set({ isLoading: true });
    try {
      const data = await departmentService.getAll();
      set({ departments: data, isLoading: false });
    } catch (err) {
      toast.error(err.message || 'Lỗi khi tải danh sách phòng ban');
      set({ isLoading: false });
    }
  },

  createDepartment: async (data) => {
    set({ isSubmitting: true });
    try {
      await departmentService.create(data);
      toast.success('Thêm phòng ban thành công!');
      get().fetchDepartments();
      return true;
    } catch (err) {
      toast.error(err.message || 'Lỗi khi thêm phòng ban');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateDepartment: async (id, data) => {
    set({ isSubmitting: true });
    try {
      await departmentService.update(id, data);
      toast.success('Cập nhật phòng ban thành công!');
      get().fetchDepartments();
      return true;
    } catch (err) {
      toast.error(err.message || 'Lỗi khi cập nhật phòng ban');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteDepartment: async (id) => {
    try {
      await departmentService.delete(id);
      toast.success('Đã xóa phòng ban');
      get().fetchDepartments();
    } catch (err) {
      toast.error(err.message || 'Lỗi khi xóa phòng ban');
    }
  },
}));

export default useDepartmentStore;
