// Component HomePage: Hiển thị danh sách sản phẩm và nút thêm vào giỏ hàng
import React from 'react';
import ProductsPage from './components/product/ProductsPage';
import FeaturesSection from './components/FeaturesSection';

function HomePage({ products, addToCart }) {
  return (
    // Section hiển thị sản phẩm nổi bật
    <section className="featured-products">
      <h2>Sản phẩm nổi bật</h2>
      {/* Trang sản phẩm riêng sử dụng ProductsPage */}
      <ProductsPage products={products} onAddToCart={addToCart} />
      <FeaturesSection />
    </section>
  );
}

export default HomePage;
