import axiosClient from './axiosClient';

export const payrollService = {
  // Lấy danh sách lương
  getAll: async () => {
    return await axiosClient.get('/payroll');
  },
  
  // Chạy chốt lương
  run: async (month, year) => {
    return await axiosClient.post('/payroll/run', { month, year });
  }
};

export default payrollService;