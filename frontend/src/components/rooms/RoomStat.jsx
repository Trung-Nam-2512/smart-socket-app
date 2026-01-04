import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';

const RoomStat = ({ label, value, type }) => {
  const isTemp = type === 'temp';

  return (
    <div className="flex items-center gap-4 w-full px-12">
      {/* Icon nằm trong box bo góc nhẹ */}
      <div className={`p-3 rounded-2xl ${isTemp ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
        {isTemp ? <Thermometer size={24} /> : <Droplets size={24} />}
      </div>
      
      {/* Nhãn văn bản - Giới hạn độ rộng để xuống dòng như hình */}
      <p className="text-slate-400 font-bold text-sm leading-tight max-w-[150px]">
        {label}
      </p>
      
      {/* Con số hiển thị */}
      <span className="text-3xl font-black text-slate-800 ml-auto">
        {value}{isTemp ? '°' : '%'}
      </span>
    </div>
  );
};

export default RoomStat;