import React from 'react';

function FeaturesSection() {
  return (
    <section className="features-section" style={{margin: '40px auto', maxWidth: 1100, padding: '0 16px'}}>
      <h2 style={{color: '#048ee1', marginBottom: 24}}>Tính năng nổi bật</h2>
      <div style={{display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center'}}>
        <div style={{flex: '1 1 250px', minWidth: 250, background: '#f7fafd', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
          <h3>Giao hàng nhanh</h3>
          <p>Nhận hàng trong 2h tại nội thành và 24h toàn quốc.</p>
        </div>
        <div style={{flex: '1 1 250px', minWidth: 250, background: '#f7fafd', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
          <h3>Bảo hành chính hãng</h3>
          <p>Cam kết sản phẩm chính hãng, bảo hành toàn quốc.</p>
        </div>
        <div style={{flex: '1 1 250px', minWidth: 250, background: '#f7fafd', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
          <h3>Hỗ trợ 24/7</h3>
          <p>Đội ngũ tư vấn luôn sẵn sàng hỗ trợ khách hàng.</p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
