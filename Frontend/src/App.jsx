import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UserList from './UserList'; 

function App() {
  return (
    <BrowserRouter>
      {/* Thanh điều hướng (Navigation) xuất hiện ở mọi trang */}
      <nav style={{ padding: '20px', backgroundColor: '#eee', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Trang chủ</Link>
        <Link to="/users">Danh sách Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <div style={{ padding: '20px' }}>
            <h1>Trang chủ - Hệ thống Quản lý</h1>
            <p>Chào mừng bạn! Nhấn vào nút bên dưới để xem danh sách:</p>
            {/* Thêm link ngay tại nội dung trang chủ */}
            <Link to="/users">
              <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Xem danh sách Users
              </button>
            </Link>
          </div>
        } />
        
        {/* Route danh sách users */}
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
