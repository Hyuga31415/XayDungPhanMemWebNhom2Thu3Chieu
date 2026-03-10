import { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL + '/users';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log("Lỗi:", err));
  }, []);

  return (
    <div>
      <h2>Danh sách Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.id} - {u.name}</li>)}
      </ul>
    </div>
  );
};
export default UserList;