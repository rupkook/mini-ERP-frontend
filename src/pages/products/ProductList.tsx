import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../../lib/api';
import Table from '../../components/common/Table';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  productImage: string;
}

export default function ProductList() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm, page],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: { search: searchTerm, page, limit: 15 }
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
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const canManage = user?.role === 'Admin' || user?.role === 'Manager';

  const columns = [
    {
      key: 'productImage',
      label: 'Image',
      render: (_: any, row: Product) => (
        <img src={`${API_BASE_URL}${row.productImage}`} alt={row.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
      ),
    },
    {
      key: 'name',
      label: 'Product Name',
      render: (_: any, row: Product) => (
        <span className="font-semibold text-slate-800">{row.name}</span>
      ),
    },
    { key: 'sku', label: 'SKU', render: (val: string) => <span className="text-slate-500">{val}</span> },
    { key: 'category', label: 'Category', render: (val: string) => <span className="text-slate-500">{val}</span> },
    {
      key: 'sellingPrice',
      label: 'Selling Price',
      render: (val: number) => <span className="font-semibold text-slate-800">৳{val?.toFixed(2)}</span>,
    },
    {
      key: 'stockQuantity',
      label: 'Stock',
      render: (val: number) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${val < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {val} in stock
        </span>
      ),
    },
    ...(canManage ? [{
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (_: any, row: Product) => (
        <div className="flex justify-end space-x-2">
          <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" onClick={() => navigate(`/products/edit/${row._id}`)}>
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        {canManage && (
          <button className="btn-primary flex items-center" onClick={() => navigate('/products/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        )}
      </div>

      <Table
        columns={columns}
        data={products?.data || []}
        isLoading={isLoading}
        emptyMessage="No products found."
        page={page}
        totalPages={products?.totalPages || 1}
        total={products?.total || 0}
        limit={15}
        onPageChange={setPage}
      />
    </div>
  );
}
