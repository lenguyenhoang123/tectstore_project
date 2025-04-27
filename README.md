# TectStore Project

## 1. Tổng quan chức năng

- **Trang chủ:** Hiển thị sản phẩm nổi bật, các tính năng nổi bật của cửa hàng.
- **Tìm kiếm & Danh mục:** Lọc sản phẩm theo loại, tìm kiếm nhanh.
- **Trang sản phẩm:** Xem chi tiết, thêm vào giỏ hàng.
- **Giỏ hàng:** Quản lý sản phẩm đã chọn, cập nhật số lượng, xóa sản phẩm.
- **Thanh toán:** Nhập thông tin, xác nhận đơn hàng.
- **Tài khoản người dùng:** Đăng ký, đăng nhập, chỉnh sửa thông tin cá nhân, avatar.
- **Quản trị:** Thống kê, quản lý sản phẩm, quản lý khách hàng, quản lý đơn hàng.
- **Thông báo, Modal xác nhận, Loading:** Giao diện đồng bộ, hiện đại.

## 2. Ứng dụng xây dựng bằng công nghệ gì?

| Chức năng                | Công nghệ sử dụng           |
|--------------------------|-----------------------------|
| Giao diện người dùng     | ReactJS, React Router       |
| Quản lý trạng thái       | React useState/useEffect    |
| Giao tiếp backend        | Fetch API, RESTful API      |
| Backend                  | Node.js, Express            |
| Quản lý dữ liệu          | MongoDB, Mongoose           |
| Xác thực, phân quyền     | JWT (JSON Web Token)        |
| Giao diện động, responsive| CSS3, Flexbox, Media Query  |
| Icon, UI hiện đại        | react-icons                 |
| Thông báo, Modal         | Component tự xây dựng       |

## 3. Tại sao nên sử dụng app này?
- Quản lý bán hàng, kho, khách hàng, đơn hàng hiệu quả, trực quan.
- Giao diện hiện đại, dễ dùng trên mọi thiết bị.
- Dễ dàng mở rộng, tuỳ biến cho doanh nghiệp vừa và nhỏ.
- Bảo mật tốt, phân quyền rõ ràng.
- Dễ dàng tích hợp thêm các dịch vụ như thanh toán, email, báo cáo.

## 4. Hướng dẫn cài đặt và chạy dự án

### Yêu cầu:
- Node.js >= 16
- MongoDB (local hoặc cloud)

### Cài đặt:
```bash
# Clone dự án về máy
https://github.com/lenguyenhoang123/tectstore_project.git
cd tectstore_project

# Cài đặt dependencies
npm install

# Cấu hình biến môi trường (nếu có)
# Tạo file .env và điền các biến cần thiết (ví dụ: MONGODB_URI, JWT_SECRET, ...)

# Chạy backend (Node.js)
node server.js

# Chạy frontend (React)
npm start
```

- Truy cập frontend tại: http://localhost:3000
- Backend mặc định chạy tại: http://localhost:5000

### Một số lệnh hữu ích
- `npm run build`: Build production
- `npm test`: Chạy test (nếu có)

---
**Mọi thắc mắc/góp ý, vui lòng liên hệ chủ dự án qua GitHub hoặc email trong repo.**
