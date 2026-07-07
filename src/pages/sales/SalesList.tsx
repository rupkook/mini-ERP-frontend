import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Eye } from 'lucide-react';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import api from '../../lib/api';
import { format } from 'date-fns';

export default function SalesList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const limit = 10;

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
    },
    {
      label: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, row: any) => (
        <div className="flex justify-end space-x-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setSelectedSale(row)} title="View Details">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
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

      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title="Sale Details"
        maxWidth="max-w-2xl"
      >
        {selectedSale && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-800">Invoice #{selectedSale._id.slice(-6).toUpperCase()}</h4>
                <p className="text-sm text-slate-500">{format(new Date(selectedSale.createdAt), 'MMMM dd, yyyy h:mm a')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{selectedSale.customer?.name || 'Walk-in Customer'}</p>
                <p className="text-sm text-slate-500">{selectedSale.customer?.phone || ''}</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-slate-800 mb-3">Items</h5>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                {selectedSale.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-slate-800">{item.product?.name || 'Unknown Product'}</span>
                      <span className="text-slate-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-slate-800">৳{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-800">৳{selectedSale.subTotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax</span>
                <span className="font-semibold text-slate-800">৳{selectedSale.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Discount</span>
                <span className="font-semibold text-slate-800">-৳{selectedSale.discount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-100 mt-2">
                <span className="text-slate-800">Grand Total</span>
                <span className="text-purple-600">৳{selectedSale.grandTotal?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
