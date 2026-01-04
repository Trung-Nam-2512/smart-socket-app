import React from 'react';
import { Play, SkipForward, SkipBack, Volume2, MoreHorizontal } from 'lucide-react';
import speakerImg from '../../assets/speaker.png';

const SpeakerDetail = () => {
  return (
    // Thêm overflow-y-visible để đảm bảo nội dung bên trong không bị cắt
    <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700 h-full overflow-y-visible">
      {/* CỘT TRÁI: THIẾT BỊ & THÔNG SỐ */}
      <div className="col-span-12 lg:col-span-5 space-y-8">
        <div className="relative flex items-center justify-center py-10 min-h-[400px]">
          <div className="absolute w-[300px] h-[300px] border border-slate-100 rounded-full opacity-60"></div>
          <div className="absolute w-[400px] h-[400px] border border-slate-50 rounded-full opacity-40"></div>
          <img src={speakerImg} className="w-64 relative z-10 drop-shadow-2xl" alt="Speaker" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-slate-50 pb-6">
            <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Status</span>
            <div className="flex items-center gap-3">
              <span className="text-blue-500 font-black">ON</span>
              <div className="w-12 h-6 bg-blue-500 rounded-full p-1 flex justify-end items-center shadow-inner cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Battery</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800">90%</span>
              <div className="w-5 h-2.5 border border-green-400 rounded-[2px] p-[1px] relative">
                <div className="w-[90%] h-full bg-green-400 rounded-[1px]"></div>
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-green-400 rounded-r-sm"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="font-bold text-slate-400 text-xs uppercase tracking-widest block">Volume</span>
            <div className="h-12 bg-slate-50 rounded-2xl relative overflow-hidden flex items-center px-1 shadow-inner border border-slate-100/50">
              <div className="w-[70%] h-10 bg-gradient-to-r from-[#5EB5FF] to-[#0085FF] rounded-xl shadow-lg flex items-center px-4 gap-3">
                <Volume2 size={16} className="text-white/80" />
                <div className="flex gap-1 items-end h-3">
                    {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-0.5 bg-white/30" style={{height: `${40 + Math.random()*60}%`}}></div>)}
                </div>
              </div>
              <span className="absolute right-4 text-[11px] font-black text-slate-300 uppercase">70%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: SPOTIFY & SCENES */}
      <div className="col-span-12 lg:col-span-7 space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Spotify</h3>
              <p className="text-slate-400 text-xs font-bold uppercase mt-1">Living room</p>
            </div>
            <MoreHorizontal className="text-slate-300 cursor-pointer" />
          </div>
          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800" className="w-full h-72 object-cover rounded-[2rem] mb-8 shadow-xl" alt="Album" />
          <div className="text-center space-y-1 mb-8">
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">As it was</h4>
            <p className="text-blue-500 font-bold italic">Harry Styles</p>
            <div className="mt-8 flex items-center gap-4 px-6">
               <span className="text-[10px] font-bold text-slate-300">1:02</span>
               <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative">
                  <div className="absolute h-full w-[45%] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
               </div>
               <span className="text-[10px] font-bold text-slate-300">2:45 min</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-12 pt-2">
            <SkipBack size={32} className="text-slate-200 cursor-pointer hover:text-blue-500" fill="currentColor" />
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-200 cursor-pointer hover:scale-105 active:scale-95 transition-all">
              <Play size={28} fill="currentColor" className="ml-1" />
            </div>
            <SkipForward size={32} className="text-slate-200 cursor-pointer hover:text-blue-500" fill="currentColor" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
           <div className="flex items-center gap-2 mb-6 font-black text-xl text-slate-800">
              <h3>Scenes</h3>
              <span className="w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center text-[10px] text-slate-400">3</span>
           </div>
           <div className="space-y-4">
              <SceneItem icon="☕" title="Morning coffee" time="Everyday | 08:15 AM - 09:00 AM" />
              <SceneItem icon="🎬" title="Movie Night" time="Mon, Fri | 08:00 PM - 10:00 PM" active={true} />
              <SceneItem icon="🎂" title="32th Birthday Kristin" time="July 30th | 07:00 PM - 10:00 PM" />
           </div>
        </div>
      </div>
    </div>
  );
};

const SceneItem = ({ icon, title, time, active = false }) => (
  <div className={`flex justify-between items-center p-5 rounded-[1.5rem] transition-all ${active ? 'bg-blue-50/50 border border-blue-100/50' : 'bg-slate-50/50 hover:bg-slate-50'}`}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl">{icon}</div>
      <div>
        <p className="font-bold text-slate-800 leading-none mb-1.5">{title}</p>
        <p className={`text-[10px] font-bold uppercase tracking-tight ${active ? 'text-blue-400' : 'text-slate-300'}`}>{time}</p>
      </div>
    </div>
    <div className={`w-10 h-5 rounded-full relative p-1 transition-all ${active ? 'bg-blue-500' : 'bg-slate-200'}`}>
      <div className={`w-3 h-3 bg-white rounded-full transition-all ${active ? 'ml-auto' : 'ml-0'}`}></div>
    </div>
  </div>
);

export default SpeakerDetail;