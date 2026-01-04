import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import SearchDropbar from './SearchDropbar'; // Giả sử bạn đã có file này cùng thư mục

// 1. Thêm prop onFinish vào đây
const Step5Connected = ({ homeData, addedDevices, onAddMore, onFinish }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropbar, setShowDropbar] = useState(false);
  
  // State quản lý việc bật/tắt từng thiết bị
  const [deviceStatus, setDeviceStatus] = useState({});

  const toggleDevice = (index) => {
    setDeviceStatus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredResults = addedDevices.filter(d => 
    (d.customName || d.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pb-40 animate-in fade-in zoom-in duration-500">
      <div className="p-8 lg:p-12">
        
        {/* Header: Thông tin nhà & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=150" 
                className="w-full h-full object-cover" 
                alt="home" 
              />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                {homeData.name} 
                <Plus size={20} className="text-blue-500 rotate-45 cursor-pointer" />
              </h1>
              <p className="text-slate-400 font-medium">{homeData.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto relative">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input 
                value={searchTerm}
                onFocus={() => setShowDropbar(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search device" 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none shadow-sm focus:ring-2 focus:ring-blue-100 transition-all" 
              />
              {showDropbar && searchTerm.length > 0 && (
                <div onMouseLeave={() => setShowDropbar(false)} className="absolute w-full z-50 top-full mt-2">
                  <SearchDropbar results={filteredResults} />
                </div>
              )}
            </div>
            <button onClick={onAddMore} className="p-3.5 bg-white rounded-2xl border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95">
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Grid danh sách thiết bị */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {addedDevices.map((device, idx) => {
            const isOn = deviceStatus[idx] || false;
            return (
              <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all relative group hover:-translate-y-1">
                <button className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
                
                <div className="mb-8 flex justify-center">
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-colors duration-500 ${isOn ? 'bg-blue-50' : 'bg-slate-50'}`}>
                    <img 
                      src={device.image} 
                      alt={device.name} 
                      className={`h-16 object-contain transition-all duration-500 ${isOn ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 text-lg leading-tight line-clamp-1">
                    {device.customName || device.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isOn ? 'text-emerald-500' : 'text-slate-300'}`}>
                      <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`}></span>
                      {isOn ? 'Active' : 'Offline'}
                    </span>

                    {/* Switch Toggle */}
                    <div 
                      onClick={() => toggleDevice(idx)}
                      className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card Thêm thiết bị rỗng */}
          <button 
            onClick={onAddMore}
            className="border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-8 text-slate-300 hover:border-blue-300 hover:text-blue-400 hover:bg-blue-50/30 transition-all min-h-[280px] group"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-sm transition-colors">
               <Plus size={32} />
            </div>
            <span className="font-bold">Add Device</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white/95 backdrop-blur-xl p-6 px-6 rounded-t-[1rem] shadow-[0_-20px_50px_rgba(0,0,0,0.06)] border-t border-slate-100 flex justify-between items-center pointer-events-auto mx-6 bottom-0 left-0 right-0 absolute">
        <p className="text-slate-400 text-sm font-medium italic hidden md:block">Everything is connected and running smoothly.</p>
        
        {/* 2. GẮN SỰ KIỆN onClick={onFinish} TẠI ĐÂY */}
        <button 
          onClick={onFinish}
          className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95 ml-auto md:ml-0"
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
};

export default Step5Connected;