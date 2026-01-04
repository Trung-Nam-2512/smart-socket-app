import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const Step4AddDevice = ({ device, onContinue, onBack }) => {
  const [deviceName, setDeviceName] = useState(device?.name || '');

  const handleFinish = () => {
    if (!deviceName.trim()) {
      alert("Please enter a name for your device");
      return;
    }
    onContinue({ customName: deviceName });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* --- HEADER (ĐÃ THÊM MỚI) --- */}
      {/* relative, overflow-hidden */}
      <div className="bg-[#1e293b] p-12 text-white rounded-b-[3.5rem] shadow-2xl relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center mx-6">
        
        {/* --- BACKGROUND WAVE DECORATION --- */}
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

        {/* Nút Back - Để tuyệt đối để không làm lệch chữ ở giữa */}
        <button 
          onClick={onBack} 
          className="absolute top-8 left-8 p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all z-20"
        >
          <ArrowLeft size={20}/>
        </button>

        {/* Nội dung chữ đã được căn giữa */}
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-black tracking-tight">Set up your device</h1>
          <p className="text-slate-400 mt-2">Personalize your {device?.name}</p>
        </div>
      </div>
      
      {/* Form nhập liệu */}
      <div className="max-w-md mx-auto -mt-12 p-10 bg-white rounded-[3rem] shadow-2xl w-full border border-slate-50 relative z-20">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center p-6">
            <img src={device?.image} className="w-full h-full object-contain" alt="device" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">
              Device Name
            </label>
            <input 
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. Living Room Lamp"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700"
              autoFocus
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Continue
            </button>
            <button 
              onClick={onBack}
              className="w-full py-4 mt-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4AddDevice;