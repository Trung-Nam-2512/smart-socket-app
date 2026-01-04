// src/pages/DeviceDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// Đảm bảo bạn đã di chuyển 2 file này vào thư mục components/devices
import SpeakerDetail from '../components/devices/SpeakerDetail';
import ACDetail from '../components/devices/ACDetail';
import LampDetail from '../components/devices/LampDetail';

const DeviceDetail = () => {
  const { deviceId } = useParams(); // Lấy id từ URL (ví dụ: 'speaker', 'ac')
  const navigate = useNavigate();

  const renderContent = () => {
    switch (deviceId) {
      case 'speaker': 
        return <SpeakerDetail />;
      // Sửa case 'humidifier' thành 'ac' để khớp logic, hoặc giữ nguyên tùy ý bạn
      // Ở đây mình để 'ac' cho khớp với file Devices.jsx bên dưới
      case 'ac': 
        return <ACDetail />;
      case 'lamp': // Thêm case này
        return <LampDetail />;
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-300">
            <p className="text-xl font-bold">Coming Soon</p>
            <p className="text-sm">Device interface for "{deviceId}" is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] h-screen flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-8 flex items-center justify-between flex-shrink-0 bg-[#F8FAFC] z-[100]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/app/devices')} // Quay về trang danh sách devices
            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-slate-50"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Control Panel</p>
            {/* Viết hoa chữ cái đầu của deviceId để làm tiêu đề */}
            <h2 className="text-2xl font-black text-slate-800 capitalize">{deviceId} Details</h2>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 pr-5 rounded-2xl shadow-sm border border-slate-50">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1__nUveMs5K4VA2cdLheJMT6C-tqFQveppg&s" className="w-10 h-10 rounded-xl object-cover" alt="user" />
          <p className="text-sm font-black text-slate-800 leading-none">Duong</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scroll-smooth">
        <div className="max-w-[1400px] mx-auto h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;