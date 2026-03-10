import { useEffect, useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  
  // Kiểm tra xem biến môi trường có đúng không
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/users`) // Gọi đến đúng route /users của backend
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Lỗi fetch:", err));
  }, []);

  return (
    <div>
      <h1>Danh sách Users</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}