import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import webSocketService from '../services/websocket';

// Mock devices ảo (virtual devices) - giữ lại từ design ban đầu
const mockRoomsData = [
  {
    id: 'room-living',
    name: 'Living Room',
    devices: 4,
    usage: 20,
    img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=300',
    isVirtual: true
  },
  {
    id: 'room-bedroom',
    name: 'Bedroom',
    devices: 4,
    usage: 20,
    img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=300',
    isVirtual: true
  },
  {
    id: 'room-bathroom',
    name: 'Bathroom',
    devices: 4,
    usage: 20,
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300',
    isVirtual: true
  },
];

const Statistics = () => {
  const navigate = useNavigate();
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [devicesWithData, setDevicesWithData] = useState([]); // Devices có dữ liệu từ PowerConsumptionHistory
  const [timePeriod, setTimePeriod] = useState('Week'); // Today, Week, Month
  const [chartData, setChartData] = useState([]);
  const [dailyPrediction, setDailyPrediction] = useState(null);
  const [monthlyPrediction, setMonthlyPrediction] = useState(null);
  const [stats, setStats] = useState(null);
  const [latestData, setLatestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load devices list
  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Load cả devices từ Device table và devices có dữ liệu từ PowerConsumptionHistory
        const [devicesList, devicesWithData] = await Promise.all([
          apiService.getAllDevices(),
          apiService.getDevicesWithData().catch(() => []) // Nếu API fail, trả về mảng rỗng
        ]);

        setDevices(devicesList);
        setDevicesWithData(devicesWithData || []);

        // Auto-select device có dữ liệu thật
        // CHỈ chọn device có dữ liệu từ PowerConsumptionHistory (ví dụ: 111)
        // KHÔNG BAO GIỜ chọn device từ Device table nếu không có dữ liệu
        if (devicesWithData && devicesWithData.length > 0) {
          // Sắp xếp theo ID giảm dần và chọn device đầu tiên (thường là device mới nhất)
          const sortedDevices = [...devicesWithData].sort((a, b) => b - a);
          const selectedId = sortedDevices[0];
          setSelectedDeviceId(selectedId);
          // console.log(`✓ Auto-selected device with data: ID=${selectedId} (from PowerConsumptionHistory)`);
        } else {
          // KHÔNG chọn device nào cả nếu không có dữ liệu
          // console.log(`⚠ No devices with data found. User must select device manually.`);
          setSelectedDeviceId(null);
        }
      } catch (err) {
        // console.error('Error loading devices:', err);
        setError('Failed to load devices');
      }
    };
    loadDevices();
  }, []);

  // WebSocket subscription ref
  const unsubscribeRef = useRef(null);

  // Load statistics data when device or time period changes
  useEffect(() => {
    if (!selectedDeviceId) return;

    const loadStatistics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Calculate hours based on time period
        const hours = timePeriod === 'Today' ? 24 : timePeriod === 'Week' ? 168 : 720;

        // Load all data in parallel
        const [historyData, dailyPred, monthlyPred, statsData, latest] = await Promise.all([
          apiService.getPowerHistory(selectedDeviceId, hours),
          apiService.getDailyPrediction(selectedDeviceId),
          apiService.getMonthlyPrediction(selectedDeviceId),
          apiService.getConsumptionStats(selectedDeviceId, hours),
          apiService.getLatestPowerData(selectedDeviceId),
        ]);

        // Format history data for chart
        // API trả về object có field "data" chứa array
        const historyArray = historyData?.data || historyData || [];
        const formattedData = formatHistoryForChart(historyArray, timePeriod);
        setChartData(formattedData);

        setDailyPrediction(dailyPred);
        setMonthlyPrediction(monthlyPred);
        setStats(statsData);
        setLatestData(latest);
      } catch (err) {
        // console.error('Error loading statistics:', err);
        setError('Failed to load statistics data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, [selectedDeviceId, timePeriod]);

  // WebSocket realtime subscription for Current Power
  useEffect(() => {
    // console.log('🔌 [Statistics] WebSocket useEffect triggered, selectedDeviceId:', selectedDeviceId);
    // console.log('   Devices list length:', devices.length);
    // console.log('   DevicesWithData:', devicesWithData);

    if (!selectedDeviceId) {
      // console.log('🔌 [Statistics] No device selected, clearing latestData');
      setLatestData(null);
      return;
    }

    // Backend push tất cả MQTT messages lên /topic/sensor
    // Format: {topic, payload, timestamp}
    // Frontend cần subscribe vào /topic/sensor và filter theo deviceId
    const wsTopic = '/topic/sensor';

    // console.log(`🔌 [Statistics] Connecting WebSocket for device ${selectedDeviceId}`);
    // console.log(`   Device topic: ${deviceTopic}`);
    // console.log(`   WebSocket topic: ${wsTopic}`);

    // Unsubscribe previous subscription if exists
    if (unsubscribeRef.current) {
      // console.log('🔌 [Statistics] Unsubscribing from previous topic');
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Connect and subscribe
    // console.log('🔌 [Statistics] Calling webSocketService.connect()...');
    webSocketService.connect()
      .then(() => {
        // console.log(`✓✓✓ [Statistics] WebSocket connected, now subscribing to ${wsTopic}`);
        // console.log('💡 TIP: Check Network tab and filter by "WS" or "sockjs" to see WebSocket connections');

        // Subscribe to WebSocket topic
        // Backend gửi format: {topic: "home/s3/status", payload: "{...}", timestamp: ...}
        unsubscribeRef.current = webSocketService.subscribe(wsTopic, (message) => {
          try {
            // Backend gửi object {topic, payload, timestamp}
            let payloadData = null;

            if (message && typeof message === 'object') {
              // Nếu message có field 'payload', đó là format từ backend
              if (message.payload) {
                // Parse payload string thành JSON
                try {
                  payloadData = typeof message.payload === 'string'
                    ? JSON.parse(message.payload)
                    : message.payload;
                } catch (e) {
                  // Nếu payload không phải JSON, thử dùng message trực tiếp
                  payloadData = message;
                }
              } else {
                // Nếu không có field payload, message chính là data
                payloadData = message;
              }
            } else if (typeof message === 'string') {
              // Nếu message là string, parse JSON
              payloadData = JSON.parse(message);
            }

            if (!payloadData || typeof payloadData !== 'object') {
              return;
            }

            // Check if this data is for the selected device (by ID)
            const dataDeviceId = payloadData.ID || payloadData.deviceId || payloadData.DEVICE_ID;

            // Nếu có deviceId trong data và không khớp với selectedDeviceId, bỏ qua
            if (dataDeviceId && Number(dataDeviceId) !== Number(selectedDeviceId)) {
              return;
            }

            // Update latestData với dữ liệu realtime
            const newData = {
              power: payloadData.pwr || payloadData.power || 0,
              voltage: payloadData.volt || payloadData.voltage || 0,
              current: payloadData.curr || payloadData.current || 0,
              relay: payloadData.relay || 0,
              humidity: payloadData.humi || payloadData.humidity || null,
              timestamp: new Date().toISOString(),
            };

            setLatestData(newData);
          } catch (e) {
            // console.error('Error parsing WebSocket data:', e);
          }
        });

        // console.log(`✓ Subscribed to ${wsTopic}`);
      })
      .catch((error) => {
        // console.error('❌ Failed to connect WebSocket:', error);
        setLatestData(null);
      });

    // Cleanup: unsubscribe when component unmounts or device changes
    return () => {
      // console.log(`🔌 Cleaning up WebSocket subscription for ${wsTopic}`);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [selectedDeviceId, devices]);

  // Helper function: Format date in Vietnam timezone (UTC+7)
  const formatVietnamTime = (timestamp, options = {}) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      ...options
    });
  };

  // Helper function: Get hour in Vietnam timezone
  const getVietnamHour = (timestamp) => {
    if (!timestamp) return 0;
    const date = new Date(timestamp);
    const hourStr = date.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      hour12: false
    });
    return parseInt(hourStr, 10);
  };

  // Helper function: Get day info in Vietnam timezone
  const getVietnamDayInfo = (timestamp) => {
    if (!timestamp) return { dayOfWeek: 0, dayOfMonth: 0 };
    const date = new Date(timestamp);
    const dayStr = date.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: 'numeric'
    });
    const weekdayStr = date.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      weekday: 'short'
    });
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = days.indexOf(weekdayStr);
    return { dayOfWeek, dayOfMonth: parseInt(dayStr, 10) };
  };

  // Format history data for chart based on time period
  // Sử dụng timestamp thực tế và group dữ liệu chính xác với timezone Việt Nam (UTC+7)
  const formatHistoryForChart = (history, period) => {
    if (!history || !Array.isArray(history) || history.length === 0) {
      return [];
    }

    // Đảm bảo dữ liệu được sắp xếp theo timestamp
    const sortedHistory = [...history].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });

    // Lấy thời gian hiện tại
    const now = new Date();

    if (period === 'Today') {
      // Group by hour - tính trung bình công suất mỗi giờ (theo giờ Việt Nam)
      const grouped = {};

      sortedHistory.forEach(item => {
        if (!item.timestamp) return;

        const itemDate = new Date(item.timestamp);
        // Chỉ lấy dữ liệu trong 24h gần nhất
        const hoursDiff = (now - itemDate) / (1000 * 60 * 60);
        if (hoursDiff > 24) return;

        // Lấy giờ theo timezone Việt Nam (UTC+7)
        const hour = getVietnamHour(item.timestamp);
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;

        if (!grouped[hourKey]) {
          grouped[hourKey] = { total: 0, count: 0, timestamp: itemDate };
        }
        grouped[hourKey].total += item.power || 0;
        grouped[hourKey].count += 1;
      });

      // Convert to array và sắp xếp theo thời gian
      return Object.entries(grouped)
        .map(([time, data]) => ({
          time,
          usage: parseFloat((data.total / data.count / 1000).toFixed(3)), // Average kW
          timestamp: data.timestamp,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
    } else if (period === 'Week') {
      // Group by day - tính trung bình công suất mỗi ngày trong 7 ngày gần nhất (theo giờ Việt Nam)
      const grouped = {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      sortedHistory.forEach(item => {
        if (!item.timestamp) return;

        // Get day info theo timezone Việt Nam (UTC+7)
        const { dayOfWeek, dayOfMonth } = getVietnamDayInfo(item.timestamp);
        const dayKey = `${days[dayOfWeek]} ${dayOfMonth}`;
        const dateVietnam = new Date(item.timestamp);

        if (!grouped[dayKey]) {
          grouped[dayKey] = {
            total: 0,
            count: 0,
            timestamp: dateVietnam,
            dayName: days[dayOfWeek],
            dayNum: dayOfMonth
          };
        }
        grouped[dayKey].total += item.power || 0;
        grouped[dayKey].count += 1;
      });

      // Convert to array và sắp xếp theo thời gian
      return Object.entries(grouped)
        .map(([day, data]) => ({
          day: data.dayName,
          usage: parseFloat((data.total / data.count / 1000).toFixed(3)), // Average kW
          timestamp: data.timestamp,
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-7); // Chỉ lấy 7 ngày gần nhất
    } else {
      // Month - group by day, tính trung bình mỗi ngày trong 30 ngày gần nhất (theo giờ Việt Nam)
      const grouped = {};

      sortedHistory.forEach(item => {
        if (!item.timestamp) return;

        // Format day key theo giờ Việt Nam
        const dayKey = formatVietnamTime(item.timestamp, { month: 'short', day: 'numeric' });
        const dateVietnam = new Date(item.timestamp);

        if (!grouped[dayKey]) {
          grouped[dayKey] = {
            total: 0,
            count: 0,
            timestamp: dateVietnam
          };
        }
        grouped[dayKey].total += item.power || 0;
        grouped[dayKey].count += 1;
      });

      // Convert to array và sắp xếp theo thời gian
      return Object.entries(grouped)
        .map(([day, data]) => ({
          day,
          usage: parseFloat((data.total / data.count / 1000).toFixed(3)), // Average kW
          timestamp: data.timestamp,
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-30); // Chỉ lấy 30 ngày gần nhất
    }
  };

  // Format currency
  const formatCurrency = (vnd) => {
    if (vnd >= 1000000) {
      return `${(vnd / 1000000).toFixed(1)}M`;
    } else if (vnd >= 1000) {
      return `${(vnd / 1000).toFixed(1)}K`;
    }
    return vnd.toString();
  };

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-10">

      {/* SECTION 1: DARK DASHBOARD */}
      <div className="bg-[#1e293b] text-white p-8 rounded-b-[3rem] shadow-2xl">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Statistics</p>
                <h1 className="text-2xl font-bold">Electricity Usage</h1>
                {selectedDevice && (
                  <p className="text-slate-400 text-sm mt-1">{selectedDevice.name}</p>
                )}
              </div>
            </div>

            {/* Device Selector - CHỈ hiển thị devices có dữ liệu */}
            {devicesWithData.length > 0 && (
              <select
                value={selectedDeviceId || ''}
                onChange={(e) => {
                  const newId = e.target.value ? Number(e.target.value) : null;
                  setSelectedDeviceId(newId);
                  // console.log(`User selected device: ID=${newId}`);
                }}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Device</option>
                {devicesWithData.sort((a, b) => b - a).map(deviceId => {
                  // Tìm device name từ devices list
                  const device = devices.find(d => d.id === deviceId);
                  return (
                    <option key={deviceId} value={deviceId} className="bg-slate-800">
                      {device ? `${device.name} (ID: ${deviceId})` : `Device ID: ${deviceId}`}
                    </option>
                  );
                })}
              </select>
            )}

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {['Today', 'Week', 'Month'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimePeriod(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timePeriod === t ? 'bg-[#facc15] text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertTriangle size={16} />
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          {/* Chart & Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-3 h-[350px] relative">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-yellow-400" size={32} />
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>No data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey={timePeriod === 'Today' ? 'time' : 'day'}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 500 }}
                      dy={20}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                      tickFormatter={(value) => `${value} kW`}
                      domain={[0, 'dataMax + 0.01']}
                    />
                    <Tooltip
                      cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          // Format timestamp theo giờ Việt Nam (UTC+7)
                          const timestamp = data.timestamp ? formatVietnamTime(data.timestamp, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Ho_Chi_Minh'
                          }) : '';

                          return (
                            <div className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold shadow-xl border-none">
                              <div className="text-sm font-bold">{payload[0].value} kW</div>
                              {timestamp && (
                                <div className="text-xs text-slate-500 mt-1">{timestamp} (GMT+7)</div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      fill="url(#chartGradient)"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Side Statistics Cards */}
            <div className="flex flex-col gap-4">
              {/* Daily Prediction */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between h-full">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Today Prediction</p>
                  {isLoading ? (
                    <Loader2 className="animate-spin text-yellow-400 mt-4" size={24} />
                  ) : dailyPrediction ? (
                    <>
                      <h3 className="text-3xl font-bold mt-1">
                        {dailyPrediction.predictedEnergyKwh?.toFixed(2) || '0'}
                        <span className="text-sm font-normal text-slate-500"> kWh</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">
                        {dailyPrediction.predictedCostVndFormatted || formatCurrency(dailyPrediction.predictedCostVnd || 0)} VND
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm mt-2">No data</p>
                  )}
                </div>
                {dailyPrediction && dailyPrediction.predictedCostVnd > 50000 && (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold mt-4">
                    <AlertTriangle size={16} /> High cost warning
                  </div>
                )}
              </div>

              {/* Monthly Prediction */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between h-full">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Monthly Prediction</p>
                  {isLoading ? (
                    <Loader2 className="animate-spin text-yellow-400 mt-4" size={24} />
                  ) : monthlyPrediction ? (
                    <>
                      <h3 className="text-3xl font-bold mt-1">
                        {monthlyPrediction.predictedEnergyKwh?.toFixed(1) || '0'}
                        <span className="text-sm font-normal text-slate-500"> kWh</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">
                        {monthlyPrediction.predictedCostVndFormatted || formatCurrency(monthlyPrediction.predictedCostVnd || 0)} VND
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm mt-2">No data</p>
                  )}
                </div>
                {monthlyPrediction && monthlyPrediction.predictedCostVnd > 1000000 && (
                  <div className="flex items-center gap-1 text-red-400 text-sm font-bold mt-4">
                    <AlertTriangle size={16} /> Very high cost
                  </div>
                )}
              </div>

              {/* Current Power - Realtime từ WebSocket */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between h-full">
                <div>
                  <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    Current Power
                    {latestData && (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-green-400 text-xs font-bold">Realtime</span>
                      </>
                    )}
                  </p>
                  {latestData ? (
                    <>
                      <h3 className="text-3xl font-bold mt-1">
                        {latestData.power ? latestData.power.toFixed(1) : '0'}
                        <span className="text-sm font-normal text-slate-500"> W</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">
                        {latestData.voltage?.toFixed(1) || '0'}V / {latestData.current?.toFixed(2) || '0'}A
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm mt-2">Waiting for data...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ROOMS LIST (Virtual Rooms - giữ lại từ design ban đầu) */}
      <div className="max-w-6xl mx-auto w-full px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            Your Rooms <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-xs">{mockRoomsData.length}</span>
          </h2>
          <button
            onClick={() => navigate('/app/devices')}
            className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:text-blue-700"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockRoomsData.map((room) => (
            <div
              key={room.id}
              className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-[2rem] mb-4">
                <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="flex justify-between items-end px-2 pb-2">
                <div>
                  <h4 className="font-bold text-slate-800">{room.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-xs text-slate-400 font-medium">{room.devices} devices</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-800">{room.usage} <span className="text-xs font-normal text-slate-400">kW</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: REAL DEVICES LIST (Devices từ API) */}
      {devices.length > 0 && (
        <div className="max-w-6xl mx-auto w-full px-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              Real Devices <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-xs">{devices.length}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {devices.slice(0, 6).map((device) => (
              <div
                key={device.id}
                onClick={() => setSelectedDeviceId(device.id)}
                className={`bg-white p-4 rounded-[2.5rem] border shadow-sm hover:shadow-md transition-all group cursor-pointer ${selectedDeviceId === device.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-100'
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-slate-800">{device.name || `Device ${device.id}`}</h4>
                    <p className="text-xs text-slate-400 mt-1">Topic: {device.topic || 'N/A'}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${selectedDeviceId === device.id ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-medium">Device ID: {device.id}</div>
                  {selectedDeviceId === device.id && (
                    <div className="text-xs text-blue-600 font-bold">Selected</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: PREDICTION DETAILS */}
      {(dailyPrediction || monthlyPrediction) && (
        <div className="max-w-6xl mx-auto w-full px-8 mt-8">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Prediction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyPrediction && (
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-2">24 Hours</p>
                  <p className="text-sm text-slate-600">{dailyPrediction.message || 'No prediction message'}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-slate-400">Current:</span>
                    <span className="text-sm font-bold text-slate-800">
                      {dailyPrediction.currentPowerKw?.toFixed(3) || '0'} kW
                    </span>
                  </div>
                </div>
              )}
              {monthlyPrediction && (
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-2">30 Days</p>
                  <p className="text-sm text-slate-600">{monthlyPrediction.message || 'No prediction message'}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-slate-400">Current:</span>
                    <span className="text-sm font-bold text-slate-800">
                      {monthlyPrediction.currentPowerKw?.toFixed(3) || '0'} kW
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Statistics;