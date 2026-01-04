import React, { useState } from 'react';
import { 
  Cloud, Droplets, Lightbulb, Music, 
  ChevronDown, ArrowLeft, Sun, Bed, Bath, Utensils, Armchair 
} from 'lucide-react';

// --- Mock Data ---
const devices = [
  { id: 1, name: 'Smart Lamp', room: 'Living Room', active: false, img: 'https://images.unsplash.com/photo-1507473888900-52e1adad8db9?auto=format&fit=crop&w=200&q=80' },
  { id: 2, name: 'Aroma Diffuser', room: 'Living Room', active: false, img: 'https://images.unsplash.com/photo-1603610998596-f033c44857b2?auto=format&fit=crop&w=200&q=80' },
  { id: 3, name: 'Air Conditioner', room: 'Living Room', active: false, img: 'https://images.unsplash.com/photo-1617105267098-90f7a5522773?auto=format&fit=crop&w=200&q=80' },
  { id: 4, name: 'Speaker', room: 'Bedroom', active: false, img: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=200&q=80' },
];

const StepFinalMap = ({ onBack }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC]">
      
      {/* VÙNG SCROLLABLE */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {/* --- HEADER SECTION (Giống Step 7 nhưng đổi Title) --- */}
        <div className="bg-[#1E293B] w-full px-8 pt-8 pb-12 rounded-b-[3rem] relative shadow-xl overflow-hidden mb-8">
           
           {/* Background Wave Decoration */}
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

           {/* TOP ROW: Back Button & Title */}
           <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="flex items-center gap-4">
                 {/* Back Button */}
                 <button onClick={onBack} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md">
                    <ArrowLeft size={20} className="text-white" />
                 </button>
                 <div>
                    <p className="text-slate-400 text-xs font-medium mb-0.5">My Home</p>
                    <h1 className="text-2xl font-bold text-white">Map view</h1>
                 </div>
              </div>
              
              {/* My Home Dropdown */}
              <div className="w-1/3 bg-slate-700/50 backdrop-blur-md border border-slate-600 rounded-xl p-2 pl-3 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                     <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=50&q=80" className="w-8 h-8 rounded-full object-cover border border-slate-500" alt="home" />
                     <span className="text-white font-medium text-sm">My Home</span>
                  </div>
                  <ChevronDown size={18} className="text-slate-300 mr-2" />
              </div>
           </div>

           {/* --- WIDGETS ROW --- */}
           <div className="flex flex-col md:flex-row gap-5 relative z-10">
              {/* Weather & Humidity */}
              <div className="flex-[2] bg-slate-700/40 backdrop-blur-md rounded-3xl p-6 flex items-center justify-around border border-slate-600/30 shadow-lg">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#1e293b]/60 rounded-2xl flex items-center justify-center border-t border-white/10 shadow-lg relative overflow-hidden">
                       <div className="relative w-9 h-9">
                          <Sun size={26} className="text-amber-400 absolute -top-1 -right-1 drop-shadow-lg" fill="#fbbf24" strokeWidth={0} />
                          <Cloud size={26} className="text-white absolute bottom-0 left-0 drop-shadow-md z-10" fill="#ffffff" strokeWidth={0} />
                       </div>
                    </div>
                    <div className="flex flex-col text-left">
                       <p className="text-slate-400 text-sm font-medium mb-0.5">Partly Cloudy</p>
                       <p className="text-white text-3xl font-bold tracking-tight">23°</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#1e293b]/60 rounded-2xl flex items-center justify-center border-t border-white/10 shadow-lg">
                       <Droplets size={32} className="text-blue-400 drop-shadow-lg" fill="#60a5fa" strokeWidth={0}/>
                    </div>
                    <div className="flex flex-col text-left">
                       <p className="text-slate-400 text-sm font-medium mb-0.5">Humidity</p>
                       <p className="text-white text-3xl font-bold tracking-tight">67%</p>
                    </div>
                 </div>
              </div>

              {/* Lights */}
              <div className="flex-1 bg-slate-700/40 backdrop-blur-md rounded-3xl p-6 flex items-center gap-4 border border-slate-600/30 shadow-lg">
                 <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg">
                    <Lightbulb size={28} fill="currentColor" strokeWidth={1.5} />
                 </div>
                 <div>
                    <p className="text-xs text-slate-300 font-medium mb-1">All lights on</p>
                    <p className="text-xl font-bold text-white leading-none">Home</p>
                 </div>
              </div>

              {/* Music */}
              <div className="flex-1 bg-slate-700/40 backdrop-blur-md rounded-3xl p-6 flex items-center gap-4 border border-slate-600/30 shadow-lg">
                 <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500 shadow-lg">
                    <Music size={28} fill="currentColor" strokeWidth={1.5} />
                 </div>
                 <div>
                    <p className="text-xs text-slate-300 font-medium mb-1">Play music</p>
                    <p className="text-xl font-bold text-white leading-none">Living room</p>
                 </div>
              </div>
           </div>
        </div>

        {/* --- MAIN CONTENT: MAP VIEW --- */}
        <div className="px-8">
           
           {/* Section Header with Toggle */}
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-bold text-slate-800">Your Rooms</h2>
                 <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">4</span>
              </div>
              
              {/* Toggle Switch (Map / List) */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                 <button className="px-6 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-bold shadow-sm transition-all">Map view</button>
                 <button className="px-6 py-2 text-slate-500 rounded-lg text-sm font-medium hover:text-slate-700 transition-all">List view</button>
              </div>
           </div>

           {/* --- FLOOR PLAN GRID (CSS GRID) --- */}
           {/* min-h-[400px]: Chiều cao tối thiểu cho bản đồ */}
           <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mb-10 h-[500px]">
              <div className="w-full h-full grid grid-cols-4 grid-rows-2 gap-4">
                 
                 {/* 1. Bedroom (Cột trái, full chiều cao) */}
                 <RoomBox 
                    name="Bedroom" devices={3} icon={Bed} 
                    className="row-span-2 col-span-1" 
                 />

                 {/* 2. Living Room (Giữa trên, rộng 2 cột) */}
                 <RoomBox 
                    name="Living room" devices={4} icon={Armchair} 
                    className="col-span-2" 
                 />

                 {/* 3. Bathroom (Phải trên, 1 cột) */}
                 <RoomBox 
                    name="Bathroom" devices={2} icon={Bath} 
                    className="col-span-1" 
                 />

                 {/* 4. Kitchen (Phải dưới, chiếm 2 cột lệch phải) */}
                 {/* col-start-3: Bắt đầu từ cột 3, kéo dài 2 cột */}
                 <RoomBox 
                    name="Kitchen" devices={1} icon={Utensils} 
                    className="col-span-2 col-start-3" 
                 />

              </div>
           </div>

           {/* --- DEVICES LIST (Bottom) --- */}
           <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-800">Devices</h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">12</span>
           </div>

           {/* Horizontal Scroll or Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {devices.map((device) => (
                 <DeviceCardMini key={device.id} device={device} />
              ))}
           </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

// 1. Room Box cho Map
const RoomBox = ({ name, devices, icon: Icon, className }) => (
  <div className={`border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group ${className}`}>
     <div className="flex flex-col items-center">
        <Icon size={24} className="text-slate-400 mb-2 group-hover:text-[#2563EB] transition-colors" />
        <h3 className="font-bold text-slate-700">{name}</h3>
     </div>
     <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        {devices} devices
     </div>
  </div>
);

// 2. Device Card Mini (Dưới cùng)
const DeviceCardMini = ({ device }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
     <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-xl">
        <img src={device.img} alt={device.name} className="h-12 object-contain mix-blend-multiply" />
     </div>
     <div>
        <h4 className="font-bold text-slate-700 text-sm">{device.name}</h4>
        <p className="text-slate-400 text-xs">{device.room}</p>
     </div>
  </div>
);

export default StepFinalMap;