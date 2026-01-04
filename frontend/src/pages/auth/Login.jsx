// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lightbulb, Eye, EyeOff } from 'lucide-react';

// Import ảnh assets
import loginHouseImg from '../../assets/login-house.png';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Gửi tín hiệu 'from: login' qua state để trang VerifyCode biết đường xử lý
    navigate('/verify-code', { state: { from: 'login' } });
  };

  // SVG Icons
  const GoogleIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);
  const FacebookIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>);
  const AppleIcon = () => (<svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-51.9-25.7-89.7-24.9-49.9 1.9-89.3 33.1-116 85.9-36.5 65.5-24.4 165.3 17.3 223.6 20.3 30.1 45 59.4 79.5 58.9 30.5-.4 43.4-19.6 79.3-20.3 36.2.7 46.9 20.3 81.1 19.6 34.5-1.3 56.3-30.5 77.8-58 14-21.8 28.8-57.6 37.7-82.2-6.9-2.3-13.8-4.7-20.7-7.1-4.8-1.6-9.6-3.3-14.4-4.9zm-75.9-173.7c16.8-21.2 29.6-47.3 26.3-78.4-25.3 1.1-54.5 15.6-72.3 37.6-14.9 18.1-28.1 45.2-24.9 73.7 27.2 2.3 56.9-15.8 70.9-32.9z" /></svg>);

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* CỘT TRÁI */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F6F9] relative flex-col items-center justify-end p-12 overflow-hidden">
        <div className="absolute top-[0%] w-[80%] max-w-[600px]">
             <img src={loginHouseImg} alt="Secure Smart Home" className="w-full h-auto drop-shadow-xl object-contain" />
        </div>
        <div className="relative z-10 w-full max-w-md mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            Easy living with your <br/>
            <span className="inline-flex items-center gap-2">
              smart home <Lightbulb className="w-8 h-8 text-yellow-400 fill-yellow-400" strokeWidth={2.5} />
            </span>
          </h1>
          <p className="text-slate-500 text-lg mb-8">Get you smart devices in one place and manage all of these with a few taps.</p>
          <div className="flex gap-2 justify-center lg:justify-start">
             <div className="w-2 h-2 rounded-full bg-slate-300"></div><div className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100"></div><div className="w-2 h-2 rounded-full bg-slate-300"></div><div className="w-2 h-2 rounded-full bg-slate-300"></div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-400 text-sm">Welcome back! Please enter your details.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <input type="email" placeholder="joe.doe@gmail.com" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm font-medium" required />
            </div>
            <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm font-medium pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            <div className="flex items-center">
                <input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"/>
                <label htmlFor="remember-me" className="ml-2 text-sm text-slate-500 cursor-pointer select-none">Remember information</label>
            </div>
            <div className="space-y-4 text-center">
                <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all">Login</button>
                <Link to="/forgot-password" className="inline-block text-blue-500 text-sm font-bold hover:underline">Forgot password?</Link>
            </div>
          </form>
          
          <div className="relative flex py-2 items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink-0 mx-4 text-slate-400 text-xs">or</span><div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          <div className="space-y-3">
            <button type="button" className="flex items-center justify-center gap-3 w-full py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.99] group"><GoogleIcon /><span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">Login with Google</span></button>
            <button type="button" className="flex items-center justify-center gap-3 w-full py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.99] group"><FacebookIcon /><span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">Login with Facebook</span></button>
            <button type="button" className="flex items-center justify-center gap-3 w-full py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.99] group"><AppleIcon /><span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">Login with Apple</span></button>
          </div>
          
          <p className="text-center text-slate-500 text-sm mt-8">First time here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up for free</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;