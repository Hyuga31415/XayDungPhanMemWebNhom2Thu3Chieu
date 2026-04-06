import { create } from 'zustand';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('hrm_access_token') || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('hrm_access_token'),

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(username, password);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success('Đăng nhập thành công!');
      return response;
    } catch (error) {
      const message = error.message || 'Đăng nhập thất bại';
      toast.error(message);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    toast.success('Đã đăng xuất');
  },

  setUser: (user) => {
    set({ user });
  },

  reset: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
