// src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Eye, EyeOff } from 'lucide-react';
import suscessHouseImg from '../../assets/suscess-house.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic gọi API đổi mật khẩu...
    
    // Đổi xong thì vào Dashboard hoặc trang Login lại
    navigate('/auth-success'); 
  };

  // Logic kiểm tra độ mạnh mật khẩu (Giả lập giống ảnh thiết kế)
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password) || /[!@#$%^&*]/.test(password);
  const hasCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  // Tính điểm độ mạnh để hiển thị thanh màu
  const strengthScore = [hasLength, hasNumber, hasCase].filter(Boolean).length;
  // Màu sắc: 3 điểm -> Xanh, 1-2 điểm -> Vàng, 0 điểm -> Xám
  const strengthColor = strengthScore === 3 ? 'bg-green-500' : strengthScore >= 1 ? 'bg-yellow-400' : 'bg-slate-200';
  const strengthWidth = strengthScore === 0 ? 'w-0' : strengthScore === 1 ? 'w-1/3' : strengthScore === 2 ? 'w-2/3' : 'w-full';

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* CỘT TRÁI */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F6F9] relative flex-col items-center justify-end p-12 overflow-hidden">
        <div className="absolute top-[0%] w-[80%] max-w-[600px]">
             <img src={suscessHouseImg} alt="Smart Home" className="w-full h-auto drop-shadow-xl object-contain" />
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
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Reset password</h2>
            <p className="text-slate-400 text-sm">Please create a new secure password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password Input */}
            <div className="relative">
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="New password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 text-sm font-medium pr-10" 
                required 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Thanh hiển thị độ mạnh mật khẩu */}
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${strengthWidth} ${strengthColor} transition-all duration-500 ease-out`}></div>
            </div>

            {/* Danh sách yêu cầu mật khẩu */}
            <div className="space-y-1">
                <div className={`flex items-center gap-2 text-xs ${hasLength ? 'text-green-500' : 'text-slate-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${hasLength ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    Least 8 characters
                </div>
                 <div className={`flex items-center gap-2 text-xs ${hasNumber ? 'text-green-500' : 'text-slate-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    Least one number (0-9) or symbol
                </div>
                 <div className={`flex items-center gap-2 text-xs ${hasCase ? 'text-green-500' : 'text-slate-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${hasCase ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    Lowercase (a-z) and uppercase (A-Z)
                </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative mt-4">
              <input 
                type={showConfirmPass ? 'text' : 'password'} 
                placeholder="Confirm new password" 
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 text-sm font-medium pr-10" 
                required 
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;