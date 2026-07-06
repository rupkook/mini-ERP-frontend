import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get(`/customers/${id}`);
        const c = res.data.data;
        setFormData({
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          address: c.address || '',
        });
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch customer');
      } finally {
        setFetching(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/customers/${id}`, formData);
      toast.success('Customer updated successfully!');
      navigate('/customers');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <span>Loading customer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/customers')} className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customers
      </button>

      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Customer: {formData.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="input-field min-h-[100px]" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200" onClick={() => navigate('/customers')}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? 'Saving...' : 'Update Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
