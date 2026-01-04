# Hướng dẫn Đồng bộ ESP32 với Backend

## 🎯 Vấn đề

Khi Frontend tạo device mới qua API, ESP32 không biết `deviceId` đó. Có 2 cách giải quyết:

## ✅ Giải pháp 1: ESP32 gửi kèm deviceId trong payload (KHUYẾN NGHỊ)

### Cách hoạt động:
ESP32 gửi kèm `deviceId` trong JSON payload, Backend sẽ ưu tiên dùng deviceId này.

### Format payload:
```json
{
  "deviceId": 36,
  "volt": 235.6,
  "curr": 0.423,
  "pwr": 99.7,
  "humi": 2.0,
  "relay": 1
}
```

### Code ESP32 (Arduino/ESP-IDF):

#### Cách 1: ESP32 lưu deviceId trong EEPROM/Preferences
```cpp
#include <Preferences.h>

Preferences preferences;
long deviceId = 0;

void setup() {
  preferences.begin("device", false);
  deviceId = preferences.getLong("deviceId", 0);
  
  // Nếu chưa có deviceId, query từ server
  if (deviceId == 0) {
    deviceId = queryDeviceIdFromServer();
    preferences.putLong("deviceId", deviceId);
  }
}

long queryDeviceIdFromServer() {
  // HTTP GET: http://your-server:8080/devices/by-topic?topic=home/s3/status
  HTTPClient http;
  http.begin("http://your-server:8080/devices/by-topic?topic=home/s3/status");
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String response = http.getString();
    // Parse JSON: {"found":true,"deviceId":36,"name":"...","topic":"..."}
    // Extract deviceId từ response
    // ...
  }
  http.end();
  return deviceId;
}

void sendMQTTData() {
  String payload = "{";
  payload += "\"deviceId\":" + String(deviceId) + ",";
  payload += "\"volt\":" + String(voltage) + ",";
  payload += "\"curr\":" + String(current) + ",";
  payload += "\"pwr\":" + String(power) + ",";
  payload += "\"humi\":" + String(humidity) + ",";
  payload += "\"relay\":" + String(relay);
  payload += "}";
  
  mqttClient.publish("home/s3/status", payload.c_str());
}
```

#### Cách 2: ESP32 nhận deviceId từ Frontend qua MQTT
```cpp
void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  // Frontend gửi: {"action":"register","deviceId":36}
  String message = String((char*)payload);
  
  if (message.indexOf("\"action\":\"register\"") > 0) {
    // Parse deviceId từ JSON
    int deviceId = extractDeviceId(message);
    preferences.putLong("deviceId", deviceId);
  }
}
```

---

## ✅ Giải pháp 2: ESP32 query deviceId từ API (FALLBACK)

### API Endpoint:
```bash
GET /devices/by-topic?topic=home/s3/status
```

### Response:
```json
{
  "found": true,
  "deviceId": 36,
  "name": "Power Sensor",
  "topic": "home/s3/status"
}
```

### Code ESP32:
```cpp
void setup() {
  // Query deviceId khi khởi động
  long deviceId = queryDeviceId("home/s3/status");
  preferences.putLong("deviceId", deviceId);
}

long queryDeviceId(String topic) {
  HTTPClient http;
  String url = "http://your-server:8080/devices/by-topic?topic=" + topic;
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String response = http.getString();
    // Parse JSON và extract deviceId
    // ...
  }
  http.end();
  return deviceId;
}
```

---

## 🔄 Flow hoạt động

### Scenario 1: Frontend tạo device trước, ESP32 gửi kèm deviceId

```
1. Frontend tạo device:
   POST /devices
   {
     "name": "Phòng khách Sensor",
     "topic": "home/s3/status"
   }
   → Response: {"id": 36, ...}

2. Frontend gửi deviceId cho ESP32:
   - Qua MQTT: {"action":"register","deviceId":36}
   - Hoặc ESP32 tự query: GET /devices/by-topic?topic=home/s3/status

3. ESP32 lưu deviceId vào EEPROM/Preferences

4. ESP32 gửi MQTT với deviceId:
   {
     "deviceId": 36,
     "volt": 235.6,
     "pwr": 99.7,
     ...
   }

5. Backend nhận và dùng deviceId = 36 (từ payload)
```

### Scenario 2: ESP32 gửi trước, Backend tự tạo device

```
1. ESP32 gửi MQTT (không có deviceId):
   {
     "volt": 235.6,
     "pwr": 99.7,
     ...
   }

2. Backend tự động:
   - Tìm device theo topic "home/s3/status"
   - Nếu không có → Tạo device mới
   - Dùng deviceId để lưu dữ liệu

3. ESP32 có thể query deviceId sau:
   GET /devices/by-topic?topic=home/s3/status
   → Nhận deviceId và lưu lại
```

---

## 📋 So sánh 2 cách

| Tiêu chí | Cách 1: Gửi kèm deviceId | Cách 2: Dùng topic mapping |
|---------|-------------------------|---------------------------|
| **Độ chính xác** | ✅ Cao (ESP32 biết chính xác deviceId) | ⚠️ Trung bình (dựa vào topic) |
| **Đồng bộ** | ✅ Tốt (ESP32 và Backend đồng bộ) | ⚠️ Có thể lệch nếu topic thay đổi |
| **Phức tạp** | ⚠️ Cần lưu deviceId trong ESP32 | ✅ Đơn giản (không cần lưu) |
| **Khuyến nghị** | ✅ **Nên dùng** | ✅ Fallback |

---

## 🎯 KHUYẾN NGHỊ

### **Nên dùng Cách 1 (gửi kèm deviceId)** vì:

1. **Đồng bộ tốt hơn**: ESP32 và Backend luôn dùng cùng deviceId
2. **Linh hoạt**: Có thể thay đổi topic mà không ảnh hưởng
3. **Chính xác**: Tránh nhầm lẫn khi có nhiều device cùng topic pattern

### **Workflow đề xuất:**

```
1. Frontend tạo device → Nhận deviceId
2. Frontend gửi deviceId cho ESP32 (qua MQTT hoặc HTTP)
3. ESP32 lưu deviceId vào EEPROM/Preferences
4. ESP32 gửi MQTT với deviceId trong payload
5. Backend ưu tiên dùng deviceId từ payload
```

---

## 💻 Code mẫu ESP32 hoàn chỉnh

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>

Preferences preferences;
WiFiClient espClient;
PubSubClient mqttClient(espClient);

const char* mqttServer = "phuongnamdts.com";
const int mqttPort = 4783;
const char* mqttTopic = "home/s3/status";
const char* backendUrl = "http://your-server:8080";

long deviceId = 0;

void setup() {
  Serial.begin(115200);
  preferences.begin("device", false);
  
  // Lấy deviceId từ EEPROM
  deviceId = preferences.getLong("deviceId", 0);
  
  // Nếu chưa có, query từ server
  if (deviceId == 0) {
    deviceId = queryDeviceIdFromBackend();
    if (deviceId > 0) {
      preferences.putLong("deviceId", deviceId);
      Serial.println("DeviceId saved: " + String(deviceId));
    }
  } else {
    Serial.println("Using cached DeviceId: " + String(deviceId));
  }
  
  // Connect WiFi và MQTT
  connectWiFi();
  connectMQTT();
}

long queryDeviceIdFromBackend() {
  HTTPClient http;
  String url = String(backendUrl) + "/devices/by-topic?topic=" + String(mqttTopic);
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String response = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, response);
    
    if (doc["found"] == true) {
      long id = doc["deviceId"];
      http.end();
      return id;
    }
  }
  
  http.end();
  return 0;
}

void sendSensorData() {
  float voltage = readVoltage();
  float current = readCurrent();
  float power = voltage * current;
  float humidity = readHumidity();
  int relay = readRelay();
  
  // Tạo JSON với deviceId
  DynamicJsonDocument doc(512);
  doc["deviceId"] = deviceId;
  doc["volt"] = voltage;
  doc["curr"] = current;
  doc["pwr"] = power;
  doc["humi"] = humidity;
  doc["relay"] = relay;
  
  String payload;
  serializeJson(doc, payload);
  
  mqttClient.publish(mqttTopic, payload.c_str());
  Serial.println("Sent: " + payload);
}

void loop() {
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();
  
  // Gửi dữ liệu mỗi 2 giây
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 2000) {
    sendSensorData();
    lastSend = millis();
  }
}
```

---

## 🔧 Backend đã hỗ trợ

✅ **Hỗ trợ cả 2 cách:**
- Nếu payload có `deviceId` → Dùng deviceId đó (ưu tiên)
- Nếu không có → Dùng topic mapping (fallback)

✅ **API hỗ trợ:**
- `GET /devices/by-topic?topic=...` - ESP32 có thể query deviceId

✅ **Tự động tạo device:**
- Nếu device chưa có, tự động tạo khi nhận MQTT message

---

## 📝 Lưu ý

1. **DeviceId trong payload là optional**: Nếu không có, Backend vẫn hoạt động bình thường
2. **Topic vẫn quan trọng**: Dùng để routing và fallback
3. **Cache**: Backend cache mapping topic → deviceId để tối ưu
4. **Đồng bộ**: Nên dùng deviceId trong payload để đảm bảo đồng bộ


