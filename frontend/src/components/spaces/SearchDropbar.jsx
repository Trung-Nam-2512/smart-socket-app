import React from 'react';

const SearchDropbar = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="p-3 border-b border-slate-50 bg-slate-50/50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Devices</p>
      </div>
      {results.map((res, i) => (
        <div key={i} className="p-4 hover:bg-blue-50 flex items-center gap-4 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
            <img src={res.image} className="w-full h-full object-contain" alt="icon" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-700 text-sm">{res.customName || res.name}</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">Active Connection</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchDropbar;