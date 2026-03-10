import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quan trọng: Thay URL này bằng link thực tế từ Render của bạn (VD: https://ten-app.onrender.com/api/users)
  // Nếu đang chạy backend ở máy cá nhân (Local), sử dụng: http://localhost:3000/api/users
  const BACKEND_URL = 'https://xaydungphanmemwebnhom2thu3chieu.onrender.com';

  useEffect(() => {
    // Gọi API từ backend
    fetch(BACKEND_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setEmployees(data.data); // 'data.data' tương ứng với cấu trúc JSON backend trả về
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="hr-container">
      <header className="hr-header">
        <h1>Hệ Thống Quản Lý Nhân Sự</h1>
      </header>
      
      <main>
        <div className="table-header">
          <h2>Danh sách nhân viên</h2>
          <button className="btn-add">+ Thêm nhân viên</button>
        </div>

        {/* Xử lý các trạng thái tải dữ liệu */}
        {loading && <p className="status-text">Đang tải dữ liệu từ server...</p>}
        {error && <p className="status-text error">Lỗi kết nối: {error}</p>}

        {/* Hiển thị bảng khi có dữ liệu */}
        {!loading && !error && (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Họ và Tên</th>
                <th>Phòng ban</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>NV-{emp.id.toString().padStart(3, '0')}</td>
                  <td>{emp.name}</td>
                  {/* Các trường dưới đây đang để nội dung mẫu, bạn có thể cập nhật thêm ở file backend sau */}
                  <td>Công nghệ thông tin</td> 
                  <td><span className="badge active">Đang làm việc</span></td>
                  <td>
                    <button className="btn-edit">Sửa</button>
                    <button className="btn-delete">Xóa</button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">Chưa có dữ liệu nhân viên.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;