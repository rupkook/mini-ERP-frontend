import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/api';

export default function CustomerList() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchTerm],
    queryFn: async () => {
      const res = await api.get('/customers', {
        params: { search: searchTerm }
      });
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete customer');
    }
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const canManage = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>
        {canManage && (
          <button className="btn-primary flex items-center" onClick={() => navigate('/customers/add')}>
            <Plus className="w-5 h-5 mr-2" />
            Add Customer
          </button>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F0F5F1] border-b border-[#E2E8E4]">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Email</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Phone</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Address</th>
                {canManage && <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading...</td></tr>
              ) : customers?.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No customers found.</td></tr>
              ) : customers?.map((customer: any) => (
                <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-medium text-slate-800">{customer.name}</td>
                  <td className="py-3 px-6 text-sm text-slate-600">{customer.email}</td>
                  <td className="py-3 px-6 text-sm text-slate-600">{customer.phone || '—'}</td>
                  <td className="py-3 px-6 text-sm text-slate-600">{customer.address || '—'}</td>
                  {canManage && (
                    <td className="py-3 px-6 text-right space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors p-1" onClick={() => navigate(`/customers/edit/${customer._id}`)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors p-1" onClick={() => handleDelete(customer._id, customer.name)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
