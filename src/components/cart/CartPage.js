// Component CartPage: Giao diện giỏ hàng dạng bảng giống Shopee
import React, { useState } from 'react';
import './CartPage.css';
// Responsive table -> list for mobile
import './CartPage.responsive.css';
import CartList from './CartList.js';
import Modal from '../common/Modal';

function CartPage({ cartItems, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice, onBackToShop, onCheckout }) {
  const [removeId, setRemoveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState(null);
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Xác nhận xóa
  const handleRemove = (id) => setRemoveId(id);
  const confirmRemove = async () => {
    setLoading(true);
    try {
      await removeFromCart(removeId);
      setNotify({ type: 'success', msg: 'Đã xóa sản phẩm khỏi giỏ hàng!' });
    } catch {
      setNotify({ type: 'error', msg: 'Lỗi xóa sản phẩm!' });
    }
    setLoading(false);
    setRemoveId(null);
  };

  return (
    <section className="cart-page">
      <h2>Giỏ hàng của bạn</h2>
      {loading && <div className="cart-loading">Đang xử lý...</div>}
      {notify && <div className={`cart-notify ${notify.type}`}>{notify.msg}</div>}
      <Modal open={!!removeId} title="Xác nhận xóa" onClose={() => setRemoveId(null)} onConfirm={confirmRemove} confirmText="Xóa" cancelText="Hủy">
        Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
      </Modal>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Số tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <CartList
              cartItems={cartItems}
              onRemove={handleRemove}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              renderAsRow
            />
          </table>
          <div className="cart-total-row">
            <span>Tổng cộng:</span>
            <span className="cart-total-price">{formatPrice(totalPrice)}</span>
          </div>
          <div className="cart-actions-row">
            <button className="back-to-shop-button" onClick={onBackToShop}>Tiếp tục mua sắm</button>
            <button className="checkout-button" onClick={onCheckout} disabled={cartItems.length === 0}>Mua hàng</button>
          </div>
        </>
      )}
    </section>
  );
}

export default CartPage;
