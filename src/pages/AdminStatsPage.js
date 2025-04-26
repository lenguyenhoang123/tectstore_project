import React from 'react';
import AdminStats from '../components/admin/AdminStats';
import './AdminStatsPage.css';

export default function AdminStatsPage() {
  return (
    <div className="admin-stats-page-root">
      <h2 className="admin-stats-page-title">Trang thống kê</h2>
      <AdminStats />
    </div>
  );
}
