# ☁️ Hướng dẫn Cấu hình Cloudflare Tunnel

## 📋 Tổng quan

Cloudflare Tunnel (cloudflared) cho phép expose ứng dụng ra internet **KHÔNG CẦN MỞ PORT** trên firewall. Đây là giải pháp tốt nếu:
- ✅ Bạn không muốn mở port 80/443 trên firewall
- ✅ Bạn muốn SSL/TLS tự động từ Cloudflare
- ✅ Bạn muốn ẩn IP server thật
- ✅ Bạn đã có domain quản lý bởi Cloudflare

## ⚖️ So sánh: Cloudflare Tunnel vs Nginx

| Tính năng | Cloudflare Tunnel | Nginx + Let's Encrypt |
|-----------|-------------------|----------------------|
| Cần mở port firewall | ❌ Không | ✅ Cần (80, 443) |
| SSL/TLS | ✅ Tự động | ✅ Cần cấu hình Let's Encrypt |
| Ẩn IP server | ✅ Có | ❌ Không |
| Dễ setup | ⚠️ Phức tạp hơn | ✅ Đơn giản |
| Performance | ✅ Tốt (Cloudflare CDN) | ✅ Tốt (direct) |
| Chi phí | ✅ Miễn phí | ✅ Miễn phí |

## 🚀 Cài đặt Cloudflare Tunnel

### Bước 1: Cài đặt cloudflared trên Ubuntu Server

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Cài đặt
sudo dpkg -i cloudflared-linux-amd64.deb

# Kiểm tra
cloudflared --version
```

### Bước 2: Đăng nhập Cloudflare

```bash
# Đăng nhập vào Cloudflare account
cloudflared tunnel login

# Chọn domain bạn muốn dùng
# Browser sẽ mở để xác thực
```

### Bước 3: Tạo Tunnel

```bash
# Tạo tunnel mới
cloudflared tunnel create smartsocket

# Lưu ý: Ghi lại Tunnel ID được tạo (ví dụ: abc123-def456-ghi789)
```

### Bước 4: Cấu hình Tunnel

Tạo file config:

```bash
# Tạo thư mục config
sudo mkdir -p /etc/cloudflared

# Tạo file config
sudo nano /etc/cloudflared/config.yml
```

**Nội dung file `/etc/cloudflared/config.yml`:**

```yaml
tunnel: smartsocket  # Tên tunnel bạn vừa tạo
credentials-file: /home/your-user/.cloudflared/abc123-def456-ghi789.json

ingress:
  # Route WebSocket endpoint
  - hostname: smartsocket.nguyentrungnam.com
    service: http://localhost:1446
    originRequest:
      # WebSocket support
      httpHostHeader: smartsocket.nguyentrungnam.com
      # Timeout cho WebSocket
      connectTimeout: 30s
      tcpKeepAlive: 30s
      noHappyEyeballs: false
      # WebSocket specific
      keepAliveConnections: 100
      keepAliveTimeout: 90s

  # Catch-all rule (phải ở cuối)
  - service: http_status:404
```

**Lưu ý:** Thay `abc123-def456-ghi789.json` bằng Tunnel ID thật của bạn.

### Bước 5: Cấu hình DNS trong Cloudflare Dashboard

1. Vào **Cloudflare Dashboard** → Chọn domain → **DNS**
2. Thêm **CNAME record**:
   - **Name:** `smartsocket` (hoặc subdomain bạn muốn)
   - **Target:** `abc123-def456-ghi789.cfargotunnel.com` (Tunnel ID của bạn)
   - **Proxy status:** 🟠 Proxied (quan trọng!)
   - **TTL:** Auto

### Bước 6: Chạy Tunnel như Service

Tạo systemd service:

```bash
# Cài đặt cloudflared như service
sudo cloudflared service install

# Khởi động service
sudo systemctl start cloudflared

# Enable auto-start khi boot
sudo systemctl enable cloudflared

# Kiểm tra status
sudo systemctl status cloudflared

# Xem logs
sudo journalctl -u cloudflared -f
```

## 🔧 Cấu hình cho WebSocket

Cloudflare Tunnel hỗ trợ WebSocket tự động, nhưng cần cấu hình thêm:

**File `/etc/cloudflared/config.yml` (đã có ở trên):**

```yaml
ingress:
  - hostname: smartsocket.nguyentrungnam.com
    service: http://localhost:1446
    originRequest:
      # WebSocket configuration
      httpHostHeader: smartsocket.nguyentrungnam.com
      connectTimeout: 30s
      tcpKeepAlive: 30s
      keepAliveConnections: 100
      keepAliveTimeout: 90s
      # Disable compression for WebSocket
      disableChunkedEncoding: false
```

## ✅ Kiểm tra

### 1. Kiểm tra Tunnel đang chạy

```bash
sudo systemctl status cloudflared
```

### 2. Test API qua domain

```bash
# Test từ server
curl https://smartsocket.nguyentrungnam.com/api/devices

# Test từ máy khác
curl https://smartsocket.nguyentrungnam.com/api/devices
```

### 3. Test WebSocket

```javascript
// Test trong browser console
const ws = new WebSocket('wss://smartsocket.nguyentrungnam.com/ws-sensor-sockjs');
ws.onopen = () => console.log('WebSocket connected!');
ws.onerror = (e) => console.error('Error:', e);
```

## 🔄 Quản lý Tunnel

### Xem danh sách tunnels

```bash
cloudflared tunnel list
```

### Xóa tunnel

```bash
cloudflared tunnel delete smartsocket
```

### Xem logs

```bash
# Real-time logs
sudo journalctl -u cloudflared -f

# Logs với filter
sudo journalctl -u cloudflared | grep -i error
```

### Restart service

```bash
sudo systemctl restart cloudflared
```

## 🔒 Bảo mật

### 1. Access Policies (Optional)

Trong Cloudflare Dashboard → **Zero Trust** → **Access** → **Applications**:
- Tạo Access Policy để giới hạn ai có thể truy cập
- Có thể yêu cầu email xác thực, 2FA, etc.

### 2. Firewall Rules

Trong Cloudflare Dashboard → **Security** → **WAF**:
- Tạo rules để block suspicious requests
- Rate limiting
- Geo-blocking (nếu cần)

## 📝 Cập nhật Flutter App

Sau khi setup Cloudflare Tunnel, cập nhật URL trong Flutter:

```dart
// lib/config/api_config.dart
class ApiConfig {
  // Production với Cloudflare Tunnel
  static const String baseUrl = 'https://smartsocket.nguyentrungnam.com';
  
  // WebSocket URL (WSS cho HTTPS)
  static const String wsUrl = 'wss://smartsocket.nguyentrungnam.com/ws-sensor-sockjs';
}
```

## 🆘 Troubleshooting

### Tunnel không kết nối

```bash
# Kiểm tra credentials file
ls -la ~/.cloudflared/

# Test tunnel connection
cloudflared tunnel info smartsocket

# Xem logs chi tiết
sudo journalctl -u cloudflared -n 100
```

### WebSocket không hoạt động

- Kiểm tra `originRequest` config trong `config.yml`
- Đảm bảo backend WebSocket endpoint đúng
- Test với browser console để xem lỗi cụ thể

### DNS không resolve

- Kiểm tra CNAME record trong Cloudflare Dashboard
- Đảm bảo Proxy status là **Proxied** (🟠)
- Đợi vài phút để DNS propagate

### 502 Bad Gateway

- Kiểm tra backend có đang chạy: `curl http://localhost:1446`
- Kiểm tra port 1446 có đúng không
- Xem logs: `sudo journalctl -u cloudflared -f`

## 📋 Checklist

- [ ] Đã cài đặt cloudflared
- [ ] Đã đăng nhập Cloudflare account
- [ ] Đã tạo tunnel
- [ ] Đã tạo file config `/etc/cloudflared/config.yml`
- [ ] Đã cấu hình DNS CNAME trong Cloudflare Dashboard
- [ ] Đã cài đặt cloudflared như service
- [ ] Service đang chạy: `systemctl status cloudflared`
- [ ] Test API qua domain thành công
- [ ] Test WebSocket qua domain thành công
- [ ] Flutter app đã cập nhật URL

## 🎯 Kết quả

Sau khi hoàn tất:
- ✅ App accessible tại: `https://smartsocket.nguyentrungnam.com`
- ✅ WebSocket: `wss://smartsocket.nguyentrungnam.com/ws-sensor-sockjs`
- ✅ SSL/TLS tự động từ Cloudflare
- ✅ Không cần mở port trên firewall
- ✅ IP server được ẩn

## 💡 Lưu ý

1. **Cloudflare Tunnel miễn phí** nhưng có giới hạn:
   - Unlimited requests
   - Unlimited bandwidth (reasonable use)
   - Không có SLA

2. **Nếu cần performance cao hơn**, có thể dùng:
   - Cloudflare Tunnel + Nginx (Nginx làm reverse proxy local)
   - Hoặc chỉ dùng Nginx + Let's Encrypt (mở port)

3. **Backend vẫn chạy trên localhost:1446**, Cloudflare Tunnel chỉ forward traffic từ internet về localhost.

---

**Kết luận:** Cloudflare Tunnel là giải pháp tốt nếu bạn không muốn mở port và muốn SSL tự động. Nếu bạn đã có thể mở port, Nginx + Let's Encrypt cũng là lựa chọn tốt.

