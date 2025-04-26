// Component hiển thị các tính năng nổi bật của cửa hàng
import React from 'react';

function FeaturesSection() {
  return (
    // Section các tính năng nổi bật
    <section className="features">
      {/* Tính năng 1: Miễn phí vận chuyển */}
      <div className="feature">
        <span className="feature-icon">🚚</span>
        <h3>Miễn phí vận chuyển</h3>
        <p>Cho đơn hàng từ 2 triệu</p>
      </div>
      {/* Tính năng 2: Bảo hành chính hãng */}
      <div className="feature">
        <span className="feature-icon">💯</span>
        <h3>Bảo hành chính hãng</h3>
        <p>12 tháng bảo hành</p>
      </div>
      {/* Tính năng 3: Đổi trả miễn phí */}
      <div className="feature">
        <span className="feature-icon">🔄</span>
        <h3>Đổi trả miễn phí</h3>
        <p>Trong 15 ngày</p>
      </div>
    </section>
  );
}

export default FeaturesSection;
