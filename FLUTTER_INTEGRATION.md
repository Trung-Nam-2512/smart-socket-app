# 📱 Hướng dẫn Tích hợp Flutter App với Backend

## ✅ Xác nhận: Flutter App có thể gọi API bình thường

Backend đã được cấu hình CORS để cho phép **tất cả origins** kết nối, bao gồm:
- ✅ Flutter Android App
- ✅ Flutter iOS App  
- ✅ Flutter Web App
- ✅ Bất kỳ client nào khác

## 🔧 Cấu hình trong Flutter App

### 1. Base URL Configuration

Trong Flutter app, tạo file config hoặc constants:

```dart
// lib/config/api_config.dart
class ApiConfig {
  // Development (khi test trên máy local)
  // static const String baseUrl = 'http://localhost:1446';
  // static const String baseUrl = 'http://10.0.2.2:1446'; // Android Emulator
  
  // Production (khi deploy lên server)
  static const String baseUrl = 'http://YOUR_SERVER_IP:1446';
  // Hoặc nếu có domain:
  // static const String baseUrl = 'https://your-domain.com';
  
  // WebSocket URL
  static const String wsUrl = baseUrl.replaceFirst('http://', 'ws://')
                                      .replaceFirst('https://', 'wss://');
}
```

### 2. HTTP Client Setup

Sử dụng `http` package hoặc `dio`:

```dart
// pubspec.yaml
dependencies:
  http: ^1.1.0
  # hoặc
  dio: ^5.4.0
```

**Ví dụ với `http` package:**

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'config/api_config.dart';

class ApiService {
  static const String baseUrl = ApiConfig.baseUrl;
  
  // GET request
  Future<Map<String, dynamic>> getDevices() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/devices'),
      headers: {'Content-Type': 'application/json'},
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load devices');
    }
  }
  
  // POST request
  Future<String> controlDevice(int deviceId, String command) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/devices/$deviceId/control'),
      headers: {'Content-Type': 'text/plain'},
      body: command, // "0" hoặc "1" cho relay
    );
    
    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to control device');
    }
  }
  
  // GET power statistics
  Future<Map<String, dynamic>> getPowerStats(int deviceId, {int? hours}) async {
    final uri = Uri.parse('$baseUrl/api/power/stats/$deviceId');
    if (hours != null) {
      uri.replace(queryParameters: {'hours': hours.toString()});
    }
    
    final response = await http.get(uri);
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load power stats');
    }
  }
}
```

**Ví dụ với `dio` package (khuyến nghị):**

```dart
import 'package:dio/dio.dart';
import 'config/api_config.dart';

class ApiService {
  late Dio _dio;
  
  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    
    // Add interceptors for logging (optional)
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));
  }
  
  Future<List<dynamic>> getDevices() async {
    final response = await _dio.get('/api/devices');
    return response.data;
  }
  
  Future<String> controlDevice(int deviceId, String command) async {
    final response = await _dio.post(
      '/api/devices/$deviceId/control',
      data: command,
      options: Options(
        contentType: 'text/plain',
        responseType: ResponseType.plain,
      ),
    );
    return response.data;
  }
}
```

### 3. WebSocket Setup (Nếu cần Real-time Data)

Sử dụng `web_socket_channel` hoặc `stomp_dart_client`:

```dart
// pubspec.yaml
dependencies:
  web_socket_channel: ^2.4.0
  # hoặc cho STOMP
  stomp_dart_client: ^1.0.0
```

**Ví dụ với WebSocket đơn giản:**

```dart
import 'package:web_socket_channel/web_socket_channel.dart';
import 'config/api_config.dart';

class WebSocketService {
  WebSocketChannel? _channel;
  
  void connect(String topic) {
    final wsUrl = '${ApiConfig.wsUrl}/ws-sensor-sockjs/info';
    _channel = WebSocketChannel.connect(Uri.parse(wsUrl));
    
    _channel!.stream.listen(
      (message) {
        // Handle incoming message
        final data = json.decode(message);
        print('Received: $data');
        // Update UI với data mới
      },
      onError: (error) {
        print('WebSocket error: $error');
      },
      onDone: () {
        print('WebSocket closed');
      },
    );
  }
  
  void subscribe(String topic) {
    // Subscribe to topic: /topic/home/s3/status
    _channel?.sink.add(json.encode({
      'command': 'SUBSCRIBE',
      'destination': topic,
    }));
  }
  
  void disconnect() {
    _channel?.sink.close();
  }
}
```

**Ví dụ với STOMP (khuyến nghị cho Spring WebSocket):**

```dart
import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import 'package:stomp_dart_client/stomp_frame.dart';
import 'config/api_config.dart';

class StompService {
  StompClient? _stompClient;
  
  void connect() {
    _stompClient = StompClient(
      config: StompConfig(
        url: '${ApiConfig.wsUrl}/ws-sensor-sockjs',
        onConnect: onConnect,
        onWebSocketError: (dynamic error) {
          print('WebSocket error: $error');
        },
        onStompError: (StompFrame frame) {
          print('STOMP error: ${frame.body}');
        },
        onDisconnect: () {
          print('Disconnected');
        },
      ),
    );
    
    _stompClient!.activate();
  }
  
  void onConnect(StompFrame frame) {
    print('Connected to WebSocket');
    
    // Subscribe to topic
    _stompClient!.subscribe(
      destination: '/topic/home/s3/status',
      callback: (StompFrame frame) {
        final data = json.decode(frame.body!);
        print('Received: $data');
        // Update UI
      },
    );
  }
  
  void disconnect() {
    _stompClient?.deactivate();
  }
}
```

## 📋 API Endpoints cho Flutter

### Device Management

```dart
// GET /api/devices - Lấy tất cả devices
GET http://YOUR_SERVER_IP:1446/api/devices

// GET /api/devices/{id} - Lấy device theo ID
GET http://YOUR_SERVER_IP:1446/api/devices/111

// POST /api/devices/{id}/control - Điều khiển device
POST http://YOUR_SERVER_IP:1446/api/devices/111/control
Content-Type: text/plain
Body: "1"  // hoặc "0" cho relay
```

### Power Statistics

```dart
// GET /api/power/stats/{deviceId}?hours=24
GET http://YOUR_SERVER_IP:1446/api/power/stats/111?hours=168

// GET /api/power/predict/daily/{deviceId}
GET http://YOUR_SERVER_IP:1446/api/power/predict/daily/111

// GET /api/power/predict/monthly/{deviceId}
GET http://YOUR_SERVER_IP:1446/api/power/predict/monthly/111

// GET /api/power/devices-with-data
GET http://YOUR_SERVER_IP:1446/api/power/devices-with-data
```

### Real-time Data (WebSocket)

```dart
// WebSocket endpoint
ws://YOUR_SERVER_IP:1446/ws-sensor-sockjs

// Subscribe to topic
/topic/home/s3/status  // Thay s3 bằng device ID tương ứng
```

## 🔒 Lưu ý về Bảo mật

### Android

**AndroidManifest.xml** - Thêm internet permission:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**Android 9+ (API 28+)** - Cho phép HTTP (nếu không dùng HTTPS):

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

```xml
<!-- AndroidManifest.xml -->
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### iOS

**Info.plist** - Cho phép HTTP (nếu không dùng HTTPS):

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## 🧪 Testing

### Test trên Android Emulator

```dart
// Android Emulator dùng 10.0.2.2 để trỏ về localhost của máy host
static const String baseUrl = 'http://10.0.2.2:1446';
```

### Test trên iOS Simulator

```dart
// iOS Simulator dùng localhost trực tiếp
static const String baseUrl = 'http://localhost:1446';
```

### Test trên Device thật

```dart
// Dùng IP address của máy chạy backend
static const String baseUrl = 'http://192.168.1.100:1446';
// Hoặc IP của server
static const String baseUrl = 'http://YOUR_SERVER_IP:1446';
```

## 📝 Ví dụ hoàn chỉnh

```dart
// lib/services/api_service.dart
import 'package:dio/dio.dart';
import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import '../config/api_config.dart';

class ApiService {
  late Dio _dio;
  StompClient? _stompClient;
  
  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 30),
    ));
  }
  
  // Get all devices
  Future<List<dynamic>> getDevices() async {
    final response = await _dio.get('/api/devices');
    return response.data;
  }
  
  // Control device (relay on/off)
  Future<void> controlDevice(int deviceId, bool turnOn) async {
    await _dio.post(
      '/api/devices/$deviceId/control',
      data: turnOn ? '1' : '0',
      options: Options(contentType: 'text/plain'),
    );
  }
  
  // Get power statistics
  Future<Map<String, dynamic>> getPowerStats(int deviceId, {int hours = 24}) async {
    final response = await _dio.get(
      '/api/power/stats/$deviceId',
      queryParameters: {'hours': hours},
    );
    return response.data;
  }
  
  // Connect WebSocket
  void connectWebSocket(Function(Map<String, dynamic>) onMessage) {
    _stompClient = StompClient(
      config: StompConfig(
        url: '${ApiConfig.wsUrl}/ws-sensor-sockjs',
        onConnect: (frame) {
          _stompClient!.subscribe(
            destination: '/topic/home/s3/status',
            callback: (frame) {
              final data = json.decode(frame.body!);
              onMessage(data);
            },
          );
        },
      ),
    );
    _stompClient!.activate();
  }
  
  void disconnectWebSocket() {
    _stompClient?.deactivate();
  }
}
```

## ✅ Checklist

- [ ] Đã cấu hình base URL trong Flutter app
- [ ] Đã thêm internet permission (Android)
- [ ] Đã cấu hình network security (Android 9+)
- [ ] Đã test API calls từ Flutter app
- [ ] Đã test WebSocket connection (nếu cần)
- [ ] Đã test trên cả Android và iOS
- [ ] Đã test trên device thật

## 🆘 Troubleshooting

### CORS Error (nếu Flutter Web)

Backend đã cấu hình CORS cho phép tất cả origins, nhưng nếu vẫn gặp lỗi:
- Kiểm tra backend đang chạy
- Kiểm tra URL đúng
- Kiểm tra firewall/network

### Connection Refused

- Kiểm tra backend đang chạy: `curl http://YOUR_SERVER_IP:1446/api/devices`
- Kiểm tra firewall đã mở port 1446
- Kiểm tra network connectivity từ Flutter device

### WebSocket Connection Failed

- Kiểm tra WebSocket endpoint: `ws://YOUR_SERVER_IP:1446/ws-sensor-sockjs`
- Kiểm tra STOMP client configuration
- Xem logs backend để debug

---

**Kết luận:** Flutter app hoàn toàn có thể gọi API từ backend trên máy chủ bình thường. Chỉ cần cấu hình đúng base URL và sử dụng HTTP client/WebSocket client phù hợp.

