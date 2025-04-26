import React, { useEffect, useState } from 'react';
import './AdminPage.css';
// import AdminStats from './AdminStats';

const API_URL = 'http://localhost:5000/api/products';

const initialForm = {
  name: '',
  price: '',
  priceOld: '',
  image: '',
  description: '',
  brand: '',
  category: '',
  stock: '',
  specifications: ''
};

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch product list
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setError('Không thể tải danh sách sản phẩm.'));
  }, []);

  // Handle form input
  const handleChange = e => {
    const name = e.target.name;
    let value = e.target.value;
    // Nếu là category thì chuẩn hóa luôn
    if (name === 'category') value = value.trim();
    setForm({ ...form, [name]: value });
  };

  // Add or update product
  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.price) {
      setError('Tên và giá sản phẩm là bắt buộc!');
      return;
    }
    const submitData = {
      ...form,
      price: Number(form.price),
      priceOld: form.priceOld ? Number(form.priceOld) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      specifications: form.specifications
    };
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      }
      if (!res.ok) throw new Error('Lỗi khi lưu sản phẩm');
      setSuccess(editingId ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
      setForm(initialForm);
      setEditingId(null);
      fetch(API_URL).then(res => res.json()).then(setProducts);
    } catch {
      setError('Lỗi khi lưu sản phẩm!');
    }
  };

  // Edit product
  const handleEdit = prod => {
    setForm({
      name: prod.name || '',
      price: prod.price || '',
      priceOld: prod.priceOld || '',
      image: prod.image || '',
      description: prod.description || '',
      brand: prod.brand || '',
      category: prod.category || '',
      stock: prod.stock || '',
      specifications: typeof prod.specifications === 'object' ? JSON.stringify(prod.specifications, null, 2) : (prod.specifications || '')
    });
    setEditingId(prod._id);
    setError(''); setSuccess('');
  };

  // Delete product
  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts(products.filter(p => p._id !== id));
      setSuccess('Đã xóa sản phẩm!');
      setForm(initialForm);
      setEditingId(null);
    } catch {
      setError('Lỗi khi xóa sản phẩm!');
    }
  };

  return (
    <div className="admin-page">
      <h2>Quản lý sản phẩm</h2>
      {/* <AdminStats /> */}
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
      <form className="admin-form" onSubmit={handleSubmit} style={{flexWrap:'wrap',gap:10}}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên sản phẩm" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Giá" type="number" />
        <input name="priceOld" value={form.priceOld} onChange={handleChange} placeholder="Giá gốc (tuỳ chọn)" type="number" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Ảnh chính (link)" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Hãng (brand)" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Danh mục" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Tồn kho" type="number" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả ngắn" rows={2} />
        <textarea name="specifications" value={form.specifications} onChange={handleChange} placeholder="Thông số kỹ thuật (mỗi dòng 1 mục hoặc JSON)" rows={3} />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }}>Hủy</button>}
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Ảnh</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod._id}>
              <td style={{verticalAlign: 'top', fontWeight: 600}}>{prod.name}</td>
              <td style={{verticalAlign: 'top', color: '#048ee1', fontWeight: 700}}>{prod.price.toLocaleString()}</td>
              <td style={{verticalAlign: 'top'}}>{prod.image && <img src={prod.image} alt="sp" style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e3e8ee'}} />}</td>
              <td style={{verticalAlign: 'top', maxWidth: 300, whiteSpace: 'pre-line', fontSize: '0.98em'}}>{prod.description}</td>
              <td style={{verticalAlign: 'top'}}>
                <button className="btn-edit admin-action-btn" onClick={() => handleEdit(prod)}>Sửa</button>
                <button className="btn-delete admin-action-btn" onClick={() => handleDelete(prod._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
