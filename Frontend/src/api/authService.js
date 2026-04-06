import axiosClient from './axiosClient';

export const authService = {
  login: async (username, password) => {
    const response = await axiosClient.post('/auth/login', {
      username,
      password,
    });
    if (response.token) {
      localStorage.setItem('hrm_access_token', response.token);
    }
    return response;
  },

  /**
   * Đăng xuất
  },

  /**
   * Lấy token hiện tại
   */
  
  /**
   * Kiểm tra xem có token không
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('hrm_access_token');
  },
};