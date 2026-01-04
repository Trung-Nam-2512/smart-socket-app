import React from 'react';
import Step6Confirm from './Step6Confirm';

// QUAN TRỌNG: Phải nhận props { onBack, onFinish } ở đây
const Step6 = ({ onBack, onFinish }) => {
  return (
    // Wrapper giữ layout chuẩn
    <div className="w-full h-screen bg-[#F8FAFC] overflow-hidden">
       {/* QUAN TRỌNG: Phải truyền tiếp props xuống Step6Confirm */}
       <Step6Confirm 
          onBack={onBack} 
          onFinish={onFinish} 
       />
    </div>
  );
};

export default Step6;