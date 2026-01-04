// src/pages/auth/Intro.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

// Import ảnh từ thư mục assets (Thay đổi đường dẫn nếu bạn lưu ở chỗ khác)
import introHouseImg from '../../assets/intro-house.png'; 

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div 
      // Click bất cứ đâu để chuyển sang trang Login
      onClick={() => navigate('/login')}
      className="relative w-full min-h-screen bg-[#F4F6F9] overflow-hidden cursor-pointer font-sans select-none"
    >
      
      {/* --- PHẦN HÌNH ẢNH (House) --- 
          Định vị tuyệt đối bên phải
      */}
      <div className="absolute top-[10%] -right-[15%] md:top-[0%] md:right-[-17%] w-[130%] md:w-[70%] max-w-[900px] pointer-events-none flex">
        <img 
          src={introHouseImg} 
          alt="Smart Home House" 
          className="w-full h-auto object-contain drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)]"
        />
      </div>

      {/* --- PHẦN NỘI DUNG (Text) --- 
          Định vị góc dưới bên trái
      */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-24 z-10 flex flex-col justify-end h-full pointer-events-none">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Easy living with your <br />
            <span className="inline-flex items-center gap-3">
              smart home 
              <Lightbulb className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 fill-yellow-400" strokeWidth={2.5} />
            </span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md">
            Get you smart devices in one place and manage all of these with a few taps.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Intro;