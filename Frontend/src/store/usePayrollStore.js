import { create } from 'zustand';
import payrollService from '../api/payrollService';

const usePayrollStore = create((set, get) => ({
  payrolls: [],
  isLoading: false,
  isRunning: false,

  fetchPayrolls: async () => {
    set({ isLoading: true });
    try {
      const res = await payrollService.getAll();
      
      // Xử lý an toàn: Đảm bảo lấy đúng mảng dữ liệu dù Backend trả về dạng nào
      const dataList = Array.isArray(res) ? res : (res?.data || []);
      
      const mapped = dataList.map((d) => ({
        id: `PR-${d.id}`,
        name: d.name,
        emp_code: d.emp_code,
        period: `${String(d.month).padStart(2, '0')}/${d.year}`,
        netSalary: d.net_salary,
        status: d.status === 'Draft' ? 'Chờ duyệt' : d.status
      }));

      set({ payrolls: mapped, isLoading: false });
    } catch (error) {
      console.error('Lỗi fetch payrolls:', error);
      set({ isLoading: false });
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