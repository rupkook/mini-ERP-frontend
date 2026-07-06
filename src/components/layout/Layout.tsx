import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Users } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

export default function Layout() {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Sales', path: '/sales', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen flex bg-[#F9F9F6]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A2518] border-r border-[#0A2518] flex flex-col text-white">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <h1 className="text-xl font-bold">
            <span className="text-orange-500">Mini </span>
            <span className="text-white">ERP</span>
          </h1>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/10 text-orange-500 font-medium' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-orange-500' : 'text-white/50'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mr-3">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/50">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors border border-red-500/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {location.pathname.split('/')[1] || 'Dashboard'}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
