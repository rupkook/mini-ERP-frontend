import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/api';

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
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete product');
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>
        {canManage && (
          <button className="btn-primary flex items-center" onClick={() => navigate('/products/add')}>
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F0F5F1] border-b border-[#E2E8E4]">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Image</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Product Name</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">SKU</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Selling Price</th>
                <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider">Stock</th>
                {canManage && <th className="py-4 px-6 text-xs font-bold text-[#0A2518] uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-500">Loading...</td></tr>
              ) : products?.data.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-500">No products found.</td></tr>
              ) : products?.data.map((product: Product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6">
                    <img src={`http://localhost:5000${product.productImage}`} alt={product.name} className="w-10 h-10 rounded-md object-cover border border-slate-200" />
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-800">{product.name}</td>
                  <td className="py-3 px-6 text-sm text-slate-600">{product.sku}</td>
                  <td className="py-3 px-6 text-sm text-slate-600">{product.category}</td>
                  <td className="py-3 px-6 font-medium text-slate-800">৳{product.sellingPrice.toFixed(2)}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${product.stockQuantity < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stockQuantity} in stock
                    </span>
                  </td>
                  {canManage && (
                    <td className="py-3 px-6 text-right space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors p-1" onClick={() => navigate(`/products/edit/${product._id}`)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors p-1" onClick={() => handleDelete(product._id, product.name)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
          <span className="text-sm text-slate-600">
            {products?.data.length ? `Showing ${products.data.length} of ${products.total} items` : 'No items'}
          </span>
          <div className="space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {page} of {products?.totalPages || 1}</span>
            <button 
              disabled={page >= (products?.totalPages || 1)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
