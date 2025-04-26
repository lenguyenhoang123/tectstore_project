import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import ProductPage from './components/product/ProductPage';
import ProductDetail from './components/product/ProductDetail';
import CartPage from './components/cart/CartPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import AdminPage from './components/admin/AdminPage';
import UserProfile from './components/user/UserProfile';
import AdminStatsPage from './pages/AdminStatsPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import './App.css';

function App() {
  // Khởi tạo user từ localStorage
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [notify, setNotify] = useState(null);

  // Hàm fetch user từ API sau khi đăng nhập
  const fetchUser = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const { success, token, ...userData } = data;
        setUser(userData);
      } else {
        setUser(data);
      }
    } else {
      setUser(null);
    }
  };

  // Hàm lấy giỏ hàng từ backend
  const fetchCart = async () => {
    try {
      const userId = user?._id || localStorage.getItem('userId');
      if (!userId) return;
      const res = await fetch(`http://localhost:5000/api/cart?userId=${userId}`);
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (e) {
      setCartItems([]);
    }
  };

  // Lấy giỏ hàng mỗi khi user đổi hoặc sau khi thêm sp
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [user]);

  // Các hàm xử lý logic chung
  const addToCart = async (product) => {
    try {
      const userId = user?._id || localStorage.getItem('userId');
      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product._id, // Đảm bảo truyền đúng _id
          quantity: 1
        })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart.items || []);
        setNotify({ type: 'success', msg: `Đã thêm ${product.name} vào giỏ hàng!` });
      } else {
        setNotify({ type: 'error', msg: `Lỗi: ${(data.error || 'Không thêm được sản phẩm')}` });
      }
    } catch (e) {
      setNotify({ type: 'error', msg: 'Lỗi kết nối server!' });
    }
  };

  // Tăng số lượng sản phẩm trong giỏ (MongoDB)
  const increaseQuantity = async (productId) => {
    try {
      const userId = user?._id || localStorage.getItem('userId');
      const item = cartItems.find(i => i._id === productId);
      if (!item) return;
      const res = await fetch('http://localhost:5000/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: item.quantity + 1 })
      });
      const data = await res.json();
      if (data.success) {
        fetchCart();
      } else {
        setNotify({ type: 'error', msg: `Lỗi: ${(data.error || 'Không cập nhật được số lượng')}` });
      }
    } catch (e) {
      setNotify({ type: 'error', msg: 'Lỗi kết nối server!' });
    }
  };

  // Giảm số lượng sản phẩm trong giỏ (MongoDB)
  const decreaseQuantity = async (productId) => {
    try {
      const userId = user?._id || localStorage.getItem('userId');
      const item = cartItems.find(i => i._id === productId);
      if (!item) return;
      const res = await fetch('http://localhost:5000/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: item.quantity - 1 })
      });
      const data = await res.json();
      if (data.success) {
        fetchCart();
      } else {
        setNotify({ type: 'error', msg: `Lỗi: ${(data.error || 'Không cập nhật được số lượng')}` });
      }
    } catch (e) {
      setNotify({ type: 'error', msg: 'Lỗi kết nối server!' });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = user?._id || localStorage.getItem('userId');
      const res = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId })
      });
      const data = await res.json();
      if (data.success) {
        fetchCart(); // Cập nhật lại giỏ hàng sau khi xóa
      } else {
        setNotify({ type: 'error', msg: `Lỗi: ${(data.error || 'Không xóa được sản phẩm')}` });
      }
    } catch (e) {
      setNotify({ type: 'error', msg: 'Lỗi kết nối server!' });
    }
  };

  const handleLogin = () => {
    fetchUser();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Hàm tính tổng tiền giỏ hàng
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Hàm chuyển về trang chủ khi bấm "Tiếp tục mua sắm"
  const handleBackToShop = () => {
    window.location.href = '/';
  };

  // Xử lý chuyển sang trang thanh toán
  const gotoCheckout = () => {
    window.location.href = '/checkout';
  };

  // Ẩn notify sau 2.5s
  React.useEffect(() => {
    if (notify) {
      const t = setTimeout(() => setNotify(null), 2500);
      return () => clearTimeout(t);
    }
  }, [notify]);

  return (
    <Router>
      {/* Thông báo chung */}
      {notify && <div className={`global-notify ${notify.type}`}>{notify.msg}</div>}
      <Header user={user} cartItemsCount={cartItems.length} onLogout={handleLogout} />
      <main className="App-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage onAddToCart={addToCart} />} />
          <Route path="/products/:id" element={<ProductDetail onAddToCart={addToCart} products={cartItems.length ? cartItems : undefined} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} removeFromCart={removeFromCart} totalPrice={totalPrice} onBackToShop={handleBackToShop} onCheckout={gotoCheckout} />} />
          <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} totalPrice={totalPrice} user={user} onFinish={handleBackToShop} />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-stats" element={<AdminStatsPage />} />
          <Route path="/admin-customers" element={<AdminCustomersPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
