import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { User, Mail, Lock } from 'lucide-react';

const Register = () => {
  return (
    <AuthLayout title="Create Account" subtitle="Let's get started with your 30 day free trial.">
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
          <div className="relative">
            <User className="absolute left-4 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter your name" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-4">
          Create Account
        </button>

        <p className="text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;