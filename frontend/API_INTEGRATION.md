# API Integration Guide

## Environment Variables

### Development (Local)

Tạo file `.env` trong thư mục `frontend/` với nội dung:

```env
# Development - Backend chạy riêng
VITE_API_BASE_URL=http://localhost:1446
```

### Production (Docker - Same Container)

Khi deploy frontend và backend trong cùng một Docker container, sử dụng relative paths:

```env
# Production - Relative path (same origin)
VITE_API_BASE_URL=/
```

Hoặc để trống (empty string) cũng sẽ dùng relative paths.

**Lưu ý:**

- Vite chỉ load các biến môi trường có prefix `VITE_`
- Sau khi thay đổi `.env`, cần restart dev server
- Trong Docker, env vars được set tại build time trong Dockerfile
- Khi `VITE_API_BASE_URL=/` hoặc empty, API service sẽ tự động sử dụng relative paths

## API Service

File `src/services/api.js` cung cấp các hàm để gọi API backend:

### Device APIs

```javascript
import apiService from '../services/api';

// Lấy tất cả devices
const devices = await apiService.getAllDevices();

// Lấy device theo ID
const device = await apiService.getDeviceById(1);

// Lấy device theo topic
const device = await apiService.getDeviceByTopic('home/s3/cmd');

// Tạo device mới
const newDevice = await apiService.createDevice({
  name: 'Smart Lamp',
  topic: 'home/s3/cmd'
});

// Điều khiển device
await apiService.controlDevice(deviceId, 'ON');
await apiService.controlDevice(deviceId, 'BRIGHTNESS:80');
await apiService.controlDevice(deviceId, 'TEMP:45');

// Điều khiển device theo topic (tự động tìm deviceId)
await apiService.controlDeviceByTopic('home/s3/cmd', 'ON');
```

### Power Prediction APIs

```javascript
// Dự đoán tiêu thụ điện theo ngày
const dailyPrediction = await apiService.getDailyPrediction(deviceId);

// Dự đoán tiêu thụ điện theo tháng
const monthlyPrediction = await apiService.getMonthlyPrediction(deviceId);

// Dự đoán tiêu thụ điện theo số giờ tùy chỉnh
const customPrediction = await apiService.getCustomPrediction(deviceId, 12);

// Lấy thống kê tiêu thụ
const stats = await apiService.getConsumptionStats(deviceId);

// Lấy lịch sử tiêu thụ điện
const history = await apiService.getPowerHistory(deviceId, 100);

// Lấy dữ liệu mới nhất
const latest = await apiService.getLatestPowerData(deviceId);
```

## LampDetail Component

Component `LampDetail` đã được tích hợp đầy đủ với API:

### Features

1. **Power Toggle**: Click vào nút Power để bật/tắt đèn
2. **Brightness Control**: Kéo thanh slider hoặc click vào thanh brightness để điều chỉnh độ sáng (0-100%)
3. **Color Temperature**: Kéo knob trên dial để thay đổi nhiệt độ màu (2000K - 6500K)
4. **Scene Modes**: Click vào các nút scene (Relax, Work, Night, Reading) để chuyển chế độ

### Device Initialization

Component tự động:

- Tìm device theo `deviceId` từ URL params (nếu có)
- Hoặc tìm device theo topic mặc định `home/s3/cmd`
- Tự động tạo device mới nếu chưa tồn tại

### Command Format

Các lệnh gửi đến backend qua MQTT:

- `ON` / `OFF`: Bật/tắt đèn
- `BRIGHTNESS:{0-100}`: Điều chỉnh độ sáng
- `TEMP:{0-100}`: Điều chỉnh nhiệt độ màu
- `SCENE:{MODE}`: Chuyển chế độ (RELAX, WORK, NIGHT, READING)

## Error Handling

Component hiển thị thông báo lỗi nếu:

- Không kết nối được backend
- Device không tồn tại
- Lệnh gửi thất bại

## Loading States

Component hiển thị loading state khi:

- Đang khởi tạo device
- Đang gửi lệnh điều khiển

## Production Deployment

Khi deploy lên production:

1. Tạo file `.env.production`:

```env
VITE_API_BASE_URL=https://smartsocket.nguyentrungnam.com
```

1. Build với:

```bash
npm run build
```

1. File `.env.production` sẽ được tự động sử dụng khi build.
