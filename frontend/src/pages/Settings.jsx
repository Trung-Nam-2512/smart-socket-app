import React, { useState } from 'react';
import { Image as ImageIcon, ChevronDown, EyeOff, Check, Eye } from 'lucide-react';

// --- 1. COMPONENT TAB ACCOUNT INFORMATION ---
const AccountInfoTab = () => {
  return (
    <div className="max-w-[600px] mx-auto px-4">
      <div className="flex flex-col items-center mb-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-50/80 rounded-full -z-0"></div>
        <div className="relative group cursor-pointer z-10">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1__nUveMs5K4VA2cdLheJMT6C-tqFQveppg&s" 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover shadow-sm border-[5px] border-white"
          />
          <button className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white p-2.5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-[#0085FF] hover:bg-blue-50 transition-colors border border-slate-50">
            <ImageIcon size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-7">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-500 ml-1">Full Name</label>
          <input type="text" defaultValue="Duong" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-[#0085FF] focus:ring-4 focus:ring-blue-500/10 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-500 ml-1">Phone</label>
          <div className="flex gap-3">
            <div className="flex items-center justify-between gap-2 px-4 py-3.5 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300 transition-all w-[110px]">
              <span>VN</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
            <input type="text" defaultValue="+84 123456789" className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-[#0085FF] focus:ring-4 focus:ring-blue-500/10 transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-500 ml-1">Email</label>
          <input type="email" defaultValue="duong@test.com" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-[#0085FF] focus:ring-4 focus:ring-blue-500/10 transition-all" />
        </div>
      </div>
    </div>
  );
};

// --- 2. COMPONENT TAB CHANGE PASSWORD (CÓ LOGIC HOẠT ĐỘNG) ---
const ChangePasswordTab = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Logic kiểm tra các điều kiện
  const checks = {
    length: password.length >= 8,
    numberOrSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
  };

  // Tính toán phần trăm thanh progress (chia làm 3 nấc)
  const strengthCount = Object.values(checks).filter(Boolean).length;
  const progressWidth = (strengthCount / 3) * 100;
  const progressColor = strengthCount === 3 ? 'bg-emerald-500' : strengthCount === 2 ? 'bg-orange-400' : 'bg-red-400';

  return (
    <div className="max-w-[450px] mx-auto px-4 flex flex-col items-center">
      <h3 className="text-[28px] font-bold text-slate-700 mb-10">Reset password</h3>
      
      <div className="w-full space-y-6">
        {/* New Password Input */}
        <div className="relative">
          <input 
            type={showPass ? "text" : "password"} 
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-300 transition-all pr-12"
          />
          <button 
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          
          {/* Progress Bar động */}
          <div className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${progressColor}`} 
              style={{ width: `${password ? progressWidth : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Validation Rules động */}
        <div className="space-y-3 pt-2">
          {/* Rule 1: Độ dài */}
          <div className={`flex items-center gap-2 text-[15px] transition-colors ${checks.length ? 'text-emerald-500 font-medium' : 'text-slate-300'}`}>
            {checks.length ? <Check size={18} /> : <div className="w-2 h-2 rounded-full bg-slate-300 ml-1.5 mr-0.5"></div>}
            <span>Least 8 characters</span>
          </div>

          {/* Rule 2: Số hoặc ký tự đặc biệt */}
          <div className={`flex items-center gap-2 text-[15px] transition-colors ${checks.numberOrSymbol ? 'text-emerald-500 font-medium' : 'text-slate-300'}`}>
            {checks.numberOrSymbol ? <Check size={18} /> : <div className="w-2 h-2 rounded-full bg-slate-300 ml-1.5 mr-0.5"></div>}
            <span>Least one number (0-9) or symbol</span>
          </div>

          {/* Rule 3: Chữ hoa & chữ thường */}
          <div className={`flex items-center gap-2 text-[15px] transition-colors ${checks.upperLower ? 'text-emerald-500 font-medium' : 'text-slate-300'}`}>
            {checks.upperLower ? <Check size={18} /> : <div className="w-2 h-2 rounded-full bg-slate-300 ml-1.5 mr-0.5"></div>}
            <span>Lowercase (a-z) and uppercase (A-Z)</span>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="relative mt-8">
          <input 
            type="password" 
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-5 py-4 rounded-2xl border text-slate-700 focus:outline-none transition-all pr-12 ${
              confirmPassword && confirmPassword !== password ? 'border-red-300 bg-red-50/30' : 'border-slate-200 focus:border-[#0085FF]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

// --- MAIN SETTINGS COMPONENT ---
const Settings = () => {
  const [activeTab, setActiveTab] = useState('Account information');
  const tabs = ['Account information', 'Change Password'];

  return (
    <div className="w-full h-full flex flex-col p-6 gap-6 bg-[#F8F9FD]"> 
      <h2 className="text-2xl font-bold text-slate-800 shrink-0">Profile</h2>

      <div className="flex-1 bg-white rounded-[30px] shadow-sm flex flex-col relative overflow-hidden">
        <div className="px-8 pt-2 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-6 text-[15px] font-bold whitespace-nowrap transition-all relative px-1 ${
                  activeTab === tab ? 'text-[#0085FF]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0085FF] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto no-scrollbar py-10">
          {activeTab === 'Account information' ? <AccountInfoTab /> : <ChangePasswordTab />}
        </div>

        <div className="border-t border-slate-100 py-6 px-8 mt-auto shrink-0 flex items-center justify-between bg-white">
          <p className="text-slate-400 text-[15px] font-medium">
            {activeTab === 'Account information' ? 'Edit your account information' : 'Ensure your password is secure'}
          </p>
          <button className="bg-[#0085FF] hover:bg-blue-600 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95">
            Save updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;