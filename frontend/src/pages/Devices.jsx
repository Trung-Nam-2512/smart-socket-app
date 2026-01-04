// src/pages/Devices.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Speaker, Wind, Lightbulb, Tv, Router, Zap } from 'lucide-react';

const Devices = () => {
  const navigate = useNavigate();

  const allDevices = [
    { 
      id: 'speaker', // Khớp với case 'speaker'
      name: 'Smart Speaker', 
      area: 'Living Room', 
      status: 'ON', 
      battery: '90%', 
      icon: <Speaker size={32} />,
      color: 'bg-blue-500 text-white' 
    },
    { 
      id: 'ac', // Khớp với case 'ac'
      name: 'Air Conditioner', 
      area: 'Bedroom', 
      status: 'ON', 
      temp: '24°C', 
      icon: <Wind size={32} />,
      color: 'bg-orange-400 text-white'
    },
    // Các thiết bị chưa có chi tiết sẽ rơi vào default case
    { id: 'lamp', name: 'Smart Lamp', area: 'Kitchen', status: 'OFF', icon: <Lightbulb size={32} />, color: 'bg-slate-200 text-slate-400' },
    { id: 'tv', name: 'Smart TV', area: 'Living Room', status: 'OFF', icon: <Tv size={32} />, color: 'bg-slate-200 text-slate-400' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight">All Devices</h1>
           <p className="text-slate-400 font-medium mt-1">Manage and control your smart devices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allDevices.map((device) => (
          <div 
            key={device.id}
            // Navigate sẽ đưa user đến /app/devices/speaker hoặc /app/devices/ac
            onClick={() => navigate(`/app/devices/${device.id}`)}
            className="group bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
          >
             {/* ... (Giữ nguyên phần UI Card như cũ) ... */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${device.color}`}>
                {device.icon}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${device.status === 'OFF' ? 'bg-slate-100 text-slate-400' : 'bg-green-100 text-green-600'}`}>
                {device.status}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-slate-800">{device.name}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase mt-1">{device.area}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Devices;