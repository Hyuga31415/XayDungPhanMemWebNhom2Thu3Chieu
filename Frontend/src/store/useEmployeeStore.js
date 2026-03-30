import { create } from 'zustand';
import { employeeService } from '../api/employeeService';
import toast from 'react-hot-toast';

// ============================================================
// Employee Store – Zustand
// ============================================================

const useEmployeeStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────
  employees: [],
  stats: null,
  total: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isSubmitting: false,
  filters: {
    search: '',
    departmentId: '',
    status: '',
  },
  limit: 8,

  // ── Actions ────────────────────────────────────────────────
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters }, currentPage: 1 });
    get().fetchEmployees();
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchEmployees();
  },

  fetchEmployees: async () => {
    set({ isLoading: true });
    try {
      const { filters, currentPage, limit } = get();
      const result = await employeeService.getAll({
        ...filters,
        page: currentPage,
        limit,
      });
      set({
        employees: result.data,
        total: result.total,
        totalPages: result.totalPages,
        isLoading: false,
      });
    } catch (err) {
      toast.error(err.message || 'Lỗi khi tải danh sách nhân viên');
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await employeeService.getStats();
      set({ stats });
    } catch (err) {
      console.error('fetchStats error:', err);
    }
  },

  createEmployee: async (data) => {
    set({ isSubmitting: true });
    try {
      await employeeService.create(data);
      toast.success('Thêm nhân viên thành công!');
      get().fetchEmployees();
      return true;
    } catch (err) {
      toast.error(err.message || 'Lỗi khi thêm nhân viên');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateEmployee: async (id, data) => {
    set({ isSubmitting: true });
    try {
      await employeeService.update(id, data);
      toast.success('Cập nhật nhân viên thành công!');
      get().fetchEmployees();
      return true;
    } catch (err) {
      toast.error(err.message || 'Lỗi khi cập nhật nhân viên');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteEmployee: async (id) => {
    try {
      await employeeService.delete(id);
      toast.success('Đã xóa nhân viên');
      get().fetchEmployees();
    } catch (err) {
      toast.error(err.message || 'Lỗi khi xóa nhân viên');
    }
  },
}));

export default useEmployeeStore;
