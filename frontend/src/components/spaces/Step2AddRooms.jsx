// src/components/spaces/Step2AddRooms.jsx
import React from 'react';
import { ArrowLeft, Plus, MoreHorizontal, Edit2 } from 'lucide-react';
import livingRoomImg from '../../assets/livingroom.png'; 
import kitchenImg from '../../assets/kitchen.png';
import bedRoomImg from '../../assets/bedroom.png'; 
import bathRoomImg from '../../assets/bathroom.png';

const Step2AddRooms = ({ homeData, onBack, onNext }) => {
  const rooms = [
    { id: 1, name: 'Living Room', area: '20 m²', image: livingRoomImg, circleColor: 'bg-[#D1EEE9]' },
    { id: 2, name: 'Kitchen', area: '12 m²', image: kitchenImg, circleColor: 'bg-[#FFEDD5]' },
    { id: 3, name: 'Bedroom', area: '16 m²', image: bedRoomImg, circleColor: 'bg-[#DBEAFE]' },
    { id: 4, name: 'Bathroom', area: '6 m²', image: bathRoomImg, circleColor: 'bg-[#FFE4E6]' },
  ];

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col relative overflow-hidden font-sans">
      
      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* HEADER */}
        <div className="bg-[#1e293b] text-white pt-8 pb-24 px-8 rounded-b-[2.5rem] relative shadow-xl mx-6">
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
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button onClick={onBack} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/5">
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-wide">Create a new space</h1>
              <p className="text-slate-400 text-sm mt-1">Organise your space</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Step</p>
              <p className="text-white text-lg font-black italic">3 <span className="text-slate-500 font-normal ml-1">| 7</span></p>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
          
          {/* HOME INFO CARD */}
          <div className="bg-white rounded-[2rem] p-4 pr-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col md:flex-row items-center gap-6 mb-10">
            <div className="w-full md:w-48 h-32 rounded-[1.5rem] overflow-hidden shadow-inner flex-shrink-0">
               <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover" alt="House" />
            </div>
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="text-xl font-black text-slate-800">{homeData?.name || "My Home"}</h2>
                <Edit2 size={16} className="text-blue-500 cursor-pointer" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-4">{homeData?.address || "11-5 Raddington Rd, London, UK"}</p>
            </div>
          </div>

          <div className="flex justify-between items-end mb-6">
            <h3 className="text-lg font-black text-slate-800">Add rooms</h3>
            <button className="flex items-center gap-2 px-5 py-2.5 border border-blue-500 text-blue-500 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              <Plus size={16} /> Add new rooms
            </button>
          </div>

          {/* ROOMS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all relative group cursor-pointer overflow-hidden">
                
                {/* --- PHẦN ẢNH TRÀN VIỀN 100% --- */}
                <div className={`relative h-48 w-full ${room.color} overflow-hidden`}>
                   
                   {/* Các vòng tròn trang trí phía sau */}
                   <div className={`absolute -top-10 -left-10 w-64 h-64 ${room.circleColor} opacity-20 rounded-full`}></div>
                   <div className={`absolute -top-5 -left-5 w-48 h-48 ${room.circleColor} opacity-40 rounded-full`}></div>
                   
                   {/* Hình ảnh vật thể sát mép trái */}
                   <div className="absolute inset-0 flex items-center">
                     <img 
                       src={room.image} 
                       alt={room.name} 
                       className="h-[100%] w-auto object-contain -translate-x-[50%] transition-transform duration-700 group-hover:-translate-x-[40%] group-hover:scale-105"
                       style={{ filter: 'drop-shadow(15px 10px 25px rgba(0,0,0,0.12))' }}
                     />
                   </div>
                </div>

                {/* --- PHẦN THÔNG TIN (CÓ PADDING ĐỂ KHÔNG CHẠM MÉP) --- */}
                <div className="p-6 flex justify-between items-center">
                   <div>
                      <h4 className="font-extrabold text-slate-700 text-xl tracking-tight">{room.name}</h4>
                      <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-wider">{room.area}</p>
                   </div>
                   <button className="bg-slate-50 p-2.5 rounded-2xl text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                      <MoreHorizontal size={24} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mx-6 absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 z-50 rounded-t-[1rem] shadow-[0_-20px_50px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto flex justify-end gap-4">
             <button className="px-10 py-3.5 bg-slate-100 text-slate-500 font-bold rounded-2xl">Skip</button>
             <button onClick={onNext} className="px-12 py-3.5 bg-[#2563EB] text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Step2AddRooms;