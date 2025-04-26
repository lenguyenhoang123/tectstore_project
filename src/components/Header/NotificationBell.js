import React, { useState } from 'react';
import { MdNotifications, MdNotificationsActive } from 'react-icons/md';
import './NotificationBell.css';

function NotificationBell({ notifications }) {
  const [open, setOpen] = useState(false);
  const hasUnread = notifications && notifications.length > 0;
  return (
    <div className="notif-bell-root">
      <button className="header-icon notif-bell-btn" onClick={() => setOpen(!open)}>
        {hasUnread ? <MdNotificationsActive size={24} /> : <MdNotifications size={24} />}
        {hasUnread && <span className="notif-dot" />}
        <span className="nav-label">Thông báo</span>
      </button>
      {open && (
        <div className="notif-dropdown">
          {notifications && notifications.length ? notifications.map((n, i) => (
            <div key={i} className="notif-item">{n}</div>
          )) : <div className="notif-item empty">Không có thông báo mới</div>}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
