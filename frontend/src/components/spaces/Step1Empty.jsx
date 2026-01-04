import React from 'react';

const Step1Empty = ({ onNext }) => {
  return (
    <div className="min-h-full  bg-white flex flex-col items-center justify-start pt-[10vh] px-6">
      
      {/* 1. PHẦN CHỮ (Y chang hình 1) */}
      <div className="text-center mb-12">
        <h2 className="text-[28px] font-extrabold text-slate-900 leading-tight mb-4">
          Look like you have no spaces set up.
        </h2>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">
          Add your house and start your smart life!
        </p>
      </div>

      {/* 2. HÌNH ẢNH (Bự hơn chút) */}
      <div className="relative mb-16">
        {/* Vòng tròn nền mờ nhẹ */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-slate-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        
        <img 
          src="/src/assets/empty-house.png" // Đảm bảo đường dẫn ảnh đúng
          alt="Empty Space Illustration" 
          // Đã tăng kích thước ảnh lên w-[380px]
          className="w-[380px] h-auto object-contain drop-shadow-sm"
        />
      </div>

      {/* 3. NÚT BẤM (Dài hơn) */}
      {/* Tăng max-width của container chứa nút lên 480px */}
      <div className="w-full max-w-[480px]">
        <button 
          onClick={onNext}
          className="w-full py-4 bg-[#2563EB] text-white rounded-2xl font-bold text-[14px] shadow-xl shadow-blue-100/50 hover:bg-blue-700 transition-all active:scale-[0.98]"
        >
          Set up your space
        </button>
      </div>

    </div>
  );
};

export default Step1Empty;