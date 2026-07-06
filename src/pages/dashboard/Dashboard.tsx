import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Users2, AlertTriangle, TrendingUp, DollarSign, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAppSelector } from '../../store/hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: stats?.totalSales ? `৳${stats.totalSales.toFixed(0)}` : '৳0', subtitle: '+12% from last month', icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Total Customers', value: stats?.totalCustomers || 0, subtitle: '+20% from last month', icon: Users2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Products in Stock', value: stats?.totalProducts || 0, subtitle: 'Across all categories', icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { title: 'Low Stock Alerts', value: stats?.lowStockProducts?.length || 0, subtitle: 'Requires attention', icon: AlertTriangle, color: 'text-rose-600', bgColor: 'bg-rose-100' },
  ];

  // Dummy chart data - in a real app, this would come from the backend
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 6890 },
    { name: 'Sat', sales: 8390 },
    { name: 'Sun', sales: 4490 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back, {user?.name || 'User'}.</h2>
        <p className="text-sm text-slate-500">Here's an overview of your business operations today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                   <ArrowUpRight className="w-3 h-3 mr-1" />
                   15%
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-slate-900 mb-1">{card.value}</p>
              <p className="text-xs text-slate-400 font-medium">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                Sales Performance
              </h3>
              <p className="text-xs text-slate-400 mt-1">Weekly revenue overview</p>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
              View Report <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `৳${value}`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`৳${value}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Low Stock Overview */}
          <div className="card flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Package className="w-5 h-5 text-rose-500 mr-2" />
                  Low Stock Items
                </h3>
                <p className="text-xs text-slate-400 mt-1">Products needing restock</p>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-auto pr-2">
              {stats?.lowStockProducts?.length > 0 ? stats.lowStockProducts.slice(0, 3).map((product: any) => (
                <div key={product._id || product.id} className="p-3 rounded-xl border border-slate-100 bg-[#F8F9FA]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 shrink-0 ml-2">
                      {product.stockQuantity || product.stock} left
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mb-2">
                    <span className="truncate">{product.sku}</span>
                    <span className="mx-2">•</span>
                    <span className="truncate">{product.category}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full" 
                      style={{ width: `${Math.min(100, ((product.stockQuantity || product.stock) / 20) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-slate-100 rounded-xl">
                  <Package className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-600">All Stocked Up</p>
                  <p className="text-xs text-slate-400 mt-1">No products are currently low on stock.</p>
                </div>
              )}
            </div>
            
            {stats?.lowStockProducts?.length > 3 && (
              <button 
                onClick={() => navigate('/products')}
                className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-colors border border-slate-100"
              >
                View All Low Stock
              </button>
            )}
          </div>

          {/* High Stock Overview */}
          <div className="card flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Package className="w-5 h-5 text-emerald-500 mr-2" />
                  High Stock Items
                </h3>
                <p className="text-xs text-slate-400 mt-1">Products well stocked</p>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-auto pr-2">
              {stats?.highStockProducts?.length > 0 ? stats.highStockProducts.slice(0, 3).map((product: any) => (
                <div key={product._id || product.id} className="p-3 rounded-xl border border-slate-100 bg-[#F8F9FA]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0 ml-2">
                      {product.stockQuantity || product.stock} in stock
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mb-2">
                    <span className="truncate">{product.sku}</span>
                    <span className="mx-2">•</span>
                    <span className="truncate">{product.category}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${Math.min(100, ((product.stockQuantity || product.stock) / 100) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-slate-100 rounded-xl">
                  <Package className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-600">No High Stock Data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions ERP Context */}
      {user?.role !== 'Employee' && (
        <div className="card">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Operations</h3>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/sales/add')}
              className="flex items-center px-4 py-2.5 bg-[#F8F9FA] border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white hover:shadow-sm transition-all"
            >
              <ShoppingCart className="w-4 h-4 mr-2 text-purple-600" /> New Sale
            </button>
            <button 
              onClick={() => navigate('/products/add')}
              className="flex items-center px-4 py-2.5 bg-[#F8F9FA] border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white hover:shadow-sm transition-all"
            >
              <Package className="w-4 h-4 mr-2 text-emerald-600" /> Add Product
            </button>
            {user?.role === 'Admin' && (
              <button 
                onClick={() => navigate('/customers/add')}
                className="flex items-center px-4 py-2.5 bg-[#F8F9FA] border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white hover:shadow-sm transition-all"
              >
                <Users2 className="w-4 h-4 mr-2 text-blue-600" /> Add Customer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
