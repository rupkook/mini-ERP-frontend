import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function AddCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/customers', formData);
      toast.success('Customer added successfully!');
      navigate('/customers');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/customers')} className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customers
      </button>

      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Customer</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="E.g., John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="E.g., john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="E.g., 555-1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="input-field min-h-[100px]" placeholder="Full address..." />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200" onClick={() => navigate('/customers')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
