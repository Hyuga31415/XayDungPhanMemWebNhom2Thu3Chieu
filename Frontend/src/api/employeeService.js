import axiosClient from './axiosClient';

const USE_MOCK = true;

// ============================================================
// Mock data ánh xạ từ HRM.sql (hrm_system database)
// Positions: id 1-6, Departments: id 1-3, Employees: id 1-6
// ============================================================

// ── Positions (Chức vụ) ─────────────────────────────────────
export const mockPositions = [
  { id: 1, title: 'Giám đốc',               base_salary: 50000000 },
  { id: 2, title: 'Trưởng phòng HR',        base_salary: 30000000 },
  { id: 3, title: 'Trưởng phòng IT',        base_salary: 35000000 },
  { id: 4, title: 'Chuyên viên HR',         base_salary: 15000000 },
  { id: 5, title: 'Lập trình viên Backend', base_salary: 20000000 },
  { id: 6, title: 'Lập trình viên Frontend',base_salary: 20000000 },
];

// ── Departments (insert trước, manager cập nhật sau) ────────
let mockDepartments = [
  {
    id: 1, name: 'Ban Giám Đốc',              manager_id: 1,
    managerName: 'Nguyễn Văn A', status: 1,
    description: 'Điều hành và định hướng chiến lược công ty',
    employeeCount: 1,
  },
  {
    id: 2, name: 'Phòng Nhân Sự',             manager_id: 2,
    managerName: 'Trần Thị B',   status: 1,
    description: 'Quản lý nguồn nhân lực, tuyển dụng và phúc lợi',
    employeeCount: 2,
  },
  {
    id: 3, name: 'Phòng Công Nghệ Thông Tin', manager_id: 3,
    managerName: 'Lê Văn C',     status: 1,
    description: 'Phát triển phần mềm và hạ tầng công nghệ',
    employeeCount: 3,
  },
];

// ── Employees (từ INSERT INTO employees) ────────────────────
// status: 'Active' | 'Resigned'  (theo ENUM trong SQL)
// emp_code: BOD001, HR001, IT001, v.v.
let mockEmployees = [
  {
    id: 1, emp_code: 'BOD001', fullName: 'Nguyễn Văn A',
    email: 'nva@company.com',
    department_id: 1, departmentName: 'Ban Giám Đốc',
    position_id: 1, position: 'Giám đốc', base_salary: 50000000,
    hire_date: '2020-01-01', status: 'Active',
    gender: 'male', avatar: 'NA',
  },
  {
    id: 2, emp_code: 'HR001', fullName: 'Trần Thị B',
    email: 'ttb@company.com',
    department_id: 2, departmentName: 'Phòng Nhân Sự',
    position_id: 2, position: 'Trưởng phòng HR', base_salary: 30000000,
    hire_date: '2021-03-15', status: 'Active',
    gender: 'female', avatar: 'TB',
  },
  {
    id: 3, emp_code: 'IT001', fullName: 'Lê Văn C',
    email: 'lvc@company.com',
    department_id: 3, departmentName: 'Phòng Công Nghệ Thông Tin',
    position_id: 3, position: 'Trưởng phòng IT', base_salary: 35000000,
    hire_date: '2021-06-01', status: 'Active',
    gender: 'male', avatar: 'LC',
  },
  {
    id: 4, emp_code: 'HR002', fullName: 'Phạm Thị D',
    email: 'ptd@company.com',
    department_id: 2, departmentName: 'Phòng Nhân Sự',
    position_id: 4, position: 'Chuyên viên HR', base_salary: 15000000,
    hire_date: '2022-08-10', status: 'Active',
    gender: 'female', avatar: 'PD',
  },
  {
    id: 5, emp_code: 'IT002', fullName: 'Hoàng Văn E',
    email: 'hve@company.com',
    department_id: 3, departmentName: 'Phòng Công Nghệ Thông Tin',
    position_id: 5, position: 'Lập trình viên Backend', base_salary: 20000000,
    hire_date: '2023-02-20', status: 'Active',
    gender: 'male', avatar: 'HE',
  },
  {
    id: 6, emp_code: 'IT003', fullName: 'Ngô Thị F',
    email: 'ntf@company.com',
    department_id: 3, departmentName: 'Phòng Công Nghệ Thông Tin',
    position_id: 6, position: 'Lập trình viên Frontend', base_salary: 20000000,
    hire_date: '2023-05-12', status: 'Active',  // Đang nghỉ ốm theo leave_requests nhưng status vẫn Active
    gender: 'female', avatar: 'NF',
  },
];

let nextEmpId = 7;
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ============================================================
// Employee Service
// ============================================================
export const employeeService = {
  getAll: async (params = {}) => {
    if (USE_MOCK) {
      await delay();
      let data = [...mockEmployees];

      if (params.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (e) =>
            e.fullName.toLowerCase().includes(q) ||
            e.emp_code.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        );
      }
      if (params.departmentId) {
        data = data.filter((e) => e.department_id === Number(params.departmentId));
      }
      if (params.status) {
        data = data.filter((e) => e.status === params.status);
      }

      const page  = params.page  || 1;
      const limit = params.limit || 8;
      const total      = data.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const items = data.slice(start, start + limit);

      return { data: items, total, page, totalPages };
    }
    return axiosClient.get('/employees', { params });
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(200);
      const emp = mockEmployees.find((e) => e.id === id);
      if (!emp) throw new Error('Không tìm thấy nhân viên');
      return emp;
    }
    return axiosClient.get(`/employees/${id}`);
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay();
      const pos = mockPositions.find((p) => p.id === Number(data.position_id));
      const dept = mockDepartments.find((d) => d.id === Number(data.department_id));
      const initials = data.fullName.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();
      const newEmp = {
        ...data,
        id: nextEmpId++,
        emp_code: `EMP${String(nextEmpId - 1).padStart(3, '0')}`,
        departmentName: dept?.name || '',
        position: pos?.title || data.position || '',
        base_salary: pos?.base_salary || 0,
        avatar: initials,
      };
      mockEmployees.unshift(newEmp);
      // Update employeeCount
      if (dept) dept.employeeCount = (dept.employeeCount || 0) + 1;
      return newEmp;
    }
    return axiosClient.post('/employees', data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await delay();
      const idx = mockEmployees.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Không tìm thấy nhân viên');
      const pos  = mockPositions.find((p) => p.id === Number(data.position_id));
      const dept = mockDepartments.find((d) => d.id === Number(data.department_id));
      mockEmployees[idx] = {
        ...mockEmployees[idx], ...data,
        departmentName: dept?.name || mockEmployees[idx].departmentName,
        position: pos?.title || data.position || mockEmployees[idx].position,
        base_salary: pos?.base_salary ?? mockEmployees[idx].base_salary,
      };
      return mockEmployees[idx];
    }
    return axiosClient.put(`/employees/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      mockEmployees = mockEmployees.filter((e) => e.id !== id);
      return { success: true };
    }
    return axiosClient.delete(`/employees/${id}`);
  },

  // Stats cho Dashboard
  getStats: async () => {
    if (USE_MOCK) {
      await delay(300);
      const total   = mockEmployees.length;
      const active  = mockEmployees.filter((e) => e.status === 'Active').length;
      const resigned= mockEmployees.filter((e) => e.status === 'Resigned').length;

      return {
        total,
        active,
        resigned,
        newThisMonth: 1,       // Ngô Thị F hire_date 2023-05-12 (seed)
        retentionRate: ((active / total) * 100).toFixed(1),
        byDepartment: mockDepartments.map((d) => ({
          name: d.name.replace('Phòng ', '').replace('Ban ', ''),
          count: mockEmployees.filter((e) => e.department_id === d.id).length,
        })),
        byGender: [
          { name: 'Nam', value: mockEmployees.filter((e) => e.gender === 'male').length },
          { name: 'Nữ', value: mockEmployees.filter((e) => e.gender === 'female').length },
        ],
        // Recruitment trend - Last 6 months
        recruitmentTrend: [
          { month: 'Tháng 1', count: 4 },
          { month: 'Tháng 2', count: 7 },
          { month: 'Tháng 3', count: 5 },
          { month: 'Tháng 4', count: 8 },
          { month: 'Tháng 5', count: 12 },
          { month: 'Tháng 6', count: 9 },
        ],
        // Salary ranges
        bySalary: mockPositions.map((p) => ({
          title: p.title,
          salary: p.base_salary,
          count: mockEmployees.filter((e) => e.position_id === p.id).length,
        })),
      };
    }
    return axiosClient.get('/employees/stats');
  },

  // Lấy danh sách positions
  getPositions: async () => {
    if (USE_MOCK) {
      await delay(200);
      return mockPositions;
    }
    return axiosClient.get('/positions');
  },
};

export default employeeService;
