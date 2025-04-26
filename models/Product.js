const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên sản phẩm
  price: { type: Number, required: true }, // Giá hiện tại
  priceOld: { type: Number }, // Giá cũ (nếu có)
  image: { type: String }, // Ảnh đại diện
  images: [String], // Danh sách ảnh
  description: { type: String }, // Mô tả sản phẩm
  specifications: { type: mongoose.Schema.Types.Mixed, default: '' }, // Thông số kỹ thuật (có thể là chuỗi, object, array)
  features: [String], // Các tính năng nổi bật
  category: { 
    type: String, 
    set: v => v && typeof v === 'string' ? v.trim() : v // Tự động trim khi lưu DB
  }, // Danh mục sản phẩm
  brand: { type: String }, // Thương hiệu
  stock: { type: Number, default: 0 }, // Số lượng tồn kho
  variants: [{ name: String, price: Number, stock: Number }], // Các phiên bản (màu, dung lượng...)
  promotions: [String], // Khuyến mãi áp dụng
  tradeInPrice: { type: Number }, // Giá thu cũ đổi mới
  memberDiscount: { type: Number }, // Giảm giá cho thành viên
  installmentInfo: { type: String }, // Thông tin trả góp
  warrantyInfo: { type: String }, // Thông tin bảo hành
  shopLocations: [String], // Danh sách cửa hàng
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người đánh giá
    stars: { type: Number, min: 1, max: 5 }, // Số sao đánh giá
    comment: { type: String } // Bình luận
  }]
}, { timestamps: true }); // Thêm thời gian tạo/cập nhật tự động

// Xuất model Product
module.exports = mongoose.model('Product', ProductSchema);
