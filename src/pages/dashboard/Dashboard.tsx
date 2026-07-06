import { useQuery } from '@tanstack/react-query';
import { Package, Users, DollarSign, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

const mockDashboardStats = {
  totalProducts: 124,
  totalCustomers: 45,
  totalSales: 8900.50,
  lowStockProducts: [
    { id: '1', name: 'Wireless Mouse', stock: 2 },
    { id: '2', name: 'Mechanical Keyboard', stock: 4 },
  ]
};

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data.data;
    }
  });

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Customers', value: stats?.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Sales (৳)', value: stats?.totalSales ? `৳${stats.totalSales.toFixed(2)}` : '৳0.00', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="card flex items-center p-6">
              <div className={`p-4 rounded-full ${card.bg} ${card.color} mr-6`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
            Low Stock Products
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Product Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Current Stock</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.lowStockProducts.map((product: any) => (
                <tr key={product._id || product.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{product.stockQuantity || product.stock}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Low Stock
                    </span>
                  </td>
                </tr>
              ))}
              {stats?.lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500 text-sm">
                    No products are currently low in stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
