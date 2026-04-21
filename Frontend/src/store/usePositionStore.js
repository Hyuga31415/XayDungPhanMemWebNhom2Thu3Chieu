import { create } from 'zustand';
import { positionService } from '../api/positionService';
import toast from 'react-hot-toast';

const usePositionStore = create((set, get) => ({
  positions: [],
  isLoading: false,
  isSubmitting: false,

  fetchPositions: async () => {
    set({ isLoading: true });
    try {
      const data = await positionService.getAll();
      set({ positions: data, isLoading: false });
    } catch (err) {
      toast.error(err.message || 'Loi khi tai danh sach chuc vu');
      set({ isLoading: false });
    }
  },

  createPosition: async (data) => {
    set({ isSubmitting: true });
    try {
      await positionService.create(data);
      toast.success('Them chuc vu thanh cong!');
      get().fetchPositions();
      return true;
    } catch (err) {
      toast.error(err.message || 'Loi khi them chuc vu');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updatePosition: async (id, data) => {
    set({ isSubmitting: true });
    try {
      await positionService.update(id, data);
      toast.success('Cap nhat chuc vu thanh cong!');
      get().fetchPositions();
      return true;
    } catch (err) {
      toast.error(err.message || 'Loi khi cap nhat chuc vu');
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deletePosition: async (id) => {
    try {
      await positionService.delete(id);
      toast.success('Da xoa chuc vu');
      get().fetchPositions();
    } catch (err) {
      toast.error(err.message || 'Loi khi xoa chuc vu');
    }
  },
}));

export default usePositionStore;
