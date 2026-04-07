export const SQL_ENUMS = {
  employeeStatus: ['Active', 'Resigned'],
  attendanceStatus: ['Present', 'Late', 'Absent'],
  leaveType: ['Annual', 'Sick', 'Unpaid'],
  leaveStatus: ['Pending', 'Approved', 'Rejected'],
  payrollStatus: ['Draft', 'Paid'],
  userRole: ['Admin', 'HR', 'Staff'],
};

export const positions = [
  { id: 1, title: 'Giam doc', base_salary: 50000000 },
  { id: 2, title: 'Truong phong HR', base_salary: 30000000 },
  { id: 3, title: 'Truong phong IT', base_salary: 35000000 },
  { id: 4, title: 'Chuyen vien HR', base_salary: 15000000 },
  { id: 5, title: 'Lap trinh vien Backend', base_salary: 20000000 },
  { id: 6, title: 'Lap trinh vien Frontend', base_salary: 20000000 },
];

export const departments = [
  { id: 1, name: 'Ban Giam Doc', manager_id: 1, status: 1 },
  { id: 2, name: 'Phong Nhan Su', manager_id: 2, status: 1 },
  { id: 3, name: 'Phong Cong Nghe Thong Tin', manager_id: 3, status: 1 },
];

export const employees = [
  {
    id: 1,
    emp_code: 'BOD001',
    full_name: 'Nguyen Van A',
    email: 'nva@company.com',
    department_id: 1,
    position_id: 1,
    hire_date: '2020-01-01',
    status: 'Active',
    gender: 'male',
  },
  {
    id: 2,
    emp_code: 'HR001',
    full_name: 'Tran Thi B',
    email: 'ttb@company.com',
    department_id: 2,
    position_id: 2,
    hire_date: '2021-03-15',
    status: 'Active',
    gender: 'female',
  },
  {
    id: 3,
    emp_code: 'IT001',
    full_name: 'Le Van C',
    email: 'lvc@company.com',
    department_id: 3,
    position_id: 3,
    hire_date: '2021-06-01',
    status: 'Active',
    gender: 'male',
  },
  {
    id: 4,
    emp_code: 'HR002',
    full_name: 'Pham Thi D',
    email: 'ptd@company.com',
    department_id: 2,
    position_id: 4,
    hire_date: '2022-08-10',
    status: 'Active',
    gender: 'female',
  },
  {
    id: 5,
    emp_code: 'IT002',
    full_name: 'Hoang Van E',
    email: 'hve@company.com',
    department_id: 3,
    position_id: 5,
    hire_date: '2023-02-20',
    status: 'Active',
    gender: 'male',
  },
  {
    id: 6,
    emp_code: 'IT003',
    full_name: 'Ngo Thi F',
    email: 'ntf@company.com',
    department_id: 3,
    position_id: 6,
    hire_date: '2023-05-12',
    status: 'Active',
    gender: 'female',
  },
];

export const attendanceLogs = [
  {
    id: 1,
    emp_id: 5,
    work_date: '2024-03-25',
    check_in: '2024-03-25 08:25:00',
    check_out: '2024-03-25 17:35:00',
    status: 'Present',
  },
  {
    id: 2,
    emp_id: 6,
    work_date: '2024-03-25',
    check_in: '2024-03-25 08:45:00',
    check_out: '2024-03-25 17:30:00',
    status: 'Late',
  },
  {
    id: 3,
    emp_id: 5,
    work_date: '2024-03-26',
    check_in: '2024-03-26 08:20:00',
    check_out: '2024-03-26 17:40:00',
    status: 'Present',
  },
  {
    id: 4,
    emp_id: 6,
    work_date: '2024-03-26',
    check_in: null,
    check_out: null,
    status: 'Absent',
  },
];

export const leaveRequests = [
  {
    id: 1,
    emp_id: 6,
    leave_type: 'Sick',
    start_date: '2024-03-26',
    end_date: '2024-03-26',
    status: 'Approved',
    approved_by: 3,
  },
  {
    id: 2,
    emp_id: 5,
    leave_type: 'Annual',
    start_date: '2024-04-10',
    end_date: '2024-04-12',
    status: 'Pending',
    approved_by: null,
  },
];

export const payrollRecords = [
  {
    id: 1,
    emp_id: 5,
    month: 2,
    year: 2024,
    base_salary: 20000000,
    total_allowance: 1000000,
    total_deduction: 500000,
    net_salary: 20500000,
    status: 'Paid',
  },
  {
    id: 2,
    emp_id: 6,
    month: 2,
    year: 2024,
    base_salary: 20000000,
    total_allowance: 1000000,
    total_deduction: 0,
    net_salary: 21000000,
    status: 'Paid',
  },
];

export const users = [
  { id: 1, emp_id: 1, username: 'admin', role: 'Admin' },
  { id: 2, emp_id: 2, username: 'manager_hr', role: 'HR' },
  { id: 3, emp_id: 3, username: 'manager_it', role: 'Staff' },
  { id: 4, emp_id: 4, username: 'staff_hr', role: 'HR' },
  { id: 5, emp_id: 5, username: 'dev_be', role: 'Staff' },
  { id: 6, emp_id: 6, username: 'dev_fe', role: 'Staff' },
];
