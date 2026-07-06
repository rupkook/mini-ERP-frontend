import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import Table from '../../components/common/Table';

export default function CustomerList() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchTerm, page],
    queryFn: async () => {
      const res = await api.get('/customers', {
        params: { search: searchTerm, page, limit: 10 }
      });
      return {
        data: res.data.data,
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1
      };
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    }
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const canManage = user?.role === 'Admin';

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (val: string) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    { key: 'email', label: 'Email', render: (val: string) => <span className="text-slate-500">{val}</span> },
    { key: 'phone', label: 'Phone', render: (val: string) => <span className="text-slate-500">{val || '—'}</span> },
    { key: 'address', label: 'Address', render: (val: string) => <span className="text-slate-500">{val || '—'}</span> },
    ...(canManage ? [{
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end space-x-2">
          <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" onClick={() => navigate(`/customers/edit/${row._id}`)}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDelete(row._id, row.name)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        {canManage && (
          <button className="btn-primary flex items-center" onClick={() => navigate('/customers/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        )}
      </div>

      <Table
        columns={columns}
        data={customers?.data || []}
        isLoading={isLoading}
        emptyMessage="No customers found."
        page={page}
        totalPages={customers?.totalPages || 1}
        total={customers?.total || 0}
        limit={10}
        onPageChange={setPage}
      />
    </div>
  );
}
