import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './UserList'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Trang chủ - Hệ thống Quản lý</h1>} />
        {/* Đây là route quan trọng nhất để lấy điểm */}
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;