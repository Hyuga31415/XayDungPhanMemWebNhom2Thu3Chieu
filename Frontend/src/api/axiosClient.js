import axios from 'axios';

// ============================================================
// Axios Client – Base config + Interceptors
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ──────────────────────────────────────────────────────────────
// REQUEST Interceptor – Đính kèm JWT token vào mọi request
// ──────────────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hrm_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────────────────────
// RESPONSE Interceptor – Xử lý lỗi tập trung
// ──────────────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về phần data của response thay vì toàn bộ AxiosResponse
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (!response) {
      // Lỗi mạng / timeout
      return Promise.reject({ message: 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.' });
    }

    switch (response.status) {
      case 401:
        // Token hết hạn → xóa token, redirect về login
        localStorage.removeItem('hrm_access_token');
        window.location.href = '/login';
        break;
      case 403:
        return Promise.reject({ message: 'Bạn không có quyền thực hiện thao tác này.', status: 403 });
      case 404:
        return Promise.reject({ message: 'Tài nguyên không tồn tại.', status: 404 });
      case 422:
        return Promise.reject({ message: 'Dữ liệu không hợp lệ.', errors: response.data?.errors, status: 422 });
      case 500:
        return Promise.reject({ message: 'Lỗi hệ thống. Vui lòng thử lại sau.', status: 500 });
      default:
        return Promise.reject({ message: response.data?.message || 'Đã có lỗi xảy ra.', status: response.status });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
