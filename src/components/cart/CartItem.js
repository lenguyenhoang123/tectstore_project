// Component CartItem: Hiển thị 1 sản phẩm trong giỏ hàng (tối ưu, dễ hiểu, style đẹp)
import React, { useState } from 'react';
import './CartItem.css';

function CartItem({ item, onRemove, onIncrease, onDecrease, renderAsRow }) {
  // Hàm định dạng giá tiền sang VND
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  // State lưu đánh giá (1-5 sao)
  const [rating, setRating] = useState(0);

  // Component đánh giá sao (tách riêng cho dễ tái sử dụng)
  const RatingStars = () => (
    <div className="cart-item-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'star active' : 'star'}
          style={{ cursor: 'pointer', color: star <= rating ? '#FFD700' : '#ccc', fontSize: '1.1em' }}
          onClick={() => setRating(star)}
          aria-label={`Đánh giá ${star} sao`}
        >★</span>
      ))}
      <span className="cart-item-rating-label" style={{marginLeft: 6, fontSize: '0.95em'}}>{rating > 0 ? `${rating}/5` : 'Chưa đánh giá'}</span>
    </div>
  );

  if (renderAsRow) {
    return (
      <tr className="cart-item-row">
        <td className="cart-item-product">
          <img src={item.image} alt={item.name} className="cart-item-image" style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 8}} />
          <div>
            <div className="cart-item-name" style={{fontWeight: 600}}>{item.name}</div>
            <RatingStars />
          </div>
        </td>
        <td className="cart-item-price">{formatPrice(item.price)}</td>
        <td className="cart-item-qty">
          <button className="cart-qty-btn" onClick={onDecrease} aria-label="Giảm số lượng">-</button>
          <span className="cart-qty-value">{item.quantity}</span>
          <button className="cart-qty-btn" onClick={onIncrease} aria-label="Tăng số lượng">+</button>
        </td>
        <td className="cart-item-total">{formatPrice(item.price * item.quantity)}</td>
        <td className="cart-item-action">
          <button className="remove-from-cart-button" onClick={onRemove} type="button">Xóa</button>
        </td>
      </tr>
    );
  }

  // fallback dạng list cũ
  return (
    <li className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">{formatPrice(item.price)}</p>
        <RatingStars />
      </div>
      <div className="cart-item-quantity-row">
        <button className="cart-qty-btn" onClick={onDecrease} aria-label="Giảm số lượng">-</button>
        <span className="cart-qty-value">{item.quantity}</span>
        <button className="cart-qty-btn" onClick={onIncrease} aria-label="Tăng số lượng">+</button>
      </div>
      <button className="remove-from-cart-button" onClick={onRemove} type="button">Xóa</button>
    </li>
  );
}

export default CartItem;
