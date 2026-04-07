import axiosClient, { isMockMode } from './axiosClient';
import { employees, leaveRequests } from './hrmData';

const USE_MOCK = isMockMode;
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));
let mockRequests = [...leaveRequests];

const leaveTypeLabel = {
  Annual: 'Nghi phep nam',
  Sick: 'Nghi om',
  Unpaid: 'Nghi khong luong',
};

const toUi = (item) => ({
  ...item,
  employee: employees.find((e) => e.id === item.emp_id)?.full_name || `Emp ${item.emp_id}`,
  type: leaveTypeLabel[item.leave_type] || item.leave_type,
  startDate: item.start_date,
  endDate: item.end_date,
  statusKey: item.status,
});

export const leaveRequestService = {
  getAll: async () => {
    if (USE_MOCK) {
      await delay();
      return mockRequests.map(toUi);
    }
    const res = await axiosClient.get('/leave-requests');
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return list.map(toUi);
  },

  create: async (payload) => {
    if (USE_MOCK) {
      await delay();
      const newRow = {
        id: mockRequests.length + 1,
        emp_id: Number(payload.emp_id),
        leave_type: payload.leave_type,
        start_date: payload.start_date,
        end_date: payload.end_date,
        status: 'Pending',
        approved_by: null,
      };
      mockRequests.unshift(newRow);
      return toUi(newRow);
    }
    return axiosClient.post('/leave-requests', payload);
  },

  approveOrReject: async (id, status, approvedBy) => {
    if (USE_MOCK) {
      await delay();
      const row = mockRequests.find((r) => r.id === id);
      if (!row) throw new Error('Khong tim thay don nghi');
      row.status = status;
      row.approved_by = approvedBy || null;
      return toUi(row);
    }
    return axiosClient.patch(`/leave-requests/${id}`, { status, approved_by: approvedBy || null });
  },
};

export default leaveRequestService;
