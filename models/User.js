const mongoose = require('mongoose');
const roleMap = { 1: 'admin', 2: 'manager', 3: 'customer' };
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Number, default: 3, enum: [1, 2, 3] }, // 1: admin, 2: manager, 3: customer
  email: { type: String },
  profile: {
    fullname: { type: String },
    phone: { type: String }
  },
  token: { type: String }, // Thêm trường token để lưu JWT
}, {
  collection: 'users' // Đảm bảo luôn dùng collection 'users' (chữ thường)
});

module.exports = mongoose.model('User', UserSchema);
