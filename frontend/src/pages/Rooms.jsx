import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Thermometer, Droplets } from 'lucide-react';
import DeviceCard from '../components/rooms/DeviceCard';

const Rooms = () => {
  const navigate = useNavigate();
  const [highlightedId, setHighlightedId] = useState('lamp');

  const devices = [
    { id: 'lamp', title: 'Smart Lamp', room: 'LIVING ROOM', icon: '' },
    { id: 'speaker', title: 'Speaker', room: 'LIVING ROOM', icon: 'https://cdn-icons-png.flaticon.com/512/3159/3159061.png' },
    { id: 'aroma', title: 'Aroma Diffuser', room: 'LIVING ROOM', icon: 'https://cdn-icons-png.flaticon.com/512/3253/3253066.png' },
    { id: 'humidifier', title: 'Humidifier', room: 'LIVING ROOM', icon: 'https://cdn-icons-png.flaticon.com/512/2933/2933856.png' }
  ];

  const handleCardClick = (id) => {
    setHighlightedId(id);
    // Chuyển sang trang chi tiết sau khi hiệu ứng highlight chạy xong
    setTimeout(() => {
      navigate(`/app/devices/${id}`);
    }, 300);
  };

  return (
    <div className="flex-1 h-full relative flex flex-col overflow-hidden bg-[#F8FAFC]">
      
      {/* 1. NỀN ẢNH PHÒNG KHÁCH */}
      <div className="absolute inset-0 z-0 h-[75%]">
        <img 
          src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1600" 
          className="w-full h-full object-cover" 
          alt="Living Room"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/30 to-transparent"></div>
      </div>

      {/* 2. HEADER */}
      <div className="relative z-10 p-12 flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-black/10 backdrop-blur-md rounded-xl text-white border border-white/10 hover:bg-black/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-4xl font-black drop-shadow-md">Living Room</h1>
      </div>

      {/* 3. DANH SÁCH THIẾT BỊ (DEVICE CARDS) */}
      <div className="mt-auto relative z-20 px-12 pb-8 flex gap-6 overflow-x-auto scrollbar-hide select-none">
        {devices.map((device) => (
          <DeviceCard 
            key={device.id}
            title={device.title}
            room={device.room}
            icon={device.icon}
            active={highlightedId === device.id}
            onClickCard={() => handleCardClick(device.id)} 
          />
        ))}
      </div>

      {/* 4. THANH THÔNG SỐ MÔI TRƯỜNG (PHẦN BẠN ĐANG THIẾU) */}
      <div className="relative z-30 bg-white/95 backdrop-blur-xl h-24 border-t border-slate-100 flex items-center shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-2 w-full divide-x divide-slate-100">
          
          {/* Nhiệt độ */}
          <div className="flex items-center px-16 gap-5">
            <div className="p-3 bg-orange-50 rounded-2xl text-orange-400">
              <Thermometer size={24} />
            </div>
            <p className="text-slate-400 font-bold text-sm max-w-[160px] leading-tight">
              Current temperature in the Living Room
            </p>
            <span className="text-3xl font-black text-slate-800 ml-auto tracking-tighter">25°</span>
          </div>
          
          {/* Độ ẩm */}
          <div className="flex items-center px-16 gap-5">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-400">
              <Droplets size={24} />
            </div>
            <p className="text-slate-400 font-bold text-sm max-w-[160px] leading-tight">
              Current humidity in the Living Room
            </p>
            <span className="text-3xl font-black text-slate-800 ml-auto tracking-tighter">67%</span>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Rooms;