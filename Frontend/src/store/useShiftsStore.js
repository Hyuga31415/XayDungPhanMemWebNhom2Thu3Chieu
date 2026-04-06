import { create } from 'zustand';
import toast from 'react-hot-toast';

const SHIFT_TYPES = [
  { id: 1, name: 'Ca sáng', startTime: '07:00', endTime: '12:00', color: '#f59e0b' },
  { id: 2, name: 'Ca chiều', startTime: '12:00', endTime: '17:30', color: '#3b82f6' },
  { id: 3, name: 'Ca tối', startTime: '17:30', endTime: '23:00', color: '#8b5cf6' },
];

const MOCK_SHIFTS = [
  { id: 1, employeeId: 1, employeeName: 'Nguyễn Văn A', shiftId: 1, date: '2026-04-07', isOvertime: false },
  { id: 2, employeeId: 2, employeeName: 'Trần Thị B', shiftId: 2, date: '2026-04-07', isOvertime: false },
  { id: 3, employeeId: 3, employeeName: 'Lê Văn C', shiftId: 3, date: '2026-04-07', isOvertime: false },
  { id: 4, employeeId: 1, employeeName: 'Nguyễn Văn A', shiftId: 2, date: '2026-04-08', isOvertime: false },
];

const useShiftsStore = create((set, get) => ({
  shifts: MOCK_SHIFTS,
  shiftTypes: SHIFT_TYPES,
  isLoading: false,

  getShiftType: (id) => {
    return get().shiftTypes.find((s) => s.id === id);
  },

  getShiftsForDate: (date) => {
    return get().shifts.filter((s) => s.date === date);
  },

  getShiftsForWeek: (startDate) => {
    const shifts = get().shifts;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    
    return shifts.filter((s) => {
      const shiftDate = new Date(s.date);
      return shiftDate >= start && shiftDate < end;
    });
  },

  assignShift: (employeeId, employeeName, shiftId, date) => {
    set((state) => ({
      shifts: [
        ...state.shifts,
        {
          id: Math.max(0, ...state.shifts.map((s) => s.id)) + 1,
          employeeId,
          employeeName,
          shiftId,
          date,
          isOvertime: false,
        },
      ],
    }));
    toast.success('Phân ca thành công');
  },

  updateShift: (id, updates) => {
    set((state) => ({
      shifts: state.shifts.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    toast.success('Cập nhật ca thành công');
  },

  deleteShift: (id) => {
    set((state) => ({
      shifts: state.shifts.filter((s) => s.id !== id),
    }));
    toast.success('Xóa ca thành công');
  },

  markOvertime: (id, isOvertime) => {
    set((state) => ({
      shifts: state.shifts.map((s) => (s.id === id ? { ...s, isOvertime } : s)),
    }));
    toast.success(isOvertime ? 'Ghi nhận tăng ca' : 'Bỏ ghi nhận tăng ca');
  },

  swapShift: (shiftId1, shiftId2) => {
    set((state) => {
      const shift1 = state.shifts.find((s) => s.id === shiftId1);
      const shift2 = state.shifts.find((s) => s.id === shiftId2);

      if (!shift1 || !shift2) return state;

      return {
        shifts: state.shifts.map((s) => {
          if (s.id === shiftId1) {
            return { ...s, shiftId: shift2.shiftId, date: shift2.date };
          }
          if (s.id === shiftId2) {
            return { ...s, shiftId: shift1.shiftId, date: shift1.date };
          }
          return s;
        }),
      };
    });
    toast.success('Đổi ca thành công');
  },
}));

export default useShiftsStore;
