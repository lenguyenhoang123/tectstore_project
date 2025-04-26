// Trang thanh toán hoàn chỉnh
import React, { useState, useEffect } from 'react';
import '../../App.css';
import './CheckoutPage.css';

function CheckoutPage({ cartItems, totalPrice, onFinish, user }) {
  // State quản lý các trường nhập của form
  const [name, setName] = useState(user?.name || ''); // Họ tên người nhận
  const [phone, setPhone] = useState(user?.phone || ''); // Số điện thoại
  const [address, setAddress] = useState(user?.address || ''); // Địa chỉ nhận hàng
  const [note, setNote] = useState(''); // Ghi chú
  const [success, setSuccess] = useState(false); // Trạng thái đặt hàng thành công

  // Đồng bộ lại thông tin khi user thay đổi
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  // Hàm định dạng giá tiền sang VND
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Xử lý submit form đặt hàng
  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra nhập đủ thông tin bắt buộc
    if (!name || !phone || !address) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setSuccess(true); // Hiển thị thông báo đặt hàng thành công
    localStorage.removeItem('cartItems'); // Xóa giỏ hàng
    if (onFinish) setTimeout(onFinish, 1600); // Gọi callback sau khi hoàn tất
  };

  // Nếu đặt hàng thành công, hiển thị thông báo cảm ơn
  if (success) {
    return (
      <div className="checkout-success">
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng tại TechStore.</p>
      </div>
    );
  }

  // Giao diện trang thanh toán
  return (
    <section className="checkout-page">
      <h2>Thanh toán</h2>
      {/* Form nhập thông tin khách hàng */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Họ và tên *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Số điện thoại *</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} pattern="[0-9]{10,11}" required />
        </div>
        <div className="form-group">
          <label>Địa chỉ nhận hàng *</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Ghi chú (tuỳ chọn)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} />
        </div>
        {/* Tổng kết đơn hàng */}
        <div className="checkout-summary">
          <h4>Đơn hàng của bạn</h4>
          <ul className="checkout-products">
            {cartItems.map(item => (
              <li key={item._id || item.id} className="checkout-product-item">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-total">Tổng cộng: <b>{formatPrice(totalPrice)}</b></div>
        </div>
        {/* Nút xác nhận đặt hàng */}
        <button className="checkout-confirm-button" type="submit">Xác nhận đặt hàng</button>
      </form>
    </section>
  );
}

export default CheckoutPage;
