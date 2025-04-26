import React, { useEffect, useState } from 'react';
import './AdminStats.css';

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải thống kê!');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="admin-stats-loading">Đang tải thống kê...</div>;
  if (error) return <div className="admin-stats-error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="admin-stats-root">
      <h3 className="admin-stats-title">Thống kê tổng quan</h3>
      <div className="admin-stats-grid">
        <div className="admin-stats-card">
          <div className="admin-stats-label">Tổng số sản phẩm</div>
          <div className="admin-stats-value">{stats.totalProducts}</div>
        </div>
        <div className="admin-stats-card">
          <div className="admin-stats-label">Tổng số đơn hàng</div>
          <div className="admin-stats-value">{stats.totalOrders}</div>
        </div>
        <div className="admin-stats-card">
          <div className="admin-stats-label">Tổng doanh thu</div>
          <div className="admin-stats-value">{Number(stats.totalRevenue).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
        </div>
        <div className="admin-stats-card">
          <div className="admin-stats-label">Khách hàng đã mua</div>
          <div className="admin-stats-value">{stats.totalCustomers}</div>
        </div>
      </div>
    </div>
  );
}
