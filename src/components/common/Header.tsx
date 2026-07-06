import { Search, Bell, Plus } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

export default function Header() {
  const { user } = useAppSelector(state => state.auth);

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white rounded-t-[2.5rem]">
      <div className="flex items-center bg-[#F5F6F8] rounded-xl px-4 py-2.5 w-96">
        <Search className="w-4 h-4 text-slate-400 mr-3" />
        <input
          type="text"
          placeholder="Search products, tasks or team members"
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center pl-4 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm mr-3">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400">{user?.role || 'Member'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
