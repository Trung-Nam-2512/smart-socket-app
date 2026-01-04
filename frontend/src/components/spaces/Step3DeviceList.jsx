import React from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import aromaImg from '../../assets/aroma_diffuser.png';
import acImg from '../../assets/ac_unit.png';
import humidifierImg from '../../assets/humidifier.png';
import speakerImg from '../../assets/speaker.png';
import lampImg from '../../assets/lamp.png';
import lamp2Img from '../../assets/lamp2.png';


// Cập nhật đường dẫn assets khớp với các file bạn đã cung cấp
const availableDevices = [
  { id: 1, name: 'Aroma Diffuser', status: 'not connected', image: aromaImg },
  { id: 2, name: 'Air Conditioner', status: 'not connected', image: acImg },
  { id: 3, name: 'Humidifier', status: 'not connected', image: humidifierImg },
  { id: 4, name: 'Speaker', status: 'not connected', image: speakerImg },
  { id: 5, name: 'Smart Lamp', status: 'not connected', image: lampImg },
  { id: 6, name: 'Smart Lamp', status: 'not connected', image: lamp2Img },
];

const Step3DeviceList = ({ homeData = { name: 'Home' }, onAdd, onNext, onBack }) => {
  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. NỘI DUNG CUỘN */}
      <div className="flex-1 overflow-y-auto pb-44 no-scrollbar"> 
        
        {/* HEADER SECTION */}
        <div className="bg-[#1e293b] text-white pt-10 pb-20 px-10 rounded-b-[3.5rem] relative mb-24 shadow-2xl mx-6">
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
             <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                 {[...Array(25)].map((_, i) => {
                   const y = 10 + (i * 3.5); 
                   return (
                       <path key={i} d={`M-10 ${y} C 30 ${y + 35} 70 ${y - 35} 110 ${y}`} stroke="white" fill="none" strokeWidth="0.3" opacity={0.1 + (i * 0.02)} />
                   );
                 })}
             </svg>
          </div>
          
          <div className="flex justify-between items-start mb-10 max-w-6xl mx-auto relative z-10">
            <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/5">
              <ArrowLeft size={20}/>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Create a new space</h1>
              <p className="text-slate-400 text-sm mt-1">Connect your devices</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Step</p>
              <p className="text-white text-lg font-black italic">4 <span className="text-slate-500 font-normal">| 7</span></p>
            </div>
          </div>

          {/* HOME CARD TRÊN HEADER */}
          <div className="bg-white rounded-[2.5rem] p-5 flex items-center gap-5 shadow-2xl shadow-slate-200 border border-slate-100 absolute -bottom-14 left-6 right-6 md:left-10 md:right-10 z-20 max-w-4xl md:mx-auto">
            <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-inner flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=150" className="w-full h-full object-cover" alt="home" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-slate-900 font-black text-xl truncate">{homeData?.name || "My Home"}</h3>
                <button className="text-blue-500 hover:scale-110 transition-transform">
                  <Plus size={18} className="rotate-45 font-bold"/>
                </button>
              </div>
              <p className="text-slate-400 text-sm font-medium truncate">{homeData?.address || "No address"}</p>
            </div>
          </div>
        </div>

        {/* LƯỚI THIẾT BỊ (DEVICE GRID) */}
        <div className="px-6 md:px-10 mt-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-slate-900 font-black text-2xl">Link smart devices</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Current devices nearby</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input placeholder="Search" className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableDevices.map((device) => (
              <div key={device.id} className="bg-white p-6 rounded-[2.8rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start relative group">
                
                {/* HIỆU ỨNG 2 VÒNG TRÒN PHÍA SAU HÌNH THIẾT BỊ */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-4 self-center md:self-start">
                  {/* Vòng tròn ngoài (rất nhạt) */}
                  <div className="absolute inset-0 bg-slate-50/50 rounded-full scale-100 transition-transform group-hover:scale-110 duration-500"></div>
                  {/* Vòng tròn trong (đậm hơn) */}
                  <div className="absolute inset-4 bg-slate-50/80 rounded-full scale-100 transition-transform group-hover:scale-105 duration-500"></div>
                  
                  {/* Hình ảnh thiết bị thực tế */}
                  <img 
                    src={device.image} 
                    alt={device.name} 
                    className="h-20 w-20 object-contain z-10 relative drop-shadow-md" 
                  />
                </div>

                {/* THÔNG TIN VÀ NÚT BẤM GIỐNG HỆT MẪU */}
                <div className="w-full flex justify-between items-end mt-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-[#334155] text-lg leading-tight">{device.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      {/* Icon tròn trạng thái bên trái text */}
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div>
                      </div>
                      <span className="text-sm text-slate-400 font-bold tracking-tight uppercase">{device.status}</span>
                    </div>
                  </div>

                  {/* NÚT THÊM TRÒN/BO GÓC XANH DƯƠNG */}
                  <button 
                    onClick={() => onAdd(device)}
                    className="w-14 h-14 flex items-center justify-center bg-white border-2 border-blue-100 text-blue-500 rounded-[1.2rem] hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm hover:shadow-blue-200"
                  >
                    <Plus size={24} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. FOOTER CỐ ĐỊNH */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center z-50 px-6 pointer-events-none">
        <div className="w-full bg-white/95 backdrop-blur-xl p-6 px-6 rounded-t-[1rem] shadow-[0_-20px_50px_rgba(0,0,0,0.06)] border-t border-slate-100 flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <p className="text-slate-400 font-bold text-sm tracking-wide hidden sm:block">
              Add all your devices and go to the next step.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={onNext} className="px-10 py-3.5 bg-slate-100 text-slate-500 font-bold rounded-2xl">Skip</button>
            <button onClick={onNext} className="w-full sm:w-auto px-20 py-4 bg-[#2563EB] text-white rounded-2xl font-black text-base shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.97]">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3DeviceList;