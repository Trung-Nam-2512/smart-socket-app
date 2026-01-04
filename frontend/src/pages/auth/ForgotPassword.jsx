// src/pages/auth/ForgotPassword.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lightbulb, Mail, ChevronLeft } from 'lucide-react';
import loginHouseImg from '../../assets/login-house.png';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic gửi API request quên mật khẩu ở đây...
    
    // Chuyển sang trang VerifyCode và mang theo state
    navigate('/verify-code', { state: { from: 'reset-password' } });
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* CỘT TRÁI */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F6F9] relative flex-col items-center justify-end p-12 overflow-hidden">
        <div className="absolute top-[0%] w-[80%] max-w-[600px]">
             <img src={loginHouseImg} alt="Smart Home" className="w-full h-auto drop-shadow-xl object-contain" />
        </div>
        <div className="relative z-10 w-full max-w-md mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Easy living with your <br/><span className="inline-flex items-center gap-2">smart home <Lightbulb className="w-8 h-8 text-yellow-400 fill-yellow-400" strokeWidth={2.5} /></span></h1>
          <p className="text-slate-500 text-lg mb-8">Control your entire house in one place and manage all your devices from your phone.</p>
          <div className="flex gap-2 justify-center lg:justify-start">
             <div className="w-2 h-2 rounded-full bg-slate-300"></div><div className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100"></div><div className="w-2 h-2 rounded-full bg-slate-300"></div><div className="w-2 h-2 rounded-full bg-slate-300"></div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Reset password</h2>
            <p className="text-slate-400 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2 ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500" size={20} />
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all">Send Reset Link</button>
            
            <div className="text-center">
                 <Link to="/login" className="inline-flex items-center gap-1 text-slate-500 text-sm font-bold hover:text-slate-800 transition-colors"><ChevronLeft size={16} /> Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;