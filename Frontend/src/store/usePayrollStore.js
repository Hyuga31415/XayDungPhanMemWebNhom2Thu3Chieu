import { create } from 'zustand';
import payrollService from '../api/payrollService';

const usePayrollStore = create((set, get) => ({
  payrolls: [],
  history: [],
  currentDetail: null,
  isLoading: false,
  isRunning: false,

  fetchPayrolls: async () => {
    set({ isLoading: true });
    try {
      const res = await payrollService.getAll();
      const dataList = Array.isArray(res) ? res : (res?.data || []);
      const mapped = dataList.map((d) => ({
        id: `PR-${d.id}`,
        dbId: d.id, // Giữ ID thực tế của database để routing
        name: d.name,
        emp_code: d.emp_code,
        period: `${String(d.month).padStart(2, '0')}/${d.year}`,
        netSalary: d.net_salary,
        status: d.status === 'Draft' ? 'Chờ duyệt' : d.status
      }));
      set({ payrolls: mapped, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await payrollService.getHistory();
      const dataList = Array.isArray(res) ? res : (res?.data || []);
      set({ history: dataList, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchDetail: async (id) => {
    set({ isLoading: true, currentDetail: null });
    try {
      const res = await payrollService.getDetail(id);
      set({ currentDetail: res, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  runPayroll: async (month, year) => {
    set({ isRunning: true });
    try {
      await payrollService.run(month, year);
      await get().fetchPayrolls(); 
      set({ isRunning: false });
      return true;
    } catch (error) {
      set({ isRunning: false });
      throw error;
    }
  }
}));

export default usePayrollStore;