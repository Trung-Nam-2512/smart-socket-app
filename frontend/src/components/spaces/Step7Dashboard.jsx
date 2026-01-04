import React, { useState } from 'react';
import { 
  Cloud, Droplets, Lightbulb, Music, 
  ChevronDown, Plus, Sun 
} from 'lucide-react';

// --- Mock Data ---
const devices = [
  { id: 1, name: 'Smart Lamp', room: 'Living Room', active: true, img: 'https://images.unsplash.com/photo-1507473888900-52e1adad8db9?auto=format&fit=crop&w=200&q=80' },
  { id: 2, name: 'Aroma Diffuser', room: 'Living Room', active: true, img: 'https://images.unsplash.com/photo-1603610998596-f033c44857b2?auto=format&fit=crop&w=200&q=80' },
  { id: 3, name: 'Speaker', room: 'Living Room', active: true, img: 'https://images.unsplash.com/photo-1545459720-aacaf5090834?auto=format&fit=crop&w=200&q=80' },
  { id: 4, name: 'Speaker', room: 'Bedroom', active: false, img: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=200&q=80' },
  { id: 5, name: 'Air Conditioner', room: 'Living Room', active: false, img: 'https://images.unsplash.com/photo-1617105267098-90f7a5522773?auto=format&fit=crop&w=200&q=80' },
  { id: 6, name: 'Smart Lamp', room: 'Living Room', active: true, img: 'https://images.unsplash.com/photo-1513506003013-d3060c22e43b?auto=format&fit=crop&w=200&q=80' },
];

const members = [
  { id: 1, img: 'https://i.pravatar.cc/150?u=a' },
  { id: 2, img: 'https://i.pravatar.cc/150?u=b' },
  { id: 3, img: 'https://i.pravatar.cc/150?u=c' },
  { id: 4, img: 'https://i.pravatar.cc/150?u=d' },
];

// QUAN TRỌNG: Nhận prop onMapClick
const Step7Dashboard = ({ onMapClick }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC]">
      
      {/* VÙNG SCROLLABLE */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-[#1E293B] px-8 pt-8 pb-12 rounded-b-[3rem] relative shadow-xl overflow-hidden mx-6">
           
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

           {/* TOP ROW */}
           <div className="flex justify-between items-start mb-10 relative z-10">
              <h1 className="text-2xl font-bold text-white mt-2">Spaces</h1>
              <div className="w-1/3 bg-slate-700/50 backdrop-blur-md border border-slate-600 rounded-xl p-2 pl-3 flex items-center justify-between cursor-pointer hover:bg-slate-700/70 transition-colors">
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
                          <Sun size={26} className="text-amber-400 absolute -top-1 -right-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" fill="#fbbf24" strokeWidth={0} />
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
                       <Droplets size={32} className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" fill="#60a5fa" strokeWidth={0}/>
                    </div>
                    <div className="flex flex-col text-left">
                       <p className="text-slate-400 text-sm font-medium mb-0.5">Humidity</p>
                       <p className="text-white text-3xl font-bold tracking-tight">67%</p>
                    </div>
                 </div>
              </div>
              {/* Lights */}
              <div className="flex-1 bg-slate-700/40 backdrop-blur-md rounded-3xl p-6 flex items-center gap-4 border border-slate-600/30 shadow-lg">
                 <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                    <Lightbulb size={28} fill="currentColor" strokeWidth={1.5} />
                 </div>
                 <div>
                    <p className="text-xs text-slate-300 font-medium mb-1">All lights on</p>
                    <p className="text-xl font-bold text-white leading-none">Home</p>
                 </div>
              </div>
              {/* Music */}
              <div className="flex-1 bg-slate-700/40 backdrop-blur-md rounded-3xl p-6 flex items-center gap-4 border border-slate-600/30 shadow-lg">
                 <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <Music size={28} fill="currentColor" strokeWidth={1.5} />
                 </div>
                 <div>
                    <p className="text-xs text-slate-300 font-medium mb-1">Play music</p>
                    <p className="text-xl font-bold text-white leading-none">Living room</p>
                 </div>
              </div>
           </div>
        </div>

        {/* --- MAIN CONTENT BODY --- */}
        <div className="p-8">
           <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-800">Your Devices</h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">{devices.length}</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
             {devices.map((device, index) => (
                <DeviceCard key={index} device={device} />
             ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <h3 className="font-semibold text-slate-700 mb-4">Members</h3>
                <div className="flex items-center gap-2">
                   {members.map((m) => (
                     <img key={m.id} src={m.img} alt="member" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                   ))}
                   <button className="w-10 h-10 rounded-full border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
                      <Plus size={20} />
                   </button>
                </div>
             </div>

             {/* THẺ SPACE MAP - CẬP NHẬT SỰ KIỆN CLICK Ở ĐÂY */}
             <div 
                onClick={onMapClick} // Gắn hàm chuyển trang vào đây
                className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
             >
                <div>
                   <h3 className="font-semibold text-slate-700 mb-1">Your space map</h3>
                   <p className="text-slate-400 text-sm max-w-xs">See your rooms and all the devices that are related to them.</p>
                </div>
                <div className="w-40 h-24 border border-amber-200 rounded-lg relative bg-amber-50/30">
                   <div className="absolute top-0 left-0 w-2/3 h-full border-r border-amber-200"></div>
                   <div className="absolute bottom-0 left-0 w-full h-1/2 border-t border-amber-200"></div>
                   <div className="absolute top-0 right-0 w-1/3 h-1/2 border-b border-l border-amber-200 bg-amber-100/50"></div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Component: Device Card ---
const DeviceCard = ({ device }) => {
  const [isOn, setIsOn] = useState(device.active);
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative group hover:shadow-lg transition-all duration-300">
       <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-40 bg-slate-50 rounded-full -z-0 scale-75 group-hover:scale-90 transition-transform duration-500"></div>
       <div className="h-36 w-full flex items-center justify-center mb-6 relative z-10">
          <img src={device.img} alt={device.name} className="h-full object-contain drop-shadow-md" />
       </div>
       <div className="flex items-end justify-between relative z-10">
          <div>
            <h3 className="font-bold text-slate-700 text-lg">{device.name}</h3>
            <p className="text-slate-400 text-sm">{device.room}</p>
          </div>
          <button 
            onClick={() => setIsOn(!isOn)}
            className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${isOn ? 'bg-blue-500' : 'bg-slate-200'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </button>
       </div>
    </div>
  );
};

export default Step7Dashboard;