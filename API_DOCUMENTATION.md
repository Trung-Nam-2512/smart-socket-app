# API Documentation - Power Prediction & Statistics

## 📊 Tính năng Dự đoán Tiền Điện

### 1. Dự đoán tiền điện cho 24 giờ (1 ngày)

**Endpoint:** `GET /api/power/predict/daily/{deviceId}`

**Ví dụ:**
```bash
GET http://localhost:8080/api/power/predict/daily/36
```

**Response:**
```json
{
  "currentPower": 99.7,
  "currentPowerKw": 0.0997,
  "hours": 24,
  "predictedEnergyKwh": 2.39,
  "predictedCostVnd": 5975,
  "predictedCostVndFormatted": "6.0 nghin",
  "electricityPricePerKwh": 2500,
  "timestamp": "2026-01-03T02:15:18.678",
  "message": "Neu tiep tuc su dung nhu hien tai, ban se tieu thu khoang 2.39 so dien trong 24h, tuong duong 6.0 nghin VND"
}
```

---

### 2. Dự đoán tiền điện cho 1 tháng (30 ngày)

**Endpoint:** `GET /api/power/predict/monthly/{deviceId}`

**Ví dụ:**
```bash
GET http://localhost:8080/api/power/predict/monthly/36
```

**Response:**
```json
{
  "currentPower": 99.7,
  "currentPowerKw": 0.0997,
  "hours": 720,
  "predictedEnergyKwh": 71.78,
  "predictedCostVnd": 179450,
  "predictedCostVndFormatted": "179.5 nghin",
  "electricityPricePerKwh": 2500,
  "timestamp": "2026-01-03T02:15:18.678",
  "message": "Neu tiep tuc su dung nhu hien tai, ban se tieu thu khoang 71.78 so dien trong 1 thang, tuong duong 179.5 nghin VND"
}
```

---

### 3. Dự đoán tiền điện theo số giờ tùy chỉnh

**Endpoint:** `GET /api/power/predict/{deviceId}?hours={hours}`

**Parameters:**
- `deviceId` (path): ID thiết bị
- `hours` (query, optional): Số giờ cần dự đoán (mặc định: 24)

**Ví dụ:**
```bash
# Dự đoán 12 giờ
GET http://localhost:8080/api/power/predict/36?hours=12

# Dự đoán 48 giờ (2 ngày)
GET http://localhost:8080/api/power/predict/36?hours=48
```

**Response:**
```json
{
  "currentPower": 99.7,
  "currentPowerKw": 0.0997,
  "hours": 12,
  "predictedEnergyKwh": 1.20,
  "predictedCostVnd": 2991,
  "predictedCostVndFormatted": "3.0 nghin",
  "electricityPricePerKwh": 2500,
  "timestamp": "2026-01-03T02:15:18.678",
  "message": "Neu tiep tuc su dung nhu hien tai trong 12 gio, ban se tieu thu khoang 1.20 so dien, tuong duong 3.0 nghin VND"
}
```

---

### 4. Thống kê tiêu thụ trong khoảng thời gian

**Endpoint:** `GET /api/power/stats/{deviceId}?start={start}&end={end}`

**Parameters:**
- `deviceId` (path): ID thiết bị
- `start` (query, required): Thời gian bắt đầu (ISO 8601 format)
- `end` (query, required): Thời gian kết thúc (ISO 8601 format)

**Ví dụ:**
```bash
GET http://localhost:8080/api/power/stats/36?start=2026-01-03T00:00:00&end=2026-01-03T23:59:59
```

**Response:**
```json
{
  "deviceId": 36,
  "startTime": "2026-01-03T00:00:00",
  "endTime": "2026-01-03T23:59:59",
  "averagePower": 95.5,
  "totalEnergyKwh": 2.15,
  "totalCostVnd": 5375,
  "totalCostVndFormatted": "5.4 nghin",
  "electricityPricePerKwh": 2500
}
```

---

### 5. Lấy dữ liệu lịch sử để vẽ biểu đồ

**Endpoint:** `GET /api/power/history/{deviceId}?hours={hours}`

**Parameters:**
- `deviceId` (path): ID thiết bị
- `hours` (query, optional): Số giờ gần đây (mặc định: 24)

**Ví dụ:**
```bash
# Lấy dữ liệu 24 giờ gần đây
GET http://localhost:8080/api/power/history/36

# Lấy dữ liệu 12 giờ gần đây
GET http://localhost:8080/api/power/history/36?hours=12
```

**Response:**
```json
{
  "deviceId": 36,
  "startTime": "2026-01-02T02:15:18",
  "endTime": "2026-01-03T02:15:18",
  "count": 4320,
  "data": [
    {
      "id": 1,
      "deviceId": 36,
      "voltage": 235.6,
      "current": 0.423,
      "power": 99.7,
      "humidity": 2.0,
      "relay": 1,
      "timestamp": "2026-01-03T02:15:18.678"
    },
    {
      "id": 2,
      "deviceId": 36,
      "voltage": 232.5,
      "current": 0.613,
      "power": 142.4,
      "humidity": 2.0,
      "relay": 1,
      "timestamp": "2026-01-03T02:15:20.878"
    }
    // ... more data
  ]
}
```

---

### 6. Lấy dữ liệu mới nhất

**Endpoint:** `GET /api/power/latest/{deviceId}`

**Ví dụ:**
```bash
GET http://localhost:8080/api/power/latest/36
```

**Response:**
```json
{
  "id": 12345,
  "deviceId": 36,
  "voltage": 235.6,
  "current": 0.423,
  "power": 99.7,
  "humidity": 2.0,
  "relay": 1,
  "timestamp": "2026-01-03T02:15:18.678"
}
```

---

## 🔧 Cấu hình

### Giá điện (application.properties)

```properties
# Giá điện mặc định: 2500 VNĐ/kWh
electricity.price=2500
```

Có thể thay đổi giá điện theo từng khu vực hoặc thời gian.

---

## 📈 Công thức tính toán

### Linear Extrapolation (Giai đoạn "Giờ đầu tiên")

**Công thức:**
```
Năng lượng (kWh) = Công suất (kW) × Số giờ
Tiền điện (VNĐ) = Năng lượng (kWh) × Giá điện (VNĐ/kWh)
```

**Ví dụ:**
- Công suất hiện tại: 2000W = 2kW
- Dự đoán 1 tháng (720 giờ):
  - Năng lượng: 2kW × 720h = 1440 kWh
  - Tiền điện: 1440 × 2500 = 3,600,000 VNĐ

---

## 🎯 Sử dụng trong Flutter App

### Ví dụ code Flutter:

```dart
// Dự đoán 24 giờ
Future<void> getDailyPrediction() async {
  final response = await http.get(
    Uri.parse('http://172.20.10.2:8080/api/power/predict/daily/36')
  );
  final data = jsonDecode(response.body);
  
  print('Dự đoán: ${data['message']}');
  print('Số điện: ${data['predictedEnergyKwh']} kWh');
  print('Tiền điện: ${data['predictedCostVndFormatted']} VND');
}

// Dự đoán theo giờ tùy chỉnh
Future<void> getCustomPrediction(int hours) async {
  final response = await http.get(
    Uri.parse('http://172.20.10.2:8080/api/power/predict/36?hours=$hours')
  );
  final data = jsonDecode(response.body);
  // Xử lý data...
}

// Lấy dữ liệu để vẽ biểu đồ
Future<void> getHistoryData(int hours) async {
  final response = await http.get(
    Uri.parse('http://172.20.10.2:8080/api/power/history/36?hours=$hours')
  );
  final data = jsonDecode(response.body);
  final history = data['data'] as List;
  // Vẽ biểu đồ với history data...
}
```

---

## 🚀 Mở rộng trong tương lai

API đã được thiết kế để dễ dàng mở rộng:

1. **Thống kê theo ngày/tuần/tháng**: Có thể thêm endpoints mới
2. **Dự đoán thông minh hơn**: Sử dụng machine learning với dữ liệu lịch sử
3. **So sánh tiêu thụ**: So sánh giữa các thời kỳ
4. **Cảnh báo**: Cảnh báo khi tiêu thụ vượt ngưỡng
5. **Biểu đồ nâng cao**: Heatmap, trend analysis, etc.

---

## 📝 Lưu ý

- DeviceId mặc định cho sensor: **36** (có thể thay đổi trong MqttConfig)
- Dữ liệu được lưu tự động khi nhận MQTT message từ topic `home/s3/status`
- Format JSON từ ESP32: `{"volt":235.6,"curr":0.423,"pwr":99.7,"humi":2.0,"relay":1}`
- Database table: `power_consumption_history` (tự động tạo bởi JPA)


