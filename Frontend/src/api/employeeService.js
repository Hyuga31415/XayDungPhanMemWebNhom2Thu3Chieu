import axiosClient from './axiosClient';

// Helper tạo Avatar từ Tên (Do backend đang trả về 'NA')
const makeAvatar = (fullName = '') => {
  if (!fullName || fullName === 'NA') return 'NV';
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

// Hàm xử lý data trả về từ BE trước khi đưa vào store/UI
const processEmployeeData = (emp) => ({
  ...emp,
  avatar: emp.avatar === 'NA' ? makeAvatar(emp.fullName || emp.full_name) : emp.avatar,
});

// Hàm format payload gửi lên BE (Map đúng tên biến BE cần: fullName, department_id, position_id)
const formatPayload = (data) => {
  return {
    ...data,
    fullName: data.full_name || data.fullName, // Backend destructure 'fullName'
    department_id: Number(data.department_id),
    position_id: Number(data.position_id),
    change_reason: data.change_reason || undefined,
  };
};

export const employeeService = {
  // 1. Lấy danh sách nhân viên (có phân trang, filter)
  getAll: async (params = {}) => {
    const res = await axiosClient.get('/employees', { params });
    // axiosClient đã tự return response.data ở interceptor
    // Dữ liệu BE trả về có dạng: { data: [...], total, page, totalPages }
    return {
      ...res,
      data: (res.data || []).map(processEmployeeData),
    };
  },

  // 2. Lấy chi tiết 1 nhân viên
  getById: async (id) => {
    const res = await axiosClient.get(`/employees/${id}`);
    return processEmployeeData(res);
  },

  // 3. Thêm nhân viên
  create: async (data) => {
    const payload = formatPayload(data);
    const res = await axiosClient.post('/employees', payload);
    return res; 
  },

  // 4. Cập nhật nhân viên
  update: async (id, data) => {
    const payload = formatPayload(data);
    const res = await axiosClient.put(`/employees/${id}`, payload);
    return res;
  },

  // 5. Xóa nhân viên
  delete: async (id) => {
    return await axiosClient.delete(`/employees/${id}`);
  },

  // 6. Lấy thống kê Dashboard
  getStats: async () => {
    // Trả về thẳng object thống kê từ Backend
    return await axiosClient.get('/employees/stats');
  },

  // 7. Lấy danh sách chức vụ (Positions) dùng cho Select box
  getPositions: async () => {
    return await axiosClient.get('/positions');
  },

  // 8. Lấy lịch sử công tác theo nhân viên
  getJobHistory: async (id) => {
    return await axiosClient.get(`/employees/${id}/job-history`);
  },

  // 9. Lấy danh sách hợp đồng theo nhân viên
  getContracts: async (id) => {
    return await axiosClient.get(`/employees/${id}/contracts`);
  },
};

export default employeeService;