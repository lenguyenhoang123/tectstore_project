import React from 'react';
import { Link } from 'react-router-dom';
import './QuickLinks.css';

function QuickLinks() {
  return (
    <div className="quick-links-root">
      <Link to="/promo" className="quick-link">🔥 Khuyến mãi</Link>
      <Link to="/contact" className="quick-link">📞 Liên hệ</Link>
    </div>
  );
}

export default QuickLinks;
