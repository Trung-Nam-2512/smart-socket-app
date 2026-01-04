import React, { useState } from 'react';

const DeviceCard = ({ name, room, icon: Icon, defaultStatus = false, value = 0, unit = "", onClick }) => {
  const [isActive, setIsActive] = useState(defaultStatus);

  const handleToggle = (e) => {
    // Quan trọng: Ngăn chặn sự kiện click lan ra ngoài thẻ cha (div)
    // Nếu không có dòng này, khi ấn nút bật/tắt nó sẽ chuyển trang luôn
    e.stopPropagation(); 
    setIsActive(!isActive);
  };

  return (
    <div 
      onClick={onClick} // Sự kiện chuyển trang khi ấn vào card
      className={`p-5 rounded-[2rem] transition-all duration-300 border relative overflow-hidden group ${
        isActive 
          ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200 text-white' 
          : 'bg-white border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md text-slate-800'
      } ${onClick ? 'cursor-pointer' : ''}`} // Thêm con trỏ tay nếu có link
    >
      {/* Background Decor cho đẹp hơn */}
      {isActive && <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>}

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-3.5 rounded-2xl transition-colors ${isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-slate-50 text-slate-500'}`}>
          <Icon size={24} />
        </div>
        
        {/* Nút Toggle */}
        <button 
          onClick={handleToggle} 
          className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${isActive ? 'bg-white/30' : 'bg-slate-200'}`}
        >
          <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'}`} />
        </button>
      </div>

      <div className="relative z-10">
        <h3 className="font-black text-lg tracking-tight mb-1">{name}</h3>
        <p className={`text-sm font-medium ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{room}</p>
        
        {/* Hiển thị thông số nếu có (Vd: 24°C) */}
        {(value || value === 0) && (
             <p className={`mt-4 text-2xl font-black ${isActive ? 'text-white' : 'text-slate-800'}`}>
                {value}<span className="text-sm font-bold ml-0.5 opacity-60">{unit}</span>
             </p>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;