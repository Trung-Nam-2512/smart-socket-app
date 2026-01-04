// src/components/auth/AuthLayout.jsx
import React from 'react';
import { Lightbulb } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* CỘT TRÁI: Hình ảnh minh họa (Giống mẫu) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#F8F9FD] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Khối nội dung trung tâm */}
        <div className="z-10 text-center max-w-sm">
            {/* Hình ngôi nhà 3D */}
          <div className="mb-10 relative">
             <img 
              src="https://img.freepik.com/free-vector/isometric-smart-home-technology-concept_52683-30046.jpg" 
              alt="Smart Home Isometric" 
              className="w-full h-auto drop-shadow-xl mix-blend-multiply" 
            />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
            Easy living with your <br/> 
            <span className="inline-flex items-center gap-2">
                smart home <Lightbulb className="text-yellow-400 fill-yellow-400" size={28} />
            </span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            Control your entire house in one place and manage all your devices from your phone.
          </p>
        </div>
        
        {/* Decoration background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-0"></div>
      </div>

      {/* CỘT PHẢI: Form Container */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
            {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;