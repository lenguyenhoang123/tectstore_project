import React, { useEffect, useState } from 'react';
import './UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', fullname: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const { success, token, ...userData } = data;
            setUser(userData);
          } else {
            setUser(data);
          }
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      username: user.username || '',
      email: user.email || '',
      fullname: user.profile && typeof user.profile === 'object' && user.profile.fullname ? user.profile.fullname : '',
      phone: user.profile && typeof user.profile === 'object' && user.profile.phone ? user.profile.phone : ''
    });
    setMessage('');
  };

  const handleSave = async () => {
    if (!form.username.trim() || !form.email.trim()) {
      setMessage('Tên đăng nhập và Email không được để trống!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          profile: { fullname: form.fullname, phone: form.phone }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi cập nhật!');
      // Lấy lại user mới nhất từ server
      const updatedRes = await fetch(`http://localhost:5000/api/users/${user._id}`);
      const updatedUser = await updatedRes.json();
      setUser(updatedUser);
      setEditMode(false);
      setForm({
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        fullname: updatedUser.profile && typeof updatedUser.profile === 'object' && updatedUser.profile.fullname ? updatedUser.profile.fullname : '',
        phone: updatedUser.profile && typeof updatedUser.profile === 'object' && updatedUser.profile.phone ? updatedUser.profile.phone : ''
      });
      setMessage('Cập nhật thành công!');
    } catch (err) {
      setMessage(err.message || 'Có lỗi xảy ra!');
    }
    setLoading(false);
  };

  if (!user) return <div className="user-profile"><h2>Thông tin cá nhân</h2><div>Không tìm thấy thông tin người dùng!</div></div>;

  return (
    <div className="user-profile">
      <div className="profile-avatar-row">
        <div className="profile-avatar">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.profile?.fullname || user.username || 'U')}&background=048ee1&color=fff&size=128`} alt="avatar" />
        </div>
      </div>
      <h2>Thông tin cá nhân</h2>
      {message && <div className="profile-message">{message}</div>}
      <form className="profile-info" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <div>
          <label htmlFor="username">Tên đăng nhập</label>
          {editMode ? (
            <input id="username" name="username" value={form.username} onChange={handleChange} placeholder="Tên đăng nhập" />
          ) : (
            <span> {user.username}</span>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          {editMode ? (
            <input id="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          ) : (
            <span> {user.email}</span>
          )}
        </div>
        <div>
          <label htmlFor="fullname">Họ tên</label>
          {editMode ? (
            <input id="fullname" name="fullname" value={form.fullname} onChange={handleChange} placeholder="Họ tên" />
          ) : (
            <span> {user.profile && typeof user.profile === 'object' && user.profile.fullname ? user.profile.fullname : ''}</span>
          )}
        </div>
        <div>
          <label htmlFor="phone">Số điện thoại</label>
          {editMode ? (
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" />
          ) : (
            <span> {user.profile && typeof user.profile === 'object' && user.profile.phone ? user.profile.phone : ''}</span>
          )}
        </div>
        <div className="profile-role-row"><label>Vai trò</label> <span className="profile-role">{Number(user.role) === 1
          ? 'Admin'
          : Number(user.role) === 2
            ? 'Nhân viên'
            : 'Khách hàng'}</span></div>
        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="profile-btn" type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
              <button className="profile-btn" type="button" onClick={handleCancel} disabled={loading}>Hủy</button>
            </>
          ) : (
            <button className="profile-btn" type="button" onClick={handleEdit}>Chỉnh sửa</button>
          )}
        </div>
      </form>
    </div>
  );
}
