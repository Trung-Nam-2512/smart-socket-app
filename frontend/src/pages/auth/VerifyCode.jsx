// src/pages/auth/VerifyCode.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lightbulb, ChevronLeft } from 'lucide-react';
import suscessHouseImg from '../../assets/suscess-house.png';

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy giá trị state truyền từ trang trước (mặc định là login nếu không có)
  const previousPage = location.state?.from || 'login';

  const [code, setCode] = useState(['', '', '', '']);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    
    // Tự động focus ô tiếp theo
    if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
      // Xử lý nút xóa lùi (backspace)
      if (e.key === 'Backspace' && !code[index] && index > 0) {
          document.getElementById(`otp-${index - 1}`).focus();
      }
  };

  const handleVerify = () => {
    // Logic xác thực API ở đây...

    // --- ĐIỀU HƯỚNG THÔNG MINH ---
    if (previousPage === 'reset-password') {
        // Nếu đến từ quên mật khẩu -> Cho đi đổi mật khẩu
        navigate('/reset-password');
    } else {
        // Nếu đến từ đăng nhập -> Vào trang thành công
        navigate('/auth-success');
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* CỘT TRÁI */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F4F6F9] relative flex-col items-center justify-end p-12 overflow-hidden">
        <div className="absolute top-[0%] w-[80%] max-w-[600px]">
             <img src={suscessHouseImg} alt="Smart Home" className="w-full h-auto drop-shadow-xl object-contain" />
        </div>
        <div className="relative z-10 w-full max-w-md mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Easy living with your <br/><span className="inline-flex items-center gap-2">smart home <Lightbulb className="w-8 h-8 text-yellow-400 fill-yellow-400" strokeWidth={2.5} /></span></h1>
          <p className="text-slate-500 text-lg mb-8">Control your entire house in one place.</p>
           <div className="flex gap-2 justify-center lg:justify-start">
             <div className="w-2 h-2 rounded-full bg-slate-300"></div><div className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100"></div><div className="w-2 h-2 rounded-full bg-slate-300"></div><div className="w-2 h-2 rounded-full bg-slate-300"></div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Check your email</h2>
            <p className="text-slate-400 text-sm">
              We sent a code to <span className="font-bold text-slate-700">hello@example.com</span> <br/>
              Enter 4 digit code that mentioned in the email.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center gap-4">
              {code.map((num, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={num}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-16 h-16 text-center text-2xl font-bold bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder-slate-300"
                  placeholder="-"
                />
              ))}
            </div>

            <button 
              onClick={handleVerify}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Verify Code
            </button>

            <div className="text-center text-slate-500 text-sm">
              Don't receive email? <button className="text-blue-600 font-bold hover:underline">Resend</button>
            </div>
             <div className="text-center mt-4">
                 <Link to="/login" className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">
                    <ChevronLeft size={14} /> Back to login
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;