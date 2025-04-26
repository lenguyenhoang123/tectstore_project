import React, { useEffect, useState } from 'react';
import './AdminCustomersPage.css';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách khách hàng!');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="admin-customers-loading">Đang tải danh sách khách hàng...</div>;
  if (error) return <div className="admin-customers-error">{error}</div>;

  return (
    <div className="admin-customers-root">
      <h2 className="admin-customers-title">Danh sách khách hàng</h2>
      <div className="admin-customers-table-wrap">
        <table className="admin-customers-table">
          <thead>
            <tr>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Số đơn hàng</th>
              <th>Tổng chi tiêu</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone || '-'}</td>
                <td>{c.ordersCount}</td>
                <td>{Number(c.totalSpent).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
