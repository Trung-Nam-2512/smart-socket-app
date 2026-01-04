// src/pages/Members.jsx
import React from 'react';
import { MoreVertical, Shield, ShieldCheck, Mail, Phone } from 'lucide-react';

const Members = () => {
  // Dữ liệu giả lập (Sau này bạn có thể thay bằng API)
  const members = [
    {
      id: 1,
      name: 'Duong',
      role: 'Admin',
      email: 'duong@test.com',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1__nUveMs5K4VA2cdLheJMT6C-tqFQveppg&s',
      status: 'Online',
    },
    {
      id: 2,
      name: 'Cody Fisher',
      role: 'Member',
      email: 'cody.fisher@example.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      status: 'Offline',
    },
    {
      id: 3,
      name: 'Esther Howard',
      role: 'Member',
      email: 'esther.howard@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      status: 'Online',
    },
    {
      id: 4,
      name: 'Jenny Wilson',
      role: 'Guest',
      email: 'jenny.wilson@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      status: 'Offline',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Family Members</h1>
          <p className="text-slate-400">Manage access to your smart home</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          + Invite Member
        </button>
      </div>

      {/* Grid danh sách thành viên */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative hover:shadow-md transition-shadow">
            
            {/* Nút option góc trên phải */}
            <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-600">
              <MoreVertical size={20} />
            </button>

            {/* Avatar & Status */}
            <div className="relative mb-4">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
              />
              <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === 'Online' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
            </div>

            {/* Thông tin chính */}
            <h3 className="text-lg font-bold text-slate-800 mb-1">{member.name}</h3>
            
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-6 ${
              member.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {member.role === 'Admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
              {member.role}
            </div>

            {/* Thông tin liên hệ */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-slate-500 text-sm bg-slate-50 p-3 rounded-xl">
                <Mail size={16} />
                <span className="truncate">{member.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 w-full flex gap-3">
               <button className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                 View Profile
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;