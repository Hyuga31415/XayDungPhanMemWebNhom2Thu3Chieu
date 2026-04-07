import axiosClient, { isMockMode } from './axiosClient';
import { attendanceLogs } from './hrmData';

const USE_MOCK = isMockMode;
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));
let mockAttendance = [...attendanceLogs];

const toUi = (row) => ({
  ...row,
  date: row.work_date,
  checkIn: row.check_in ? row.check_in.slice(11, 16) : null,
  checkOut: row.check_out ? row.check_out.slice(11, 16) : null,
});

const nowSqlDatetime = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

export const attendanceService = {
  getAll: async () => {
    if (USE_MOCK) {
      await delay();
      return mockAttendance.map(toUi);
    }
    const res = await axiosClient.get('/attendance-logs');
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return list.map(toUi);
  },

  checkIn: async (empId, workDate) => {
    if (USE_MOCK) {
      await delay();
      const existing = mockAttendance.find((a) => a.emp_id === empId && a.work_date === workDate);
      const dt = nowSqlDatetime();
      if (existing) {
        existing.check_in = dt;
        existing.status = dt.slice(11, 16) > '09:00' ? 'Late' : 'Present';
        return toUi(existing);
      }
      const newRow = {
        id: mockAttendance.length + 1,
        emp_id: empId,
        work_date: workDate,
        check_in: dt,
        check_out: null,
        status: dt.slice(11, 16) > '09:00' ? 'Late' : 'Present',
      };
      mockAttendance.unshift(newRow);
      return toUi(newRow);
    }
    return axiosClient.post('/attendance-logs/check-in', { emp_id: empId, work_date: workDate });
  },

  checkOut: async (empId, workDate) => {
    if (USE_MOCK) {
      await delay();
      const existing = mockAttendance.find((a) => a.emp_id === empId && a.work_date === workDate);
      if (!existing) throw new Error('Khong co ban ghi check-in trong ngay');
      existing.check_out = nowSqlDatetime();
      return toUi(existing);
    }
    return axiosClient.post('/attendance-logs/check-out', { emp_id: empId, work_date: workDate });
  },
};

export default attendanceService;
