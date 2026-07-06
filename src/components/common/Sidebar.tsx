import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Users2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Employee'] },
    { name: 'Products', path: '/products', icon: Package, roles: ['Admin', 'Manager', 'Employee'] },
    { name: 'Customers', path: '/customers', icon: Users2, roles: ['Admin'] },
    { name: 'Sales', path: '/sales', icon: ShoppingCart, roles: ['Admin', 'Manager', 'Employee'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <aside className="w-64 h-full flex flex-col py-6 px-4 bg-[#F5F6F8]">
      <div className="flex items-center px-4 mb-8">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
          M
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Mini ERP</h1>
        </div>
      </div>

      <div className="px-4 mb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/dashboard');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-white shadow-sm text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-black/5'
                }`}
            >
              <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <button onClick={handleLogout} className="flex items-center text-slate-500 hover:text-red-600 transition-colors py-2 text-sm">
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
