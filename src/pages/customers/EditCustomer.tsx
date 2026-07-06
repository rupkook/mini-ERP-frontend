import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

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
        setError(err.response?.data?.message || 'Failed to fetch customer');
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
    setError('');

    try {
      await api.put(`/customers/${id}`, formData);
      navigate('/customers');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-10">Loading customer...</div>;
  }

  return (
    <div className="card max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Edit Customer: {formData.name}</h2>
        <button className="text-slate-500 hover:text-slate-700" onClick={() => navigate('/customers')}>
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

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
  );
}
