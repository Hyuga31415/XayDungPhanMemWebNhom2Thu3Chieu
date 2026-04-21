import axiosClient from './axiosClient';

export const payrollService = {
  // Lấy danh sách lương (Dành cho màn hình quản lý)
  getAll: async () => {
    return await axiosClient.get('/payroll');
  },
  
  // Chạy chốt lương
  run: async (month, year) => {
    return await axiosClient.post('/payroll/run', { month, year });
  },

  // Lấy lịch sử (Aggregate cho Admin, Cá nhân cho Staff)
  getHistory: async () => {
    return await axiosClient.get('/payroll/history');
  },

  // Lấy chi tiết 1 phiếu lương cụ thể
  getDetail: async (id) => {
    return await axiosClient.get(`/payroll/${id}`);
  }
};

export default payrollService;