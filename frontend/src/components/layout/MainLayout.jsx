import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar đã tách file ở bước 2
import { Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Mobile Toggle Button (Only visible on mobile) */}
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-slate-600"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>

        {/* Nội dung trang con sẽ lấp đầy khu vực này */}
        <main className="flex-1 h-full overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;