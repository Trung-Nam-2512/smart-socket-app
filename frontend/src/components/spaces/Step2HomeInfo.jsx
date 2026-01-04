import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

const Step2HomeInfo = ({ onNext, onBack }) => {
  const [homeName, setHomeName] = useState('My Home');
  const suggestions = ['Home', 'Office', 'My happy place'];

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      
      <div className="flex-1 overflow-y-auto min-h-0 pb-60 no-scrollbar">
        
        {/* --- HEADER --- */}
        {/* Thêm relative và overflow-hidden */}
        <div className="bg-[#1e293b] text-white pt-10 pb-40 px-12 rounded-bl-[2rem] rounded-br-[2rem] relative z-10 shadow-2xl mx-6 overflow-hidden">
          
          {/* --- BACKGROUND WAVE DECORATION (MỚI) --- */}
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

          <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
            <button onClick={onBack} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/5 shadow-inner">
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Create a new space</h1>
              <p className="text-slate-500 text-sm mt-1 font-medium italic">Add the first details</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 leading-none">Step</p>
              <p className="text-white text-xl font-black italic">1 <span className="text-slate-600 font-normal ml-1">| 7</span></p>
            </div>
          </div>
        </div>

        {/* --- NỘI DUNG --- */}
        <div className="flex flex-col items-center -mt-32 px-6 relative z-20">
          <div className="w-full max-w-2xl bg-white p-2 rounded-[2.8rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] mb-12 border border-white/50">
            <div className="aspect-[16/10] rounded-[2.4rem] overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" 
                className="w-full h-full object-cover shadow-inner" 
                alt="House" 
              />
              <div className="absolute top-6 right-6 p-2.5 bg-white shadow-xl rounded-xl text-blue-600 cursor-pointer hover:scale-105 transition-transform">
                <ImageIcon size={18} />
              </div>
            </div>
          </div>
          <div className="w-full max-w-xl text-center space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">What's your house name?</label>
              <input 
                type="text"
                value={homeName}
                onChange={(e) => setHomeName(e.target.value)}
                className="w-full p-5 bg-white border border-slate-100 rounded-2xl shadow-sm text-center font-bold text-slate-700 text-lg outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="space-y-5">
              <p className="text-sm font-bold text-slate-400">No inspiration? Try one of these names.</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {suggestions.map((name) => (
                  <button key={name} onClick={() => setHomeName(name)} className="px-8 py-3 bg-[#EEF2F6] hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-sm transition-all">
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center z-50 px-6 pointer-events-none">
        <div className="w-full bg-white/95 backdrop-blur-xl p-6 rounded-t-[1rem] shadow-[0_-20px_50px_rgba(0,0,0,0.06)] border-t border-slate-100 flex justify-between items-center pointer-events-auto">
          <p className="text-slate-400 font-bold text-sm tracking-wide hidden sm:block">
            Name your new space
          </p>
          <button 
            onClick={() => onNext({ name: homeName })}
            className="w-full sm:w-auto px-32 py-4 bg-[#2563EB] text-white rounded-2xl font-black text-base shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.97]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2HomeInfo;