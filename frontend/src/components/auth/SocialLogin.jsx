// src/components/auth/SocialLogin.jsx
import React from 'react';

const SocialLogin = () => {
  return (
    <div className="mt-6 space-y-3">
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">Or continue with</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button type="button" className="flex items-center justify-center gap-3 w-full py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span className="text-sm font-semibold text-slate-600">Google Account</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-3 w-full py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <img src="https://www.svgrepo.com/show/448234/apple.svg" className="w-5 h-5" alt="Apple" />
          <span className="text-sm font-semibold text-slate-600">Apple Account</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;