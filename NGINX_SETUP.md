# Hướng dẫn Cấu hình Nginx cho SmartSocket Backend

## 📋 Thông tin

- **Domain:** http://smartsocket.nguyentrungnam.com
- **Backend Port:** 1446
- **Backend URL:** http://localhost:1446

## 🚀 Cài đặt Nginx

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install nginx
```

### CentOS/RHEL:
```bash
sudo yum install nginx
# hoặc
sudo dnf install nginx
```

## 📝 Cấu hình

### Bước 1: Copy file cấu hình

```bash
# Copy file nginx config vào thư mục sites-available
sudo cp nginx-smartsocket.conf /etc/nginx/sites-available/smartsocket.nguyentrungnam.com

# Tạo symbolic link đến sites-enabled
sudo ln -s /etc/nginx/sites-available/smartsocket.nguyentrungnam.com /etc/nginx/sites-enabled/
```

### Bước 2: Kiểm tra cấu hình

```bash
# Test cấu hình nginx
sudo nginx -t
```

Nếu thấy `syntax is ok` và `test is successful` → OK!

### Bước 3: Khởi động/Reload Nginx

```bash
# Nếu nginx chưa chạy
sudo systemctl start nginx

# Nếu nginx đã chạy, reload config
sudo systemctl reload nginx

# Enable nginx tự động start khi boot
sudo systemctl enable nginx
```

### Bước 4: Cấu hình DNS

Đảm bảo domain `smartsocket.nguyentrungnam.com` trỏ về IP server:

```
A Record: smartsocket.nguyentrungnam.com → [IP_SERVER]
```

Kiểm tra:
```bash
nslookup smartsocket.nguyentrungnam.com
# hoặc
dig smartsocket.nguyentrungnam.com
```

## 🔧 Cấu hình Firewall

### Ubuntu (UFW):
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # Nếu dùng HTTPS
sudo ufw reload
```

### CentOS (firewalld):
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## ✅ Kiểm tra

### 1. Kiểm tra Nginx đang chạy:
```bash
sudo systemctl status nginx
```

### 2. Kiểm tra backend đang chạy:
```bash
curl http://localhost:1446/health
# hoặc
curl http://localhost:1446/devices
```

### 3. Kiểm tra qua domain:
```bash
curl http://smartsocket.nguyentrungnam.com/devices
```

### 4. Kiểm tra WebSocket:
```javascript
// Test trong browser console
const ws = new WebSocket('ws://smartsocket.nguyentrungnam.com/ws-sensor');
ws.onopen = () => console.log('Connected!');
ws.onerror = (e) => console.error('Error:', e);
```

## 🔒 Cấu hình SSL/HTTPS (Tùy chọn)

### Sử dụng Let's Encrypt (Certbot):

```bash
# Cài đặt certbot
sudo apt install certbot python3-certbot-nginx

# Tạo SSL certificate
sudo certbot --nginx -d smartsocket.nguyentrungnam.com

# Auto-renewal
sudo certbot renew --dry-run
```

Sau khi có SSL, uncomment phần HTTPS trong file `nginx-smartsocket.conf`.

## 📊 Monitoring

### Xem logs:
```bash
# Access logs
sudo tail -f /var/log/nginx/smartsocket-access.log

# Error logs
sudo tail -f /var/log/nginx/smartsocket-error.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log
```

## 🐛 Troubleshooting

### 1. Nginx không start
```bash
# Kiểm tra lỗi
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx -n 50
```

### 2. 502 Bad Gateway
- Kiểm tra backend có đang chạy không: `curl http://localhost:1446`
- Kiểm tra port 1446 có đúng không
- Kiểm tra firewall

### 3. WebSocket không hoạt động
- Kiểm tra headers `Upgrade` và `Connection` trong nginx config
- Kiểm tra timeout settings
- Xem browser console để debug

### 4. CORS errors
- Đảm bảo backend đã cấu hình CORS đúng
- Kiểm tra `Access-Control-Allow-Origin` headers

## 📝 Cập nhật Flutter App

Sau khi cấu hình nginx, cập nhật URL trong Flutter:

```dart
// Thay đổi từ:
final String baseUrl = 'http://172.20.10.2:8080';
final String wsUrl = 'ws://172.20.10.2:8080/ws-sensor';

// Thành:
final String baseUrl = 'http://smartsocket.nguyentrungnam.com';
final String wsUrl = 'ws://smartsocket.nguyentrungnam.com/ws-sensor';
```

## 🔄 Restart Services

```bash
# Restart backend (nếu dùng systemd)
sudo systemctl restart lap306

# Restart nginx
sudo systemctl restart nginx

# Hoặc reload (không downtime)
sudo systemctl reload nginx
```

## 📋 Checklist

- [ ] Nginx đã được cài đặt
- [ ] File config đã được copy vào `/etc/nginx/sites-available/`
- [ ] Symbolic link đã được tạo trong `/etc/nginx/sites-enabled/`
- [ ] `nginx -t` không có lỗi
- [ ] Nginx đã được reload/restart
- [ ] DNS đã trỏ về server
- [ ] Firewall đã mở port 80 (và 443 nếu dùng HTTPS)
- [ ] Backend đang chạy ở port 1446
- [ ] Test API qua domain thành công
- [ ] Test WebSocket qua domain thành công
- [ ] Flutter app đã cập nhật URL

## 🎯 Kết quả

Sau khi hoàn tất, bạn có thể:

- ✅ Truy cập API: `http://smartsocket.nguyentrungnam.com/api/power/predict/daily/36`
- ✅ Kết nối WebSocket: `ws://smartsocket.nguyentrungnam.com/ws-sensor`
- ✅ Flutter app có thể kết nối từ bất kỳ đâu (không cần IP cục bộ)


