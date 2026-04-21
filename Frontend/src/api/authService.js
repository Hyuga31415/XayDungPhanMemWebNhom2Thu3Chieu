import axiosClient from './axiosClient';

export const authService = {
  // Gọi API Đăng nhập
  login: async (username, password) => {
    return await axiosClient.post('/auth/login', { username, password });
  },

  // Gọi API lấy thông tin user từ Token (Dùng khi F5 trang)
  getMe: async () => {
    return await axiosClient.get('/auth/me');
  }
};

export default authService;