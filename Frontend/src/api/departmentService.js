import axiosClient from './axiosClient';

// Hàm format payload gửi lên BE
// Backend (departmentController) đang lấy: const { name, code, description, managerId, status } = req.body;
const formatPayload = (data) => {
  return {
    name: data.name,
    code: data.code,
    description: data.description || '',
    // Chuyển manager_id từ form thành managerId cho BE
    managerId: data.manager_id ? Number(data.manager_id) : null,
    status: Number(data.status || 1),
  };
};

export const departmentService = {
  // 1. Lấy danh sách phòng ban
  getAll: async () => {
    const res = await axiosClient.get('/departments');
    // axiosClient trả về response.data. BE trả về trực tiếp mảng array qua res.status(200).json(rows)
    return Array.isArray(res) ? res : res.data || [];
  },

  // 2. Lấy chi tiết 1 phòng ban
  getById: async (id) => {
    const res = await axiosClient.get(`/departments/${id}`);
    return res.data || res;
  },

  // 3. Thêm phòng ban mới
  create: async (data) => {
    const payload = formatPayload(data);
    const res = await axiosClient.post('/departments', payload);
    return res;
  },

  // 4. Cập nhật phòng ban
  update: async (id, data) => {
    const payload = formatPayload(data);
    const res = await axiosClient.put(`/departments/${id}`, payload);
    return res;
  },

  // 5. Xóa phòng ban
  delete: async (id) => {
    return await axiosClient.delete(`/departments/${id}`);
  },
};

export default departmentService;