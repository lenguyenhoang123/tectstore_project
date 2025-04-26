import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductPage.css';

const API_URL = 'http://localhost:5000/api/products';

const sidebarCategories = [
  'Điện thoại',
  'Laptop',
  'Tablet',
  'Âm thanh',
  'Đồng hồ',
  'Phụ kiện',
];

const brands = ['Tất cả', 'Apple', 'Samsung', 'OPPO'];

function ProductPage({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [brand, setBrand] = useState('Tất cả');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách sản phẩm từ máy chủ.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="product-loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="product-error">{error}</div>;

  // Lọc và sắp xếp sản phẩm
  let filtered = products;
  if (filter !== 'all') filtered = filtered.filter(
    p => p.category && p.category.trim().toLowerCase() === filter.trim().toLowerCase()
  );
  if (brand !== 'Tất cả') filtered = filtered.filter(p => p.brand && p.brand.trim().toLowerCase() === brand.trim().toLowerCase());
  if (sort === 'asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <main className="product-page-container">
      <div className="product-content-layout">
        <aside className="sidebar-filter">
          <h4 className="sidebar-title">Danh mục</h4>
          <ul>
            <li className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tất cả</li>
            {sidebarCategories.map(cat => (
              <li key={cat} className={filter === cat ? 'active' : ''} onClick={() => setFilter(cat)}>{cat}</li>
            ))}
          </ul>
        </aside>
        <section className="product-section">
          <div className="product-page-header">
            <h2 className="product-page-title">Điện thoại nổi bật nhất</h2>
            {/* Button thêm sản phẩm (chỉ hiển thị nếu là admin) */}
            {localStorage.getItem('role') === '1' && (
              <button
                className="add-product-btn"
                onClick={() => window.location.href = '/admin'}
                style={{marginLeft: 16, padding: '8px 18px', background: '#048ee1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer'}}
              >
                + Thêm sản phẩm
              </button>
            )}
            <div className="brand-tab-bar">
              {brands.map(b => (
                <button
                  key={b}
                  className={brand === b ? 'brand-tab active' : 'brand-tab'}
                  onClick={() => setBrand(b)}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="product-filter-bar">
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="phones">Điện thoại</option>
                <option value="laptops">Laptop</option>
                <option value="accessories">Phụ kiện</option>
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </select>
            </div>
          </div>
          <div className="product-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="empty" style={{width:80,opacity:0.7}} />
                <div className="empty-text">Không tìm thấy sản phẩm phù hợp!</div>
              </div>
            ) : (
              filtered.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductPage;
