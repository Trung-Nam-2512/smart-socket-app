import React, { useState } from 'react';
import lampIcon from '../../assets/lamp.png';

const DeviceCard = ({ title, room, icon, active, onClickCard }) => {
  const displayIcon = title === "Smart Lamp" ? lampIcon : icon;
  
  // State quản lý việc bật/tắt thiết bị (animation của switch)
  const [isOn, setIsOn] = useState(active);

  const handleSwitchClick = (e) => {
    e.stopPropagation(); // Ngăn việc Highlight card khi chỉ muốn bật/tắt
    setIsOn(!isOn);
  };

  return (
    <div 
      onClick={onClickCard}
      className={`flex-shrink-0 p-8 rounded-[2.5rem] w-[280px] h-[220px] relative overflow-hidden transition-all duration-500 shadow-2xl flex flex-col justify-between select-none cursor-pointer ${
        active 
        ? 'bg-gradient-to-br from-[#00A3FF] to-[#0066FF] text-white scale-[1.02]' 
        : 'bg-white/90 backdrop-blur-md text-[#1E293B] border border-white/20'
      }`}
    >
      {/* 1. VÒNG TRÒN NỀN (Chỉ hiện khi Card được Highlight) */}
      <div className={`absolute top-0 left-0 pointer-events-none translate-x-[-10px] translate-y-[-35px] z-0 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute w-[150px] h-[150px] rounded-full bg-white/10"></div>
        <div className="absolute w-[190px] h-[190px] rounded-full bg-white/5 translate-x-[-15px] translate-y-[-15px]"></div>
      </div>

      {/* 2. ICON (Animation Grayscale khi tắt) */}
      <div className="relative z-10 -mt-8 -ml-4">
        <div className={`w-24 h-24 flex items-center justify-center rounded-2xl transition-all duration-500 ${active ? '' : 'bg-slate-100/40'}`}>
           <img 
            src={displayIcon} 
            className={`w-30 h-30 object-contain drop-shadow-md translate-y-[-5px] transition-all duration-700 ${isOn ? 'grayscale-0 opacity-100 scale-100' : 'grayscale opacity-30 scale-90'}`} 
            alt={title}
          />
        </div>
      </div>
      
      {/* 3. INFO & SWITCH */}
      <div className="relative z-10 flex justify-between items-end">
        <div className="space-y-1">
          <h4 className="font-extrabold text-xl leading-none">{title}</h4>
          <p className={`${active ? 'text-blue-100/80' : 'text-slate-400'} text-[11px] font-bold uppercase mt-2`}>
            {room}
          </p>
        </div>
        
        {/* CỤM NÚT SWITCH VỚI ANIMATION TRƯỢT */}
        <div 
          onClick={handleSwitchClick}
          className={`w-11 h-6 rounded-full relative p-1 transition-all duration-300 cursor-pointer ${
            isOn 
              ? (active ? 'bg-white/40' : 'bg-[#00A3FF]') 
              : 'bg-slate-200'
          }`}
        >
          {/* Viên bi chạy qua lại */}
          <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOn ? 'translate-x-5' : 'translate-x-0'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;