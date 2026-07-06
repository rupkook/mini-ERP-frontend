import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function Layout() {
  return (
    <div className="h-screen w-screen flex bg-[#F5F6F8] overflow-hidden p-3 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden my-1 mr-1 border border-slate-100 relative">
        <Header />
        <div className="flex-1 overflow-auto px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
