import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';
// import logo from '../../assets/logo.png';

function Header({ 
  user, 
  cartItemsCount, 
  notifications = [], 
  onLogout 
}) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        setIsSticky(window.scrollY > 10);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`main-header${isSticky ? ' is-sticky' : ''}`} ref={headerRef}>
      {/* Banner thông báo trên cùng */}
      <div className="header-banner">
        <span className="banner-icon">🚚</span>
        <span>Miễn phí giao hàng từ 300k</span>
        <span className="banner-sep">|</span>
        <span className="banner-hotline">Hotline: <b>1800.1234</b></span>
        <span className="banner-sep">|</span>
        <span>Sản phẩm chính hãng - Xuất VAT</span>
      </div>
      <div className="header-bar beautiful" style={{display: 'flex', justifyContent: 'center', gap: '2vw'}}>
        <Link to="/" className="header-logo" style={{display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none'}}>
          <span className="brand-title" style={{fontWeight: 900, fontSize: '2.1em', color: '#049be6', letterSpacing: '2px', fontFamily: 'Montserrat, Arial, sans-serif', textTransform: 'uppercase'}}>
            TECHSTORE
          </span>
        </Link>
        <div className="tab-menu-wrapper">
          {/* BỎ nút Danh mục trên header */}
        </div>
        <form className="search-form">
          <input type="text" className="search-input" placeholder="Bạn cần tìm gì?" />
          <button type="submit" className="search-btn">🔍</button>
        </form>
        <nav className="header-nav">
          <Link to="/cart" className="header-icon">
            🛒
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            <span className="nav-label">Giỏ hàng</span>
          </Link>
          <NotificationBell notifications={notifications} />
          <UserDropdown user={user} onLogout={onLogout} />
        </nav>
      </div>
      <div style={{width: '100%'}} />
    </header>
  );
}

export default Header;
