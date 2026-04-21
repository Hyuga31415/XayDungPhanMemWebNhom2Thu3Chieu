import { create } from 'zustand';
import authService from '../api/authService';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,       // Trạng thái loading khi bấm nút Đăng nhập
  isCheckingAuth: true,   // Trạng thái loading khi F5 tải lại trang để check token

  // 1. Hàm xử lý Đăng nhập
  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(username, password);
      
      // Lưu token vào localStorage (Khớp với cấu hình axiosClient của bạn)
      localStorage.setItem('hrm_access_token', res.token);
      
      set({ 
        // Backend trả về username, nhưng UI của bạn (Header) dùng user.name
        // Ta map lại tên hiển thị cho mượt
        user: { ...res.user, name: res.user.username }, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return res;
    } catch (error) {
      set({ isLoading: false });
      throw error; // Ném lỗi ra để LoginPage bắt và hiển thị
    }
  },

  // 2. Hàm xử lý Đăng xuất
  logout: () => {
    localStorage.removeItem('hrm_access_token');
    set({ user: null, isAuthenticated: false });
  },

  // 3. Hàm kiểm tra Token khi user F5 trang web
  checkAuth: async () => {
    const token = localStorage.getItem('hrm_access_token');
    if (!token) {
      set({ isCheckingAuth: false, isAuthenticated: false });
      return;
    }

    try {
      // Gọi API /auth/me để lấy lại thông tin user dựa trên token
      const userData = await authService.getMe();
      set({ 
        user: { ...userData, name: userData.full_name || userData.username }, 
        isAuthenticated: true, 
        isCheckingAuth: false 
      });
    } catch (error) {
      // Token hết hạn hoặc không hợp lệ -> Xóa token cũ
      localStorage.removeItem('hrm_access_token');
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  }
}));

export default useAuthStore;