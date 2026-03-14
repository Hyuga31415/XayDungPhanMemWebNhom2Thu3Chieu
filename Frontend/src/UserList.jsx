import { useEffect, useState } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [newUserName, setNewUserName] = useState('');
    const [editingUser, setEditingUser] = useState(null); // Lưu user đang được sửa { id, name }
    const API_URL = import.meta.env.VITE_API_URL + '/users';

    // Lấy danh sách users ban đầu
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.log("Lỗi khi fetch users:", err));
    }, [API_URL]);

    // Xử lý thêm user
    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUserName.trim()) return;

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newUserName }),
        })
        .then(res => res.json())
        .then(newUser => {
            setUsers([...users, newUser]);
            setNewUserName(''); // Reset input
        })
        .catch(err => console.log("Lỗi khi thêm user:", err));
    };

    // Xử lý xóa user
    const handleDeleteUser = (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;

        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    setUsers(users.filter(u => u.id !== id));
                } else {
                    throw new Error("Xóa không thành công");
                }
            })
            .catch(err => console.log("Lỗi khi xóa user:", err));
    };

    // Bắt đầu sửa user
    const handleStartEditing = (user) => {
        setEditingUser({ ...user }); // Copy user vào state để sửa
    };

    // Hủy sửa
    const handleCancelEditing = () => {
        setEditingUser(null);
    };

    // Cập nhật tên user đang sửa
    const handleUpdateEditingName = (e) => {
        setEditingUser({ ...editingUser, name: e.target.value });
    };

    // Lưu thay đổi sau khi sửa
    const handleSaveEditing = () => {
        if (!editingUser || !editingUser.name.trim()) return;

        fetch(`${API_URL}/${editingUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editingUser.name }),
        })
        .then(res => res.json())
        .then(updatedUser => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setEditingUser(null); // Kết thúc sửa
        })
        .catch(err => console.log("Lỗi khi cập nhật user:", err));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Danh sách Users</h2>

            {/* Form thêm user */}
            <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Nhập tên user mới..."
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 15px' }}>Thêm User</button>
            </form>

            {/* Danh sách user */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {users.map(u => (
                    <li key={u.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        {editingUser && editingUser.id === u.id ? (
                            // Giao diện khi đang SỬA
                            <div>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={handleUpdateEditingName}
                                    style={{ padding: '8px', marginRight: '10px' }}
                                />
                                <button onClick={handleSaveEditing} style={{ padding: '8px 12px', marginRight: '5px' }}>Lưu</button>
                                <button onClick={handleCancelEditing} style={{ padding: '8px 12px' }}>Hủy</button>
                            </div>
                        ) : (
                            // Giao diện BÌNH THƯỜNG
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ flexGrow: 1 }}>{u.id} - {u.name}</span>
                                <button onClick={() => handleStartEditing(u)} style={{ padding: '5px 10px', marginRight: '5px' }}>Sửa</button>
                                <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '5px 10px', backgroundColor: 'salmon' }}>Xóa</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;