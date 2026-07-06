import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    stockQuantity: ''
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      sku: `PRD-${Math.floor(100000 + Math.random() * 900000)}`
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) {
        data.append('productImage', image);
      }

      await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/products')} className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </button>

      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="E.g., Wireless Mouse" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
              <input required name="sku" value={formData.sku} onChange={handleChange} className="input-field" placeholder="E.g., WM-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="input-field">
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Fashion">Fashion</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
              <input required type="number" min="0" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price (৳)</label>
              <input required type="number" step="0.01" min="0" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (৳)</label>
              <input required type="number" step="0.01" min="0" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="input-field" placeholder="0.00" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
            <input required type="file" accept="image/*" onChange={handleFileChange} className="input-field" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200" onClick={() => navigate('/products')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
