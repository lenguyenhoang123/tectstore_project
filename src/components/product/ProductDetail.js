import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

// Hàm tính điểm trung bình đánh giá
function getAverageRating(reviews) {
  if (!reviews || !reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
}

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState('');
  const [mainImg, setMainImg] = useState(product?.image || '');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([
    { user: 'Nguyễn Văn A', rating: 5, comment: 'Sản phẩm rất tốt, giao hàng nhanh!' },
    { user: 'Trần Thị B', rating: 4, comment: 'Hàng đẹp, đúng mô tả, sẽ ủng hộ tiếp.' },
    { user: 'Lê Văn C', rating: 5, comment: 'Rất hài lòng, chất lượng vượt mong đợi.' },
  ]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!product) {
      setLoading(true);
      fetch(`http://localhost:5000/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setMainImg(data.image);
          setLoading(false);
        })
        .catch(() => {
          setError('Không thể tải thông tin sản phẩm.');
          setLoading(false);
        });
    } else {
      setMainImg(product.image);
    }
  }, [id, product]);

  useEffect(() => {
    if (product?.category) {
      fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(product.category)}`)
        .then(res => res.json())
        .then(data => setRelatedProducts(data.filter(p => p._id !== product._id))) // Loại trừ chính sản phẩm đang xem
        .catch(() => setRelatedProducts([]));
    }
  }, [product?.category, product?._id]);

  // Hàm chuẩn hóa dữ liệu specifications
  const normalizeSpecifications = (specs) => {
    if (Array.isArray(specs)) {
      if (specs.length && typeof specs[0] === 'object' && specs[0].label && specs[0].value) return specs;
      return specs.map(s => {
        const [label, ...value] = s.split(':');
        return { label: label?.trim(), value: value.join(':').trim() };
      });
    }
    if (typeof specs === 'object' && specs !== null) {
      return Object.entries(specs).map(([label, value]) => ({ label, value }));
    }
    if (typeof specs === 'string') {
      // Xử lý chuỗi nhiều dòng, mỗi cặp 2 dòng là 1 thông số
      const lines = specs.split('\n').map(l => l.trim()).filter(Boolean);
      const arr = [];
      for (let i = 0; i < lines.length - 1; i += 2) {
        arr.push({ label: lines[i], value: lines[i + 1] });
      }
      return arr;
    }
    return [];
  };
  const specsData = normalizeSpecifications(product?.specifications);

  if (loading) return <div className="product-loading">Đang tải chi tiết sản phẩm...</div>;
  if (error) return <div className="product-error">{error}</div>;
  if (!product) return null;

  const priceOld = product.priceOld || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : null);
  const thumbs = [product.image, ...(product.images || [])].filter(Boolean);

  // Dummy data cho demo các box
  const promotions = [
    'Tặng voucher 500.000đ mua Gia dụng',
    'Bảo hành chính hãng 12 tháng',
    'Miễn phí giao hàng toàn quốc',
    'Giảm thêm 5% khi thanh toán qua ví điện tử',
  ];

  const related = [
    { name: 'iPhone 15 Pro', image: product.image, price: 29990000 },
    { name: 'Samsung S24 Ultra', image: product.image, price: 25990000 },
    { name: 'OPPO Reno10', image: product.image, price: 10990000 },
  ];

  return (
    <div className="product-detail-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <span onClick={() => navigate('/')}>Trang chủ</span> &gt; 
        <span onClick={() => navigate('/products')}>Sản phẩm</span> &gt; 
        <span>{product.name}</span>
      </nav>
      <div className="product-detail-pro">
        <div className="left">
          <img className="main-img" src={mainImg} alt={product.name} />
          <div className="thumbs">
            {thumbs.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={mainImg === img ? 'selected' : ''}
                onClick={() => setMainImg(img)}
              />
            ))}
          </div>
          {/* Box khuyến mãi */}
          <div className="promo-box">
            <div className="promo-title">Khuyến mãi</div>
            <ul className="promo-list">
              {promotions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right">
          <h1 className="product-title">{product.name}</h1>
          <div className="brand-cat">{product.brand} | {product.category}</div>
          <div className="product-rating-and-quick">
            <div className="product-rating">
              <span style={{ color: '#f6b01e', fontWeight: 700 }}>{product.rating || 4.8} ★</span>
              <span style={{ color: '#666', marginLeft: 8 }}>{product.numReviews ? `(${product.numReviews} đánh giá)` : '(120 đánh giá)'}</span>
            </div>
          </div>
          <div className="price-row">
            <span className="price">{product.price.toLocaleString('vi-VN')}₫</span>
            {priceOld && <span className="price-old">{priceOld.toLocaleString('vi-VN')}₫</span>}
            {priceOld && <span className="saving">Tiết kiệm {priceOld - product.price}₫</span>}
          </div>
          <div className="desc">{product.description}</div>
          {/* Thông số kỹ thuật & Đánh giá/nhận xét hiện đại */}
          <div className="product-specs-review">
            <div className="specs-col">
              <div className="specs-title">Thông số kỹ thuật</div>
              <table className="specs-table">
                <tbody>
                  {specsData.length > 0
                    ? specsData.map((item, idx) => (
                        <tr key={idx}>
                          <th style={{width: '40%', textAlign: 'left', fontWeight: 'bold'}}>{item.label}</th>
                          <td style={{width: '60%', textAlign: 'left'}}>
                            {typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}
                          </td>
                        </tr>
                      ))
                    : <tr><td colSpan="2">Không có dữ liệu thông số kỹ thuật.</td></tr>
                  }
                </tbody>
              </table>
            </div>
            <div className="review-col">
              <div className="review-header">
                <span className="review-score">{getAverageRating(reviews).toFixed(1)}</span>
                <span className="review-stars">{'★'.repeat(Math.round(getAverageRating(reviews)))}</span>
                <span className="review-count">({reviews.length} đánh giá)</span>
              </div>
              <ul className="review-list">
                {reviews.slice(0, 3).map((r, i) => (
                  <li key={i}>
                    <span className="review-user">{r.user}</span>
                    <span className="review-star">{'★'.repeat(r.rating)}</span>
                    <span className="review-comment">{r.comment}</span>
                  </li>
                ))}
              </ul>
              <form className="review-form" onSubmit={(e) => {
                e.preventDefault();
                if (!reviewText.trim()) return;
                setReviews([...reviews, { user: 'Bạn', rating: reviewRating, comment: reviewText }]);
                setReviewText('');
                setReviewRating(5);
              }}>
                <div className="review-stars-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={star <= reviewRating ? 'star active' : 'star'} onClick={() => setReviewRating(star)}>★</span>
                  ))}
                </div>
                <textarea placeholder="Viết nhận xét..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                <button type="submit">Gửi nhận xét</button>
              </form>
            </div>
          </div>
          <div className="actions">
            <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
              Thêm vào giỏ
            </button>
            <button className="buy-now-btn">Mua ngay</button>
            <button className="share-btn">Chia sẻ</button>
          </div>
          {/* Box bảo hành/đổi trả */}
          <div className="warranty-box">
            <div className="warranty-title">Bảo hành & Đổi trả</div>
            <div className="warranty-desc">12 tháng chính hãng, 1 đổi 1 trong 30 ngày nếu lỗi NSX. Hỗ trợ đổi trả tại cửa hàng toàn quốc.</div>
          </div>
        </div>
      </div>
      {/* Sản phẩm liên quan */}
      <div className="related-box">
        <div className="related-title">Sản phẩm liên quan</div>
        <div className="related-list">
          {related.map((r, i) => (
            <div className="related-item" key={i}>
              <img src={r.image} alt={r.name} />
              <div className="related-name">{r.name}</div>
              <div className="related-price">{r.price.toLocaleString('vi-VN')}₫</div>
            </div>
          ))}
        </div>
      </div>
      <div className="related-products" style={{marginTop: 32}}>
        <h3>Sản phẩm cùng danh mục</h3>
        <ul style={{display: 'flex', flexWrap: 'wrap', gap: '16px', listStyle: 'none', padding: 0}}>
          {relatedProducts.length > 0 ? relatedProducts.map(p => (
            <li key={p._id} style={{border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, minWidth: 180}}>
              <div style={{fontWeight: 600}}>{p.name}</div>
              {p.image && <img src={p.image} alt={p.name} style={{maxWidth: '100%', height: 80, objectFit: 'contain', margin: '8px 0'}} />}
              <div style={{color: '#1976d2', fontWeight: 700}}>{p.price?.toLocaleString('vi-VN')}₫</div>
            </li>
          )) : <li>Không có sản phẩm nào cùng danh mục.</li>}
        </ul>
      </div>
    </div>
  );
}

export default ProductDetail;
