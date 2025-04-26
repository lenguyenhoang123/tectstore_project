const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // Đặt bí mật mạnh hơn ở môi trường production

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // Cho phép gọi API từ frontend tại port 3000
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());

// Kết nối MongoDB (dùng tên database theo tên dự án: techstore)
mongoose.connect('mongodb://localhost:27017/techstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected!'));

// Định nghĩa model sản phẩm
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
}));

// Định nghĩa model User
const User = require('./models/User');

// API lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// API thêm sản phẩm
app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

// --- API Đăng ký ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email, profile } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Thiếu tên đăng nhập hoặc mật khẩu!' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Tài khoản đã tồn tại' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, email, profile });
    await user.save();
    // Sửa: trả về đầy đủ thông tin user vừa đăng ký
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({
      success: true,
      token,
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      profile: user.profile
    });
  } catch (err) {
    console.error('Lỗi khi đăng ký:', err);
    res.status(500).json({ error: 'Đăng ký thất bại!' });
  }
});

// --- API Đăng nhập ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '2h' });
  // Trả về đầy đủ thông tin user cho frontend
  res.json({
    success: true,
    token,
    _id: user._id,
    username: user.username,
    role: user.role,
    email: user.email,
    profile: user.profile // Bổ sung profile
  });
});

// API lấy thông tin user theo id
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==== API thống kê tổng quan cho admin ====
const Order = require('./models/Order');

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'delivered'] } } },
      { $group: { _id: null, sum: { $sum: '$total' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.sum || 0;
    const totalCustomers = await Order.distinct('userId');
    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers: totalCustomers.length
    });
  } catch (e) {
    console.error('API /api/admin/stats error:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==== API danh sách khách hàng cho admin ====
app.get('/api/admin/customers', async (req, res) => {
  try {
    // Lấy tất cả user có role = 3 (khách hàng đặc biệt)
    const users = await User.find({ role: 3 });
    // Lấy orders để tính số đơn và tổng chi tiêu
    const orders = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'delivered'] } } },
      { $group: {
        _id: '$userId',
        ordersCount: { $sum: 1 },
        totalSpent: { $sum: '$total' }
      }}
    ]);
    // Map userId => thống kê order
    const orderStats = {};
    orders.forEach(o => {
      orderStats[o._id?.toString()] = {
        ordersCount: o.ordersCount,
        totalSpent: o.totalSpent
      };
    });
    // Gộp dữ liệu user + thống kê order
    const result = users.map(u => ({
      _id: u._id,
      name: u.profile?.fullname || u.username || '',
      email: u.email,
      phone: u.profile?.phone || '',
      ordersCount: orderStats[u._id.toString()]?.ordersCount || 0,
      totalSpent: orderStats[u._id.toString()]?.totalSpent || 0
    }));
    res.json(result);
  } catch (e) {
    console.error('API /api/admin/customers error:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==== API: Thêm sản phẩm vào giỏ hàng ====
const Cart = require('./models/Cart');

app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) return res.status(400).json({ error: 'Thiếu thông tin!' });
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // Ép productId về string cả hai phía để so sánh tuyệt đối
      const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
      if (idx > -1) {
        cart.items[idx].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();
    res.json({ success: true, cart });
  } catch (e) {
    console.error('API /api/cart/add error:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==== API: Lấy giỏ hàng của user ====
app.get('/api/cart', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Thiếu userId' });
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    // Đưa về dạng dễ dùng cho frontend
    const items = cart.items.map(i => ({
      _id: i.productId._id,
      name: i.productId.name,
      price: i.productId.price,
      image: i.productId.image,
      quantity: i.quantity
    }));
    res.json({ items });
  } catch (e) {
    console.error('API /api/cart error:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==== API: Xóa sản phẩm khỏi giỏ hàng ====
app.post('/api/cart/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'Thiếu thông tin!' });
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Không tìm thấy giỏ hàng' });
    cart.items = cart.items.filter(i => String(i.productId) !== String(productId));
    await cart.save();
    res.json({ success: true, cart });
  } catch (e) {
    console.error('API /api/cart/remove error:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==== API: Cập nhật số lượng sản phẩm trong giỏ hàng ====
app.post('/api/cart/update', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || typeof quantity !== 'number') return res.status(400).json({ error: 'Thiếu thông tin!' });
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Không tìm thấy giỏ hàng' });
    const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
    if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong giỏ' });
    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }
    await cart.save();
    res.json({ success: true, cart });
  } catch (e) {
    console.error('API /api/cart/update error:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ==== API: Thanh toán giỏ hàng ====
app.post('/api/cart/checkout', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Thiếu userId!' });
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Giỏ hàng trống!' });
    // Tạo đơn hàng mới (giả lập)
    const order = {
      userId,
      items: cart.items.map(i => ({
        productId: i.productId._id,
        name: i.productId.name,
        price: i.productId.price,
        quantity: i.quantity
      })),
      total: cart.items.reduce((sum, i) => sum + i.productId.price * i.quantity, 0),
      createdAt: new Date()
    };
    // Xóa giỏ hàng sau khi thanh toán
    cart.items = [];
    await cart.save();
    res.json({ success: true, order });
  } catch (e) {
    console.error('API /api/cart/checkout error:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
