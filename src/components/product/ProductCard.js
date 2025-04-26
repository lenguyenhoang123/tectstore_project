// Component ProductCard: Hiển thị thông tin 1 sản phẩm
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const discount = product.discount || 0;
  const priceOld = product.priceOld || (discount ? Math.round(product.price / (1 - discount / 100)) : null);
  return (
    <div
      className="product-card minimal-card"
      onClick={() => navigate(`/products/${product._id}`, { state: { product } })}
      style={{ cursor: 'pointer' }}
    >
      {discount > 0 && (
        <span className="badge-discount discount-label label-shine">Giảm {discount}%</span>
      )}
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-card-content">
        <h3 className="product-title product-name-pro text-shadow">{product.name}</h3>
        <div className="product-price-row">
          <span className="product-price-new">{formatPrice(product.price)}</span>
          {priceOld && <span className="product-price-old">{formatPrice(priceOld)}</span>}
        </div>
        <div className="product-extra">
          <span className="product-rating">
            <span className="star">★</span>
            {product.rating || 4.8}
          </span>
          <span className="rating-count">Yêu thích</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
