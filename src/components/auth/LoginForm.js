// Component LoginForm: Form đăng nhập cơ bản
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import GoogleLoginButton from './GoogleLoginButton';

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      // Lưu token và userId vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data._id);
      onLogin && onLogin(); // Gọi lại App để đồng bộ user
      // Chuyển hướng theo role
      if (data.role === 1) {
        navigate('/admin');
      } else {
        navigate('/profile'); // Thêm chuyển hướng về trang profile sau khi đăng nhập thành công
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Brand chữ lớn */}
        <div style={{textAlign: 'center', marginBottom: 18}}>
          <span style={{fontWeight: 900, fontSize: '2.1em', color: '#049be6', letterSpacing: '2px', fontFamily: 'Montserrat, Arial, sans-serif', textTransform: 'uppercase', display: 'inline-block'}}>
            TECHSTORE
          </span>
        </div>
        <h2>Đăng nhập tài khoản</h2>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <GoogleLoginButton onSuccess={() => {}} onFailure={() => {}} />
        <div style={{textAlign: 'center', marginTop: 8, fontSize: '1em'}}>
          Chưa có tài khoản?{' '}
          <a href="/register" className="register-link">Đăng ký ngay</a>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
