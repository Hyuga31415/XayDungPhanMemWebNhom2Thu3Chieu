import { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL + '/users';

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log('Lỗi khi fetch users:', err));
  }, [API_URL]);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUserName }),
    })
      .then((res) => res.json())
      .then((newUser) => {
        setUsers([...users, newUser]);
        setNewUserName('');
      })
      .catch((err) => console.log('Lỗi khi thêm user:', err));
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setUsers(users.filter((u) => u.id !== id));
        } else {
          throw new Error('Xóa không thành công');
        }
      })
      .catch((err) => console.log('Lỗi khi xóa user:', err));
  };

  const handleStartEditing = (user) => {
    setEditingUser({ ...user });
  };

  const handleCancelEditing = () => {
    setEditingUser(null);
  };

  const handleUpdateEditingName = (e) => {
    setEditingUser({ ...editingUser, name: e.target.value });
  };

  const handleSaveEditing = () => {
    if (!editingUser || !editingUser.name.trim()) return;

    fetch(`${API_URL}/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingUser.name }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setEditingUser(null);
      })
      .catch((err) => console.log('Lỗi khi cập nhật user:', err));
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-4">Danh sách Users</h2>

          <form className="row g-2 align-items-center mb-4" onSubmit={handleAddUser}>
            <div className="col-sm">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Nhập tên user mới..."
                className="form-control"
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Thêm User
              </button>
            </div>
          </form>

          <ul className="list-group">
            {users.map((u) => (
              <li key={u.id} className="list-group-item">
                {editingUser && editingUser.id === u.id ? (
                  <div className="row g-2 align-items-center">
                    <div className="col-sm">
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={handleUpdateEditingName}
                        className="form-control"
                      />
                    </div>
                    <div className="col-auto">
                      <button type="button" className="btn btn-success btn-sm me-2" onClick={handleSaveEditing}>
                        Lưu
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancelEditing}>
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row align-items-center">
                    <div className="col-sm">
                      <span className="fw-semibold">
                        {u.id} - {u.name}
                      </span>
                    </div>
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleStartEditing(u)}
                      >
                        Sửa
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserList;
