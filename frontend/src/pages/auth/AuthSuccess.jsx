// src/pages/auth/AuthSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const AuthSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
      
      {/* Avatar with Rings Effect */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-8">
        {/* Concentric Circles */}
        <div className="absolute w-[340px] h-[340px] border border-slate-100 rounded-full animate-pulse"></div>
        <div className="absolute w-[260px] h-[260px] border border-slate-100 rounded-full"></div>
        <div className="absolute w-[180px] h-[180px] border border-slate-100 rounded-full"></div>

        {/* Orbiting Icon (Optional decoration) */}
        <div className="absolute top-10 right-16 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-green-500 animate-bounce">
            <Check size={16} strokeWidth={4} />
        </div>

        {/* User Avatar */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1__nUveMs5K4VA2cdLheJMT6C-tqFQveppg&s" 
            alt="User" 
            className="w-full h-full object-cover bg-blue-50"
          />
        </div>
      </div>

      {/* Welcome Text */}
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900">Hello, Kristin!</h1>
        <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
          Welcome to your new smart home. <br/> Everything is ready for you to explore.
        </p>
      </div>

      {/* Button */}
      <div className="w-full max-w-xs">
        <button 
          onClick={() => navigate('/app/spaces')}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AuthSuccess;