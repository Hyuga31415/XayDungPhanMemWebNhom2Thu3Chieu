import axiosClient, { isMockMode } from './axiosClient';
import { departments, employees, leaveRequests, positions } from './hrmData';

const USE_MOCK = false;
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

let mockEmployees = [...employees];
let nextEmpId = Math.max(...mockEmployees.map((e) => e.id), 0) + 1;

const getDepartmentName = (departmentId) =>
  departments.find((d) => d.id === Number(departmentId))?.name || '';

const getPosition = (positionId) =>
  positions.find((p) => p.id === Number(positionId)) || null;

const makeAvatar = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const toUiEmployee = (emp) => {
  const pos = getPosition(emp.position_id);
  return {
    ...emp,
    fullName: emp.full_name,
    departmentName: getDepartmentName(emp.department_id),
    position: pos?.title || '',
    base_salary: pos?.base_salary || 0,
    avatar: makeAvatar(emp.full_name),
  };
};

const toApiPayload = (data) => ({
  full_name: data.full_name || data.fullName,
  email: data.email,
  department_id: Number(data.department_id),
  position_id: Number(data.position_id),
  hire_date: data.hire_date,
  status: data.status || 'Active',
  gender: data.gender || 'male',
});

export const mockPositions = positions;

export const employeeService = {
  getAll: async (params = {}) => {
    if (USE_MOCK) {
      await delay();
      let data = [...mockEmployees];
      if (params.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (e) =>
            e.full_name.toLowerCase().includes(q) ||
            e.emp_code.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        );
      }
      if (params.departmentId) data = data.filter((e) => e.department_id === Number(params.departmentId));
      if (params.status) data = data.filter((e) => e.status === params.status);

      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 8;
      const total = data.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      return {
        data: data.slice(start, start + limit).map(toUiEmployee),
        total,
        page,
        totalPages,
      };
    }
    const res = await axiosClient.get('/employees', { params });
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return {
      data: list.map(toUiEmployee),
      total: res?.total || list.length,
      page: res?.page || 1,
      totalPages: res?.totalPages || 1,
    };
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(150);
      const emp = mockEmployees.find((e) => e.id === Number(id));
      if (!emp) throw new Error('Khong tim thay nhan vien');
      return toUiEmployee(emp);
    }
    const res = await axiosClient.get(`/employees/${id}`);
    return toUiEmployee(res?.data || res);
  },

  create: async (data) => {
    const payload = toApiPayload(data);
    if (USE_MOCK) {
      await delay();
      const newEmp = {
        id: nextEmpId++,
        emp_code: `EMP${String(nextEmpId - 1).padStart(3, '0')}`,
        ...payload,
      };
      mockEmployees.unshift(newEmp);
      return toUiEmployee(newEmp);
    }
    const res = await axiosClient.post('/employees', payload);
    return toUiEmployee(res?.data || res);
  },

  update: async (id, data) => {
    const payload = toApiPayload(data);
    if (USE_MOCK) {
      await delay();
      const idx = mockEmployees.findIndex((e) => e.id === Number(id));
      if (idx === -1) throw new Error('Khong tim thay nhan vien');
      mockEmployees[idx] = { ...mockEmployees[idx], ...payload };
      return toUiEmployee(mockEmployees[idx]);
    }
    const res = await axiosClient.put(`/employees/${id}`, payload);
    return toUiEmployee(res?.data || res);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await delay(200);
      mockEmployees = mockEmployees.filter((e) => e.id !== Number(id));
      return { success: true };
    }
    return axiosClient.delete(`/employees/${id}`);
  },

  getStats: async () => {
    if (USE_MOCK) {
      await delay(200);
      const total = mockEmployees.length;
      const active = mockEmployees.filter((e) => e.status === 'Active').length;
      const resigned = mockEmployees.filter((e) => e.status === 'Resigned').length;
      const newThisMonth = mockEmployees.filter((e) => e.hire_date >= '2024-03-01').length;
      return {
        total,
        active,
        resigned,
        newThisMonth,
        retentionRate: total ? ((active / total) * 100).toFixed(1) : '0.0',
        byDepartment: departments.map((d) => ({
          name: d.name,
          count: mockEmployees.filter((e) => e.department_id === d.id).length,
        })),
        byGender: [
          { name: 'Nam', value: mockEmployees.filter((e) => e.gender === 'male').length },
          { name: 'Nu', value: mockEmployees.filter((e) => e.gender === 'female').length },
        ],
        recruitmentTrend: [
          { month: '2024-01', count: 2 },
          { month: '2024-02', count: 1 },
          { month: '2024-03', count: 3 },
          { month: '2024-04', count: 2 },
          { month: '2024-05', count: 1 },
          { month: '2024-06', count: 2 },
        ],
        bySalary: positions.map((p) => ({
          title: p.title,
          salary: p.base_salary,
          count: mockEmployees.filter((e) => e.position_id === p.id).length,
        })),
        leaveSummary: {
          pending: leaveRequests.filter((l) => l.status === 'Pending').length,
          approved: leaveRequests.filter((l) => l.status === 'Approved').length,
          rejected: leaveRequests.filter((l) => l.status === 'Rejected').length,
        },
      };
    }
    return axiosClient.get('/employees/stats');
  },

  getPositions: async () => {
    if (USE_MOCK) {
      await delay(120);
      return positions;
    }
    return axiosClient.get('/positions');
  },
};

export default employeeService;
