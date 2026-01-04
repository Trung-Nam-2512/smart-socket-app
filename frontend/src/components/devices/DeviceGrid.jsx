import React from 'react';
import { Lamp, Fan, Tv, Speaker, Wind, ThermometerSnowflake, Router } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook
import DeviceCard from './DeviceCard';

const DeviceGrid = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook

  const devices = [
    { 
        id: 1, 
        name: "Smart Lamp", 
        room: "Living Room", 
        icon: Lamp, 
        defaultStatus: true, 
        value: 80, 
        unit: "%",
        path: null // Chưa có trang chi tiết
    },
    { 
        id: 2, 
        name: "Air Conditioner", 
        room: "Bedroom", 
        icon: ThermometerSnowflake, 
        defaultStatus: true, 
        value: 24, 
        unit: "°C",
        path: '/app/devices/ac' // 3. Link tới trang ACDetail
    },
    { 
        id: 3, 
        name: "Smart TV", 
        room: "Living Room", 
        icon: Tv, 
        defaultStatus: false,
        path: null 
    },
    { 
        id: 4, 
        name: "Audio System", 
        room: "Kitchen", 
        icon: Speaker, 
        defaultStatus: true, 
        value: 45, 
        unit: "%",
        path: '/app/devices/speaker' // 4. Link tới trang SpeakerDetail
    },
    { 
        id: 5, 
        name: "Humidifier", 
        room: "Bedroom", 
        icon: Wind, 
        defaultStatus: false,
        path: null
    },
    { 
        id: 6, 
        name: "Ceiling Fan", 
        room: "Kitchen", 
        icon: Fan, 
        defaultStatus: true, 
        value: 2, 
        unit: "lvl",
        path: null
    },
  ];

  return (
    <section className="py-2 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Connected Devices</h2>
          <p className="text-sm font-bold text-slate-400 mt-1">You have {devices.length} devices in your home</p>
        </div>
        <button className="text-blue-500 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
          Manage All
        </button>
      </div>

      {/* Grid Layout Container - overflow để cuộn nếu danh sách dài */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {devices.map((device) => (
              <DeviceCard 
                key={device.id} 
                {...device} 
                // 5. Truyền hàm onClick chỉ khi có đường dẫn
                onClick={() => device.path && navigate(device.path)}
              />
            ))}
            
            {/* Add New Device Button */}
            <button className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group min-h-[220px]">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shadow-sm">
                <span className="text-2xl font-light">+</span>
              </div>
              <span className="font-bold text-sm">Add New Device</span>
            </button>
          </div>
      </div>
    </section>
  );
};

export default DeviceGrid;