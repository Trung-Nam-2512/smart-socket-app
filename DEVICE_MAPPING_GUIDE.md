# Hướng dẫn Cơ chế Mapping Topic -> DeviceId Thông minh

## 🎯 Vấn đề đã giải quyết

**Trước đây:** Hardcode deviceId = 36 cho tất cả topic `home/s3/status`
- ❌ Không linh hoạt
- ❌ Không hỗ trợ nhiều thiết bị
- ❌ Phải sửa code mỗi khi thêm thiết bị mới

**Bây giờ:** Tự động mapping topic -> deviceId
- ✅ Tự động tìm device trong database
- ✅ Tự động tạo device mới nếu chưa có
- ✅ Cache để tối ưu hiệu năng
- ✅ Hỗ trợ nhiều thiết bị cùng lúc

## 🔧 Cách hoạt động

### 1. Khi nhận MQTT message

```
MQTT Topic: home/s3/status
    ↓
DeviceMappingService.getOrCreateDeviceId()
    ↓
Kiểm tra cache → Nếu có → Trả về deviceId
    ↓
Nếu không có → Query database theo topic
    ↓
Nếu tìm thấy → Lưu cache → Trả về deviceId
    ↓
Nếu không tìm thấy → Tạo device mới → Lưu cache → Trả về deviceId
```

### 2. Tự động tạo tên device

Service tự động tạo tên device dựa trên topic pattern:

| Topic Pattern | Tên Device Tự Động |
|--------------|-------------------|
| `home/s3/status` | "Sensor S3" |
| `home/s3/led` | "LED S3" |
| `home/s3/temp` | "Temperature Sensor" |
| `home/pump/data` | "Pump Device" |
| `sensor/humidity` | "Sensor Device" |

## 📝 Ví dụ sử dụng

### Tự động tạo device khi nhận MQTT message

Khi ESP32 gửi message đến topic `home/s3/status` lần đầu tiên:

1. System tự động tạo device mới:
   - **Topic:** `home/s3/status`
   - **Name:** "Power Sensor" (tự động)
   - **DeviceId:** Auto-generated (ví dụ: 37, 38, ...)

2. Lưu dữ liệu vào:
   - `Telemetry` table với deviceId mới
   - `PowerConsumptionHistory` table với deviceId mới

### Tạo device thủ công qua API

```bash
POST http://localhost:8080/devices
Content-Type: application/json

{
  "name": "Phòng khách Sensor",
  "topic": "home/s3/status"
}
```

Response:
```json
{
  "id": 37,
  "name": "Phòng khách Sensor",
  "topic": "home/s3/status"
}
```

Sau đó, khi nhận MQTT message từ topic này, system sẽ dùng deviceId = 37.

## 🚀 Lợi ích

### 1. **Không cần hardcode**
- Không cần sửa code khi thêm thiết bị mới
- Tự động nhận diện thiết bị mới

### 2. **Hỗ trợ nhiều thiết bị**
- Mỗi topic có thể có device riêng
- Dễ dàng quản lý nhiều ESP32

### 3. **Cache hiệu năng**
- Giảm số lần query database
- Tăng tốc độ xử lý

### 4. **Tự động hóa**
- Tự động tạo device khi cần
- Tự động đặt tên hợp lý

## 📊 Database Schema

### Device Table
```sql
CREATE TABLE device (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    topic VARCHAR(255) UNIQUE
);
```

### PowerConsumptionHistory Table
```sql
CREATE TABLE power_consumption_history (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL,
    voltage DOUBLE PRECISION NOT NULL,
    current DOUBLE PRECISION NOT NULL,
    power DOUBLE PRECISION NOT NULL,
    humidity DOUBLE PRECISION,
    relay INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (device_id) REFERENCES device(id)
);
```

## 🔍 API Endpoints

### Lấy tất cả devices
```bash
GET http://localhost:8080/devices
```

### Tạo device mới
```bash
POST http://localhost:8080/devices
Content-Type: application/json

{
  "name": "Tên thiết bị",
  "topic": "mqtt/topic/here"
}
```

### Điều khiển device
```bash
POST http://localhost:8080/devices/{id}/control
Content-Type: text/plain

"1"  # Payload
```

## 💡 Best Practices

### 1. **Đặt tên topic có cấu trúc**
✅ Tốt:
- `home/s3/status`
- `home/kitchen/temp`
- `office/floor1/led`

❌ Không tốt:
- `sensor1`
- `device`
- `data`

### 2. **Tạo device trước khi deploy**
Nếu biết trước các topic, nên tạo device qua API trước:
```bash
# Tạo device cho sensor
POST /devices
{
  "name": "Phòng khách Power Sensor",
  "topic": "home/s3/status"
}

# Tạo device cho LED
POST /devices
{
  "name": "Phòng khách LED",
  "topic": "home/s3/led"
}
```

### 3. **Sử dụng deviceId từ database**
Khi gọi API prediction, dùng deviceId từ database, không hardcode:
```bash
# Lấy danh sách devices
GET /devices

# Dùng deviceId từ response
GET /api/power/predict/daily/{deviceId}
```

## 🐛 Troubleshooting

### Device không được tạo tự động
- Kiểm tra log: `Da tao device moi tu dong - Topic: ...`
- Kiểm tra database có device với topic đó chưa
- Kiểm tra cache: có thể cần restart app

### DeviceId không đúng
- Xóa cache: `deviceMappingService.clearCache()`
- Kiểm tra database: `SELECT * FROM device WHERE topic = '...'`

### Nhiều device cùng topic
- Mỗi topic chỉ nên có 1 device
- Nếu cần nhiều device, dùng topic khác nhau

## 📈 Mở rộng trong tương lai

1. **Device Groups**: Nhóm nhiều device lại
2. **Device Metadata**: Thêm thông tin như location, type, etc.
3. **Device Status**: Online/Offline tracking
4. **Device Configuration**: Cấu hình riêng cho từng device


