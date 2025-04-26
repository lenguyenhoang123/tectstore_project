import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdPerson, MdExitToApp, MdListAlt, MdBarChart, MdAddBox } from 'react-icons/md';
import './UserDropdown.css';

function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return (
    <Link to="/login" className="header-icon user-avatar">
      <MdPerson size={28} />
      <span className="nav-label">Đăng nhập</span>
    </Link>
  );

  return (
    <div className="user-dropdown-root" ref={ref}>
      <button className="header-icon user-avatar" onClick={() => setOpen(!open)}>
        <img src={user.avatar || '/default-avatar.png'} alt="avatar" className="avatar-img" />
        <span className="nav-label">{user.name || 'Tài khoản'}</span>
      </button>
      {open && (
        <div className="user-dropdown-menu">
          <Link to="/profile" className="user-dropdown-item"><MdPerson /> Thông tin cá nhân</Link>
          {user.role === 1 ? (
            <Link to="/admin-stats" className="user-dropdown-item"><MdBarChart /> Thống kê</Link>
          ) : (
            <Link to="/orders" className="user-dropdown-item"><MdListAlt /> Đơn hàng</Link>
          )}
          {user.role === 1 && (
            <Link to="/admin" className="user-dropdown-item"><MdAddBox /> Thêm sản phẩm</Link>
          )}
          {user.role === 1 && (
            <Link to="/admin-customers" className="user-dropdown-item"><MdPerson /> Khách hàng</Link>
          )}
          <button className="user-dropdown-item" onClick={onLogout}><MdExitToApp /> Đăng xuất</button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
