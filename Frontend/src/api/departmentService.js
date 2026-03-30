import axiosClient from './axiosClient';

const USE_MOCK = true;

// ============================================================
// Mock data ánh xạ từ HRM.sql – bảng departments
// ============================================================

let mockDepartments = [
  {
    id: 1, name: 'Ban Giám Đốc',
    code: 'BOD',
    manager_id: 1, managerName: 'Nguyễn Văn A',
    status: 1,
    description: 'Điều hành và định hướng chiến lược công ty',
    employeeCount: 1,
    createdAt: '2020-01-01',
  },
  {
    id: 2, name: 'Phòng Nhân Sự',
    code: 'HR',
    manager_id: 2, managerName: 'Trần Thị B',
    status: 1,
    description: 'Quản lý nguồn nhân lực, tuyển dụng và phúc lợi',
    employeeCount: 2,
    createdAt: '2021-03-15',
  },
  {
    id: 3, name: 'Phòng Công Nghệ Thông Tin',
    code: 'IT',
    manager_id: 3, managerName: 'Lê Văn C',
    status: 1,
    description: 'Phát triển phần mềm và hạ tầng công nghệ',
    employeeCount: 3,
    createdAt: '2021-06-01',
  },
];

let nextDeptId = 4;
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const departmentService = {
  getAll: async () => {
    if (USE_MOCK) {
      await delay();
      return mockDepartments;
    }
    return axiosClient.get('/departments');
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(200);
      const dept = mockDepartments.find((d) => d.id === id);
      if (!dept) throw new Error('Không tìm thấy phòng ban');
      return dept;
    }
    return axiosClient.get(`/departments/${id}`);
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay();
      const newDept = {
        ...data,
        id: nextDeptId++,
        employeeCount: 0,
        status: 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      mockDepartments.push(newDept);
      return newDept;
    }
    return axiosClient.post('/departments', data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await delay();
      const idx = mockDepartments.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Không tìm thấy phòng ban');
      mockDepartments[idx] = { ...mockDepartments[idx], ...data };
      return mockDepartments[idx];
    }
    return axiosClient.put(`/departments/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      mockDepartments = mockDepartments.filter((d) => d.id !== id);
      return { success: true };
    }
    return axiosClient.delete(`/departments/${id}`);
  },
};

export default departmentService;
