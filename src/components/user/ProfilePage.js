import React, { useEffect, useState } from 'react';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userId && token) {
      fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Nếu response có success, chỉ lấy các trường user
          if (data.success) {
            const { success, token, ...userData } = data;
            setUser(userData);
          } else {
            setUser(data);
          }
        })
        .catch(() => setUser(null));
    }
  }, [userId, token]);

  // Thêm log để kiểm tra dữ liệu user
  console.log('Fetched user:', user);

  if (!user) return (
    <div className="profile-container">
      <h2 className="profile-title">Thông tin cá nhân</h2>
      <p className="profile-empty">Không tìm thấy thông tin người dùng!</p>
    </div>
  );

  return (
    <div className="profile-container">
      <h2 className="profile-title">Thông tin cá nhân</h2>
      <div className="profile-info">
        <div className="profile-row">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{user.username}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{user.email || 'Chưa cập nhật'}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Họ tên:</span>
          <span className="profile-value">{user.profile?.fullname || 'Chưa cập nhật'}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Số điện thoại:</span>
          <span className="profile-value">{user.profile?.phone || 'Chưa cập nhật'}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Vai trò:</span>
          <span className="profile-value">{user.role === 1 ? 'Admin' : 'User'}</span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
