import React, { useState, useEffect } from 'react';
import { Sun, Moon, Coffee, Briefcase, Zap, MoreHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';
import lampImg from '../../assets/lamp.png';
import apiService from '../../services/api';

const LampDetail = () => {
  const { deviceId: urlDeviceId } = useParams(); // Get deviceId from URL if available
  const [deviceId, setDeviceId] = useState(null);
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [temp, setTemp] = useState(45); // 0: Warm, 100: Cold
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);

  // Initialize device - try to get deviceId from URL or default topic
  useEffect(() => {
    const initializeDevice = async () => {
      try {
        // If deviceId is provided in URL (numeric), use it
        if (urlDeviceId && !isNaN(urlDeviceId)) {
          setDeviceId(parseInt(urlDeviceId));
          const device = await apiService.getDeviceById(parseInt(urlDeviceId));
          setDeviceInfo(device);
        } else {
          // Otherwise, try to find device by default topic (home/s3/cmd for lamp control)
          const defaultTopic = 'home/s3/cmd';
          const deviceData = await apiService.getDeviceByTopic(defaultTopic);
          if (deviceData.found) {
            setDeviceId(deviceData.deviceId);
            setDeviceInfo(deviceData);
          } else {
            // If device doesn't exist, create it
            const newDevice = await apiService.createDevice({
              name: 'Smart Lamp',
              topic: defaultTopic,
            });
            setDeviceId(newDevice.id);
            setDeviceInfo(newDevice);
          }
        }
      } catch (err) {
        // console.error('Error initializing device:', err);
        setError('Failed to initialize device. Please check your connection.');
      }
    };

    initializeDevice();
  }, [urlDeviceId]);

  // Handle power toggle
  const handlePowerToggle = async () => {
    if (!deviceId) {
      setError('Device not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newPowerState = !isPowerOn;
      // ESP32 cần nhận 0 hoặc 1 để điều khiển relay
      const command = newPowerState ? '1' : '0';

      // Send command to backend
      await apiService.controlDevice(deviceId, command);

      // Update local state
      setIsPowerOn(newPowerState);
    } catch (err) {
      // console.error('Error toggling power:', err);
      setError('Failed to control device. Please try again.');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle brightness change
  const handleBrightnessChange = async (newBrightness) => {
    if (!deviceId) {
      setError('Device not initialized');
      return;
    }

    setBrightness(newBrightness);

    try {
      // Send brightness command (0-100)
      const command = `BRIGHTNESS:${newBrightness}`;
      await apiService.controlDevice(deviceId, command);
    } catch (err) {
      // console.error('Error changing brightness:', err);
      setError('Failed to update brightness. Please try again.');
    }
  };

  // Handle color temperature change
  const handleTempChange = async (newTemp) => {
    if (!deviceId) {
      setError('Device not initialized');
      return;
    }

    setTemp(newTemp);

    try {
      // Send color temperature command (0-100, maps to warm-cold)
      const command = `TEMP:${newTemp}`;
      await apiService.controlDevice(deviceId, command);
    } catch (err) {
      // console.error('Error changing color temperature:', err);
      setError('Failed to update color temperature. Please try again.');
    }
  };

  // Handle scene mode selection
  const handleSceneMode = async (mode) => {
    if (!deviceId) {
      setError('Device not initialized');
      return;
    }

    try {
      const command = `SCENE:${mode.toUpperCase()}`;
      await apiService.controlDevice(deviceId, command);
    } catch (err) {
      // console.error('Error setting scene mode:', err);
      setError('Failed to set scene mode. Please try again.');
    }
  };

  // Show loading state
  if (!deviceId && !error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold">Initializing device...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in zoom-in duration-700 h-full overflow-y-visible">
      {/* Error Message */}
      {error && (
        <div className="col-span-12 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* CỘT TRÁI: THIẾT BỊ & ĐỘ SÁNG */}
      <div className="col-span-12 lg:col-span-5 space-y-8">
        <div className="relative flex items-center justify-center py-10 min-h-[400px]">
          {/* Hiệu ứng hào quang (Glow) quanh đèn */}
          <div
            className={`absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-40 transition-all duration-500 ${isPowerOn ? 'bg-yellow-100' : 'bg-slate-100'
              }`}
          ></div>
          <div className="absolute w-[400px] h-[400px] border border-slate-100 rounded-full opacity-40"></div>

          <img
            src={lampImg}
            className="w-64 relative z-10 drop-shadow-2xl transition-all duration-500"
            style={{
              filter: `brightness(${isPowerOn ? 0.5 + brightness / 100 : 0.2})`,
              opacity: isPowerOn ? 1 : 0.5
            }}
            alt="Smart Lamp"
          />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-8">
          {/* Status Toggle */}
          <div className="flex justify-between items-center border-b border-slate-50 pb-6">
            <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Power</span>
            <div className="flex items-center gap-3">
              <span className={`font-black transition-colors ${isPowerOn ? 'text-yellow-500' : 'text-slate-300'}`}>
                {isPowerOn ? 'ON' : 'OFF'}
              </span>
              <div
                onClick={handlePowerToggle}
                disabled={isLoading}
                className={`w-12 h-6 rounded-full p-1 flex items-center shadow-inner cursor-pointer transition-all duration-300 ${isPowerOn ? 'bg-yellow-400 justify-end' : 'bg-slate-200 justify-start'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
          </div>

          {/* Lifespan/Battery */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Bulb Life</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800">85%</span>
              <div className="w-5 h-2.5 border border-green-400 rounded-[2px] p-[1px] relative">
                <div className="w-[85%] h-full bg-green-400 rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Brightness Slider */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between">
              <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Brightness</span>
              <span className="text-xs font-black text-slate-800">{brightness}%</span>
            </div>
            <div
              className="h-12 bg-slate-50 rounded-2xl relative overflow-hidden flex items-center px-1 shadow-inner border border-slate-100/50 cursor-pointer"
              onClick={(e) => {
                if (!isPowerOn) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
                handleBrightnessChange(percentage);
              }}
            >
              <div
                className={`h-10 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl shadow-lg flex items-center px-4 gap-3 transition-all duration-300 ${!isPowerOn ? 'opacity-50' : ''
                  }`}
                style={{ width: `${brightness}%` }}
              >
                <Sun size={16} className="text-white" />
              </div>
            </div>
            {/* Brightness input for precise control */}
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
              disabled={!isPowerOn || isLoading}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${brightness}%, #e2e8f0 ${brightness}%, #e2e8f0 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: MÀU SẮC & CHẾ ĐỘ */}
      <div className="col-span-12 lg:col-span-7 space-y-8">
        <div className="bg-white p-12 rounded-[3rem] shadow-sm flex flex-col items-center justify-center relative min-h-[500px]">
          <h3 className="absolute top-10 left-10 font-black text-xl text-slate-800 tracking-tight">Color Temperature</h3>

          {/* Color Temp Dial */}
          <div
            className={`w-72 h-72 rounded-full border-[18px] border-slate-50 flex flex-col items-center justify-center relative ${!isPowerOn ? 'opacity-50' : ''
              }`}
            onMouseDown={(e) => {
              if (!isPowerOn || isLoading) return;
              const handleMouseMove = (moveEvent) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const x = moveEvent.clientX - centerX;
                const y = moveEvent.clientY - centerY;
                let angle = Math.atan2(y, x) * (180 / Math.PI);
                angle = (angle + 90 + 360) % 360; // Normalize to 0-360
                const newTemp = Math.round(angle / 3.6); // Convert to 0-100
                handleTempChange(newTemp);
              };
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="text-center">
              {/* Calculate color temperature: 2000K (warm) to 6500K (cold) */}
              {(() => {
                const kelvin = Math.round(2000 + (temp / 100) * 4500);
                const tempLabels = {
                  warm: 'Warm White',
                  natural: 'Natural White',
                  cool: 'Cool White',
                  daylight: 'Daylight'
                };
                let label = 'Natural White';
                if (temp < 25) label = tempLabels.warm;
                else if (temp < 50) label = tempLabels.natural;
                else if (temp < 75) label = tempLabels.cool;
                else label = tempLabels.daylight;

                return (
                  <>
                    <span className="text-5xl font-black text-slate-800 tracking-tighter">{kelvin}</span>
                    <span className="text-xl font-black text-slate-800 ml-1">K</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{label}</p>
                  </>
                );
              })()}
            </div>
            {/* Knob */}
            <div
              className={`absolute w-8 h-8 bg-white rounded-full border-4 border-yellow-400 shadow-lg z-20 ${!isPowerOn || isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing'
                }`}
              style={{
                transform: `rotate(${temp * 3.6}deg) translateY(-144px)`,
                transition: 'transform 0.3s ease-out'
              }}
            ></div>
            {/* Gradient Track */}
            <div className="absolute inset-0 rounded-full border-[18px] border-transparent border-t-orange-200 border-r-yellow-100 border-b-blue-50 border-l-blue-200 opacity-40"></div>
          </div>

          {/* Quick Scene Modes */}
          <div className="grid grid-cols-4 gap-6 mt-16 w-full px-6">
            <ModeButton
              icon={<Coffee />}
              label="Relax"
              active={false}
              color="bg-orange-400"
              onClick={() => handleSceneMode('relax')}
              disabled={!isPowerOn || isLoading}
            />
            <ModeButton
              icon={<Briefcase />}
              label="Work"
              active={false}
              color="bg-blue-500"
              onClick={() => handleSceneMode('work')}
              disabled={!isPowerOn || isLoading}
            />
            <ModeButton
              icon={<Moon />}
              label="Night"
              active={false}
              color="bg-indigo-600"
              onClick={() => handleSceneMode('night')}
              disabled={!isPowerOn || isLoading}
            />
            <ModeButton
              icon={<Zap />}
              label="Reading"
              active={false}
              color="bg-yellow-500"
              onClick={() => handleSceneMode('reading')}
              disabled={!isPowerOn || isLoading}
            />
          </div>
        </div>

        {/* Schedule/Scenes */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 font-black text-xl text-slate-800">
              <h3>Auto Schedule</h3>
              <span className="w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center text-[10px] text-slate-400">2</span>
            </div>
            <MoreHorizontal className="text-slate-300" />
          </div>

          <div className="space-y-4">
            <ScheduleItem title="Morning Sun" time="06:30 AM" active={true} />
            <ScheduleItem title="Sweet Dreams" time="11:00 PM" active={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ModeButton = ({ icon, label, active = false, color, onClick, disabled = false }) => (
  <div
    className={`flex flex-col items-center gap-3 group transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    onClick={disabled ? undefined : onClick}
  >
    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${active ? `${color} text-white shadow-xl scale-105` : 'bg-white border border-slate-100 text-slate-300 hover:bg-slate-50'
      } ${disabled ? '' : 'hover:scale-105'}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className={`text-[11px] font-black uppercase tracking-tighter ${active ? 'text-slate-800' : 'text-slate-400 font-bold'}`}>{label}</span>
  </div>
);

const ScheduleItem = ({ title, time, active }) => (
  <div className={`flex justify-between items-center p-5 rounded-[1.5rem] ${active ? 'bg-yellow-50/50 border border-yellow-100/50' : 'bg-slate-50/50'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${active ? 'bg-white' : 'bg-slate-100'}`}>
        <Sun size={20} className={active ? 'text-yellow-500' : 'text-slate-300'} />
      </div>
      <div>
        <p className="font-bold text-slate-800 leading-none mb-1.5">{title}</p>
        <p className={`text-[10px] font-bold uppercase ${active ? 'text-yellow-600' : 'text-slate-300'}`}>Starts at {time}</p>
      </div>
    </div>
    <div className={`w-10 h-5 rounded-full relative p-1 ${active ? 'bg-yellow-400' : 'bg-slate-200'}`}>
      <div className={`w-3 h-3 bg-white rounded-full transition-all ${active ? 'ml-auto' : ''}`}></div>
    </div>
  </div>
);

export default LampDetail;