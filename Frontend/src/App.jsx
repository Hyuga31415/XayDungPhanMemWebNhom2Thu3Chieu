import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './UserList'; // Đảm bảo file này cùng thư mục

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Trang chủ - Hãy truy cập /users</h1>} />
        {/* Đây là đường dẫn giáo viên sẽ chấm điểm */}
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;