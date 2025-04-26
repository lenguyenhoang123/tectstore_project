// Component CartList: Hiển thị danh sách sản phẩm trong giỏ hàng theo dạng bảng nếu có renderAsRow
import React from 'react';
import './CartList.css';
import CartItem from './CartItem';

function CartList({ cartItems, onRemove, onIncrease, onDecrease, renderAsRow }) {
  if (cartItems.length === 0) {
    return <tr><td colSpan="5" className="cart-empty">Giỏ hàng của bạn đang trống.</td></tr>;
  }
  if (renderAsRow) {
    return (
      <tbody>
        {cartItems.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onRemove={() => onRemove(item._id)}
            onIncrease={() => onIncrease(item._id)}
            onDecrease={() => onDecrease(item._id)}
            renderAsRow
          />
        ))}
      </tbody>
    );
  }
  // fallback dạng list cũ (nếu không truyền renderAsRow)
  return (
    <ul className="cart-list">
      {cartItems.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          onRemove={() => onRemove(item._id)}
          onIncrease={() => onIncrease(item._id)}
          onDecrease={() => onDecrease(item._id)}
        />
      ))}
    </ul>
  );
}

export default CartList;
