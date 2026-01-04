import React from 'react';
import { Snowflake, Wind, Moon, RefreshCcw } from 'lucide-react';
import acImg from '../../assets/ac_unit.png';

const ACDetail = () => {
  return (
    <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-right duration-700 h-full overflow-y-visible">
      {/* CỘT TRÁI: THIẾT BỊ & THÔNG SỐ */}
      <div className="col-span-12 lg:col-span-5 space-y-8">
        <div className="relative flex items-center justify-center py-10 min-h-[400px]">
          <div className="absolute w-[350px] h-[350px] border border-slate-100 rounded-full opacity-60"></div>
          <img src={acImg} className="w-72 relative z-10 drop-shadow-2xl" alt="AC" />
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
            <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Filter Battery</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800">90%</span>
              <div className="w-5 h-2.5 border border-green-400 rounded-[2px] p-[1px] relative">
                <div className="w-[90%] h-full bg-green-400 rounded-[1px]"></div>
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-green-400 rounded-r-sm"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="font-bold text-slate-400 text-xs uppercase tracking-widest block">Intensity</span>
            <div className="h-12 bg-slate-50 rounded-2xl relative overflow-hidden flex items-center px-1 shadow-inner border border-slate-100/50">
              <div className="w-[70%] h-10 bg-gradient-to-r from-[#FFD66B] to-[#FF8A00] rounded-xl shadow-lg flex items-center px-4 gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-white/50 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="absolute right-4 text-[11px] font-black text-slate-300 uppercase">70%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: TEMPERATURE DIAL & MODES */}
      <div className="col-span-12 lg:col-span-7 space-y-8">
        <div className="bg-white p-12 rounded-[3rem] shadow-sm flex flex-col items-center justify-center relative min-h-[500px]">
          <h3 className="absolute top-10 left-10 font-black text-xl text-slate-800 tracking-tight">Set Temperature</h3>
          
          <div className="w-72 h-72 rounded-full border-[18px] border-slate-50 flex items-center justify-center relative shadow-[inset_0_2px_15px_rgba(0,0,0,0.02)]">
             <div className="text-center">
                <span className="text-7xl font-black text-slate-800 tracking-tighter">24</span>
                <span className="text-3xl font-black text-slate-800 ml-1">°C</span>
             </div>
             <div className="absolute top-5 right-10 w-7 h-7 bg-blue-500 rounded-full border-[5px] border-white shadow-xl shadow-blue-200 z-20 cursor-pointer"></div>
             <div className="absolute inset-[-35px] rounded-full border-2 border-dashed border-slate-100 opacity-40"></div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-16 w-full px-6">
             <ModeButton icon={<Snowflake />} label="Cold" active={true} />
             <ModeButton icon={<Wind />} label="Wind" />
             <ModeButton icon={<Moon />} label="Sleep" />
             <ModeButton icon={<RefreshCcw />} label="Swing" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
           <div className="flex items-center gap-2 mb-6 font-black text-xl text-slate-800">
              <h3>Scenes</h3>
              <span className="w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center text-[10px] text-slate-400">2</span>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-5 rounded-[1.5rem] bg-blue-50/50 border border-blue-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl">🎬</div>
                  <div>
                    <p className="font-bold text-slate-800 leading-none mb-1.5">Movie Night</p>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">Mon, Fri | 08:00 PM - 10:00 PM</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-blue-500 rounded-full relative p-1 flex justify-end">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ModeButton = ({ icon, label, active = false }) => (
  <div className="flex flex-col items-center gap-3 group cursor-pointer">
    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${active ? 'bg-blue-500 text-white shadow-xl shadow-blue-100 scale-105' : 'bg-white border border-slate-100 text-slate-300 hover:bg-slate-50'}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className={`text-[11px] font-black uppercase tracking-tighter ${active ? 'text-slate-800' : 'text-slate-400 font-bold'}`}>{label}</span>
  </div>
);

export default ACDetail;