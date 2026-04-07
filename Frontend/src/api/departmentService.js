import axiosClient, { isMockMode } from './axiosClient';
import { departments, employees } from './hrmData';

const USE_MOCK = false;
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));
let mockDepartments = departments.map((d) => ({ ...d }));
let nextDeptId = Math.max(...mockDepartments.map((d) => d.id), 0) + 1;

const toUiDepartment = (dept) => {
  const manager = employees.find((e) => e.id === dept.manager_id);
  const employeeCount = employees.filter((e) => e.department_id === dept.id).length;
  return {
    ...dept,
    managerId: dept.manager_id || '',
    managerName: manager?.full_name || 'Chua co',
    employeeCount,
    code: dept.name
      .split(' ')
      .map((w) => w[0] || '')
      .join('')
      .toUpperCase(),
    description: dept.description || '',
  };
};

export const departmentService = {
  getAll: async () => {
    if (USE_MOCK) {
      await delay();
      return mockDepartments.map(toUiDepartment);
    }
    const res = await axiosClient.get('/departments');
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return list.map(toUiDepartment);
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(200);
      const dept = mockDepartments.find((d) => d.id === id);
      if (!dept) throw new Error('Không tìm thấy phòng ban');
      return toUiDepartment(dept);
    }
    const res = await axiosClient.get(`/departments/${id}`);
    return toUiDepartment(res?.data || res);
  },

  create: async (data) => {
    const payload = {
      name: data.name,
      manager_id: data.manager_id ? Number(data.manager_id) : null,
      status: Number(data.status || 1),
      description: data.description || '',
    };
    if (USE_MOCK) {
      await delay();
      const newDept = {
        id: nextDeptId++,
        ...payload,
      };
      mockDepartments.push(newDept);
      return toUiDepartment(newDept);
    }
    const res = await axiosClient.post('/departments', payload);
    return toUiDepartment(res?.data || res);
  },

  update: async (id, data) => {
    const payload = {
      name: data.name,
      manager_id: data.manager_id ? Number(data.manager_id) : null,
      status: Number(data.status || 1),
      description: data.description || '',
    };
    if (USE_MOCK) {
      await delay();
      const idx = mockDepartments.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Không tìm thấy phòng ban');
      mockDepartments[idx] = { ...mockDepartments[idx], ...payload };
      return toUiDepartment(mockDepartments[idx]);
    }
    const res = await axiosClient.put(`/departments/${id}`, payload);
    return toUiDepartment(res?.data || res);
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
