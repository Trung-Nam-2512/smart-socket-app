// src/pages/Spaces.jsx
import React, { useState } from 'react';

// Import các Steps
import Step1Empty from '../components/spaces/Step1Empty';
import Step2HomeInfo from '../components/spaces/Step2HomeInfo';
import Step2AddRooms from '../components/spaces/Step2AddRooms'; // <--- IMPORT FILE MỚI
import Step3DeviceList from '../components/spaces/Step3DeviceList';
import Step4AddDevice from '../components/spaces/Step4AddDevice';
import Step5Connected from '../components/spaces/Step5Connected';
import Step6 from '../components/spaces/Step6'; 
import Step7Dashboard from '../components/spaces/Step7Dashboard'; 
import StepFinalMap from '../components/spaces/StepFinalMap';

const Spaces = () => {
  const [step, setStep] = useState(1); 
  
  // 1. State lưu thông tin nhà (từ Step 2)
  const [homeData, setHomeData] = useState({ 
    name: 'My Home', 
    address: '11-5 Raddington Rd, London, UK' 
  });

  // 2. State lưu thiết bị đang được chọn (từ Step 4 -> Step 5)
  const [targetDevice, setTargetDevice] = useState(null);

  // 3. State lưu danh sách thiết bị đã thêm
  const [addedDevices, setAddedDevices] = useState([]);

  // --- CÁC HÀM XỬ LÝ LOGIC ---

  // Xong Step 2 -> Qua Step 3 (Add Rooms - TRANG MỚI)
  const handleStep2Next = (data) => {
    setHomeData(prev => ({ ...prev, ...data }));
    setStep(3); // Chuyển sang trang Add Rooms
  };

  // Xong Step 3 (Add Rooms) -> Qua Step 4 (Device List - TRANG CŨ LÀ STEP 3)
  const handleStep3RoomsNext = () => {
     setStep(4);
  }

  // Xong Step 4 (Device List) -> Qua Step 5 (Add Specific Device)
  const handleStep4DeviceSelect = (device) => {
    setTargetDevice(device);
    setStep(5);
  };

  // Xong Step 5 -> Qua Step 6 (Connected List)
  const handleStep5Continue = (data) => {
    const newDevice = { ...targetDevice, ...data };
    setAddedDevices(prev => [...prev, newDevice]);
    setStep(6);
  };

  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      
      {step === 1 && (
        <Step1Empty onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <Step2HomeInfo 
          onBack={handleBack}
          onNext={handleStep2Next} 
        />
      )}

      {/* --- TRANG MỚI THÊM VÀO --- */}
      {step === 3 && (
        <Step2AddRooms 
           homeData={homeData}
           onBack={handleBack}
           onNext={handleStep3RoomsNext}
        />
      )}

      {/* --- CÁC BƯỚC CŨ BỊ ĐẨY XUỐNG 1 SỐ --- */}
      {step === 4 && (
        <Step3DeviceList 
          homeData={homeData}
          onBack={handleBack}
          onAdd={handleStep4DeviceSelect} 
          onNext={() => setStep(6)} // Skip adding devices
        />
      )}

      {step === 5 && (
        <Step4AddDevice 
          device={targetDevice}
          onBack={handleBack}
          onContinue={handleStep5Continue} 
        />
      )}

      {step === 6 && (
        <Step5Connected
          homeData={homeData}
          addedDevices={addedDevices}
          onAddMore={() => setStep(4)} // Quay lại Device List (Step 4)
          onBack={handleBack} 
          onFinish={() => setStep(7)} 
        />
      )}

      {step === 7 && (
        <Step6 onBack={handleBack} onFinish={() => setStep(8)} />
      )}

      {step === 8 && (
        <Step7Dashboard onMapClick={() => setStep(9)} />
      )}

      {step === 9 && (
        <StepFinalMap onBack={() => setStep(8)} />
      )}

    </div>
  );
};

export default Spaces;