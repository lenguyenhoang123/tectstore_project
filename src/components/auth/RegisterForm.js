// Component RegisterForm: Form đăng ký tài khoản mới
import React, { useState } from 'react';
import './RegisterForm.css';

function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({ username: '', password: '', email: '', profile: { fullname: '', phone: '' } });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Đảm bảo fetch API đăng ký gọi đúng địa chỉ backend
  const API_URL = 'http://localhost:5000/api/register';

  const handleChange = e => {
    if (e.target.name === 'fullname' || e.target.name === 'phone') {
      setForm({ ...form, profile: { ...form.profile, [e.target.name]: e.target.value } });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Đăng ký thất bại, vui lòng thử lại!');
        setLoading(false);
        return;
      }
      // Lưu token và userId vào localStorage (sau khi đăng ký thành công)
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data._id);
      setSuccess('Đăng ký thành công!');
      setForm({ username: '', password: '', email: '', profile: { fullname: '', phone: '' } });
      setError('');
      // Nếu muốn chuyển hướng sang trang profile:
      // navigate('/profile');
    } catch (err) {
      setError('Đăng ký thất bại, vui lòng thử lại!');
    }
    setLoading(false);
  };

  return (
    <div className="register-form-container" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 70%, #e3f0ff 100%)'}}>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* Brand chữ lớn */}
        <div style={{textAlign: 'center', marginBottom: 18}}>
          <span style={{fontWeight: 900, fontSize: '2.1em', color: '#049be6', letterSpacing: '2px', fontFamily: 'Montserrat, Arial, sans-serif', textTransform: 'uppercase', display: 'inline-block'}}>
            TECHSTORE
          </span>
        </div>
        <h3>Đăng ký tài khoản mới</h3>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <input
          type="text"
          name="fullname"
          placeholder="Họ tên"
          value={form.profile.fullname}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          required
          className="register-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          className="register-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email "
          value={form.email}
          onChange={handleChange}
          className="register-input"
        />
      
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại "
          value={form.profile.phone}
          onChange={handleChange}
          className="register-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
        <div style={{textAlign: 'center', marginTop: 8, fontSize: '1em'}}>
          Đã có tài khoản?{' '}
          <a href="/login" className="register-link">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
