// src/components/layout/Sidebar.jsx
import React from 'react';
import { LayoutGrid, Home, UserCog, Users, ChartNetwork, LogOut, MonitorSmartphone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={20} />, label: 'Spaces', path: '/app/spaces' },
    { icon: <LayoutGrid size={20} />, label: 'Rooms', path: '/app/rooms' },
    { icon: <MonitorSmartphone size={20} />, label: 'Devices', path: '/app/devices' },
    
    // Đã khớp với App.jsx (/app/members)
    { icon: <Users size={20} />, label: 'Members', path: '/app/members' }, 
    
    { icon: <ChartNetwork size={20} />, label: 'Statistics', path: '/app/statistics' },
  ];

  const isProfileActive = location.pathname === '/app/settings';

  return (
    <div className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col p-8 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600 text-white font-bold">
           {/* Nếu chưa có ảnh logo thực, dùng placeholder này, hoặc dùng thẻ img như cũ */}
           <img src={logo} alt="Smart House" className="w-full h-full object-contain bg-white" />
        </div>
        <span>
          <span className="text-xl font-bold text-slate-800 tracking-tight">smart</span>
          <span className="text-xl text-slate-800 tracking-tight">house</span>
        </span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-12">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1__nUveMs5K4VA2cdLheJMT6C-tqFQveppg&s" 
          className="w-12 h-12 rounded-full object-cover shadow-sm" 
          alt="user" 
        />
        <div>
          <p className="text-slate-400 text-xs font-medium">Welcome home,</p>
          <p className="text-slate-800 font-bold">Duong</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          // Logic Highlight: Kiểm tra chính xác đường dẫn
          const isActive = location.pathname.startsWith(item.path); 
          
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' // Highlight: Xanh
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600' // Mặc định: Xám
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer Menu */}
      <div className="pt-8 space-y-2 border-t border-slate-50">
        <button 
          onClick={() => navigate('/app/settings')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
            isProfileActive 
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
          }`}
        >
          <UserCog size={20} />
          Profile & Settings
        </button>

        <button 
        onClick={() => navigate('/')}
        className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 font-bold hover:bg-red-50 hover:text-red-500 transition-all rounded-xl mt-2">
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;