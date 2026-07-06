import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import Table from '../../components/common/Table';
import api from '../../lib/api';
import { format } from 'date-fns';

export default function SalesList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['sales', page],
    queryFn: async () => {
      const res = await api.get(`/sales?page=${page}&limit=${limit}`);
      return res.data;
    }
  });

  const columns = [
    {
      label: 'Invoice ID',
      key: '_id',
      render: (val: any) => <span className="font-mono text-xs font-semibold text-slate-500">#{val ? val.toString().slice(-6).toUpperCase() : 'N/A'}</span>
    },
    {
      label: 'Customer',
      key: 'customer',
      render: (val: any) => <span className="font-semibold text-slate-800">{val?.name || 'Unknown Customer'}</span>
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (val: any) => <span className="text-slate-500">{val ? format(new Date(val), 'MMM dd, yyyy') : 'N/A'}</span>
    },
    {
      label: 'Items',
      key: 'items',
      render: (val: any) => <span className="text-slate-500">{val?.length || 0} items</span>
    },
    {
      label: 'Total',
      key: 'grandTotal',
      render: (val: any) => <span className="font-bold text-slate-900">৳{val ? val.toFixed(2) : '0.00'}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-purple-600" />
            Sales History
          </h2>
          <p className="text-sm text-slate-500 mt-1">View and manage all sales transactions.</p>
        </div>
        
        <button 
          onClick={() => navigate('/sales/add')}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> New Sale
        </button>
      </div>

      <Table 
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.pagination?.totalPages || 1}
        total={data?.pagination?.total || 0}
        limit={limit}
        onPageChange={setPage}
        emptyMessage="No sales found. Create your first sale!"
      />
    </div>
  );
}
