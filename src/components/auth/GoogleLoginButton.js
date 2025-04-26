import React from 'react';

export default function GoogleLoginButton({ onSuccess, onFailure }) {
  // Handler giả lập, thực tế cần tích hợp Google OAuth
  const handleGoogleLogin = () => {
    // TODO: Thay thế bằng logic OAuth thực tế
    // alert('Chức năng đăng nhập bằng Google sẽ được tích hợp ở môi trường production!');
    if (typeof window !== 'undefined' && window.confirm) {
      onSuccess && onSuccess({ profileObj: { name: 'Demo User', email: 'demo@gmail.com' } });
    }
  };

  return (
    <button
      type="button"
      className="google-login-btn"
      onClick={handleGoogleLogin}
      style={{
        background: '#fff',
        color: '#222',
        border: '1.5px solid #e3e7ed',
        borderRadius: 10,
        padding: '12px 0',
        fontWeight: 700,
        fontSize: '1.08em',
        width: '100%',
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        boxShadow: '0 2px 10px rgba(66,133,244,0.08)',
        cursor: 'pointer',
        transition: 'background 0.15s, box-shadow 0.13s',
      }}
    >
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" style={{height: 22, marginRight: 8}} />
      Đăng nhập bằng Google
    </button>
  );
}
