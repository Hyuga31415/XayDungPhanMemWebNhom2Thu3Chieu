import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UserList from './pages/UserList';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link style={{marginRight: '10px'}} to="/">Trang chủ</Link>
        <Link to="/users">Danh sách Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Chào mừng đến với App Nhân Sự</h1>} />
        {/* Đường dẫn bắt buộc theo đề bài */}
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;