import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Thêm dòng này
import { Home, LayoutGrid, BarChart3, Settings, Bell, Search, Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Định nghĩa danh sách menu với đường dẫn (path)
  const menuItems = [
    { id: 'Home', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'Devices', label: 'Devices', icon: LayoutGrid, path: '/devices' },
    { id: 'Statistics', label: 'Statistics', icon: BarChart3, path: '/statistics' },
    { id: 'Settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo & Close button cho mobile */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-xl">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Home size={20} fill="currentColor" />
              </div>
              <span>SmartHome</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Đóng sidebar khi click trên mobile
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-6 lg:px-10 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-6 ml-auto lg:ml-0">
             <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" 
                  placeholder="Tìm kiếm..." 
                />
             </div>
             
             <div className="flex items-center gap-4 border-l pl-6 border-slate-100">
               <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               
               <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800">Alex Johnson</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
                  </div>
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;