import React from 'react';
import { 
  ArrowLeft, PenLine, MoreHorizontal, Trash2, 
  Home, Lightbulb, Speaker, Wind 
} from 'lucide-react';

// --- Mock Data ---
const rooms = [
  { id: 1, name: 'Living Room', area: '20 m²', icon: Home, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80' },
  { id: 2, name: 'Kitchen', area: '12 m²', icon: Home, img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=100&q=80' },
  { id: 3, name: 'Bedroom', area: '16 m²', icon: Home, img: 'https://images.unsplash.com/photo-1616594039964-408359566a05?auto=format&fit=crop&w=100&q=80' },
  { id: 4, name: 'Bedroom', area: '6 m²', icon: Home, img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=100&q=80' },
];

const devices = [
  { id: 1, name: 'Smart Lamp', loc: 'Living Room', icon: Lightbulb },
  { id: 2, name: 'Speaker', loc: 'Living Room', icon: Speaker },
  { id: 3, name: 'Humidifier', loc: 'Living Room', icon: Wind },
];

const members = [
  { id: 1, name: 'Albert Flores', email: 'albert.flores@gmail.com', avatar: 'https://i.pravatar.cc/150?u=a' },
  { id: 2, name: 'Annette Black', email: 'annette.black@gmail.com', avatar: 'https://i.pravatar.cc/150?u=b' },
];

const Step6Confirm = ({ onBack, onFinish }) => {
  return (
    <div className="flex flex-col w-full h-full bg-[#F8FAFC]">
      
      {/* --- PHẦN 1: VÙNG CUỘN --- */}
      <div className="flex-1 overflow-y-auto relative no-scrollbar">
        
        {/* Header xanh đen */}
        <div className="bg-[#1e293b] text-white pt-10 pb-40 px-8 rounded-b-[3rem] relative shadow-lg mx-6 overflow-hidden">
          
          {/* --- BACKGROUND LINES (Vòng tròn đồng tâm giống ảnh Step 7) --- */}
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

          {/* Nội dung Header */}
          <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
            <button onClick={onBack} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-1">Create a new space</h1>
              <p className="text-slate-400 text-sm">Confirm your choices</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Step</span>
              <span className="font-semibold text-lg">7 <span className="text-slate-500">| 7</span></span>
            </div>
          </div>
        </div>

        {/* Nội dung chính (Card Home, Rooms, Devices...) */}
        <div className="px-6 md:px-8 -mt-32 pb-10 w-full max-w-7xl mx-auto z-10 relative">
          
          {/* Card My Home */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 mx-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1600596542815-e328d4de4bf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Home" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-800">My Home</h2>
                  <PenLine size={16} className="text-blue-500 cursor-pointer" />
                </div>
                <p className="text-slate-500 text-sm">11-5 Raddington Rd, London, UK</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Badge label="4 Rooms" color="text-emerald-600 border-emerald-100 bg-white" dotColor="bg-emerald-400" />
                <Badge label="3 Devices" color="text-purple-600 border-purple-100 bg-white" dotColor="bg-purple-400" />
                <Badge label="2 Members" color="text-amber-600 border-amber-100 bg-white" dotColor="bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SectionContainer title="Your Rooms" count={4}>
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={room.img} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm">{room.name}</h4>
                      <p className="text-slate-400 text-xs">{room.area}</p>
                    </div>
                  </div>
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"><MoreHorizontal size={20} /></button>
                </div>
              ))}
            </SectionContainer>

            <SectionContainer title="Your Devices" count={3}>
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-500">
                       <device.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 text-sm">{device.name}</h4>
                      <p className="text-slate-400 text-xs">{device.loc}</p>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                </div>
              ))}
            </SectionContainer>
          </div>

          {/* Members Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-6">
                <h3 className="font-semibold text-slate-700">Your Members</h3>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">{members.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-slate-700 text-sm">{member.name}</h4>
                        <p className="text-slate-400 text-xs">{member.email}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: FOOTER --- */}
        <div className="bg-[#F8FAFC] px-6 shrink-0 z-20">
          <div className="max-w-7xl mx-auto bg-white rounded-t-[1rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Text bên trái: Màu xám, in nghiêng */}
            <p className="text-slate-400 italic text-[15px]">
              Everything is connected and running smoothly.
            </p>
            
            {/* Nút bên phải: Bo tròn mạnh, màu xanh đậm hơn một chút */}
            <button 
              onClick={onFinish} 
              className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95 ml-auto md:ml-0"
            >
              Finish Setup
            </button>

          </div>
        </div>

    </div>
  );
};

// --- Sub Components ---
const Badge = ({ label, color, dotColor }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm ${color}`}>
    <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
    <span className="text-sm font-medium text-slate-600">{label}</span>
  </div>
);

const SectionContainer = ({ title, count, children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col">
    <div className="flex items-center gap-2 mb-4">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">{count}</span>
    </div>
    <div className="flex flex-col flex-1">
      {children}
    </div>
  </div>
);

export default Step6Confirm;