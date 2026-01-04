# 🚀 Hướng dẫn Triển khai lên Ubuntu Server

## 📋 Yêu cầu hệ thống

- **Ubuntu Server 20.04+** (hoặc 22.04 LTS)
- **Docker** và **Docker Compose** đã cài đặt
- **Port 1446** (hoặc port bạn chọn) đã mở trong firewall
- **MQTT Broker** có thể truy cập từ server (phuongnamdts.com:4783)

## ✅ Bước 1: Chuẩn bị Server

### 1.1. Cài đặt Docker và Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group (không cần sudo)
sudo usermod -aG docker $USER
newgrp docker

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra cài đặt
docker --version
docker-compose --version
```

### 1.2. Cấu hình Firewall

```bash
# Nếu dùng UFW
sudo ufw allow 1446/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
sudo ufw status

# Hoặc nếu dùng iptables/firewalld
# Mở port 1446 cho ứng dụng
```

## ✅ Bước 2: Upload Code lên Server

### 2.1. Clone hoặc Upload project

```bash
# Option 1: Clone từ Git (nếu có repo)
git clone <your-repo-url> lap306
cd lap306

# Option 2: Upload qua SCP từ máy local
# Trên máy local Windows:
# scp -r C:\iot-project\lap306 user@your-server-ip:/home/user/lap306
```

### 2.2. Tạo file `.env` cho production

```bash
cd /home/user/lap306  # hoặc thư mục bạn đặt project

# Copy file example
cp .env.example .env

# Chỉnh sửa file .env với thông tin thật
nano .env
```

**Nội dung file `.env`:**

```bash
# Database Configuration
POSTGRES_DB=IoT
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_THIS_TO_STRONG_PASSWORD
POSTGRES_PORT=5432

# MQTT Configuration
MQTT_BROKER_URL=tcp://phuongnamdts.com:4783
MQTT_USERNAME=baonammqtt
MQTT_PASSWORD=mqtt@d1git
MQTT_CLIENT_ID=spring-boot-client-prod

# Application Configuration
APP_PORT=1446
SPRING_JPA_DDL_AUTO=validate
```

**⚠️ QUAN TRỌNG:** 
- Đổi `POSTGRES_PASSWORD` thành password mạnh
- File `.env` KHÔNG được commit vào Git (đã có trong .gitignore)

## ✅ Bước 3: Build và Chạy Docker

### 3.1. Build Docker images

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Kiểm tra images đã build
docker images | grep lap306
```

### 3.2. Chạy containers

```bash
# Chạy ở background (detached mode)
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra containers đang chạy
docker-compose -f docker-compose.prod.yml ps

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3.3. Kiểm tra ứng dụng

```bash
# Kiểm tra health
curl http://localhost:1446

# Hoặc từ máy khác
curl http://YOUR_SERVER_IP:1446

# Kiểm tra WebSocket endpoint
curl http://localhost:1446/ws-sensor-sockjs/info
```

## ✅ Bước 4: Cấu hình Nginx (Optional - Khuyến nghị)

Nếu muốn dùng domain name và SSL, cấu hình Nginx reverse proxy:

### 4.1. Cài đặt Nginx

```bash
sudo apt install nginx -y
```

### 4.2. Tạo Nginx config

```bash
sudo nano /etc/nginx/sites-available/smartsocket
```

**Nội dung:**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Thay bằng domain của bạn

    # Redirect HTTP to HTTPS (nếu có SSL)
    # return 301 https://$server_name$request_uri;

    # Hoặc proxy trực tiếp (nếu chưa có SSL)
    location / {
        proxy_pass http://localhost:1446;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support
        proxy_read_timeout 86400;
    }

    # WebSocket endpoint
    location /ws-sensor-sockjs {
        proxy_pass http://localhost:1446;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

### 4.3. Enable site và restart

```bash
sudo ln -s /etc/nginx/sites-available/smartsocket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4.4. Cài SSL với Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## ✅ Bước 5: Quản lý Service

### 5.1. Các lệnh thường dùng

```bash
# Xem logs real-time
docker-compose -f docker-compose.prod.yml logs -f app

# Xem logs database
docker-compose -f docker-compose.prod.yml logs -f postgres

# Restart service
docker-compose -f docker-compose.prod.yml restart

# Stop service
docker-compose -f docker-compose.prod.yml stop

# Start service
docker-compose -f docker-compose.prod.yml start

# Stop và xóa containers (KHÔNG xóa data)
docker-compose -f docker-compose.prod.yml down

# Stop và xóa TẤT CẢ (bao gồm data - CẨN THẬN!)
docker-compose -f docker-compose.prod.yml down -v
```

### 5.2. Backup Database

```bash
# Tạo backup
docker exec lap306-postgres-prod pg_dump -U postgres IoT > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore từ backup
docker exec -i lap306-postgres-prod psql -U postgres IoT < backup.sql
```

### 5.3. Auto-restart khi server reboot

Docker Compose đã có `restart: always` trong config, nhưng cần đảm bảo Docker service tự start:

```bash
# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

## ✅ Bước 6: Kiểm tra và Test

### 6.1. Test API

```bash
# Test health check
curl http://localhost:1446/api/devices

# Test WebSocket (cần dùng browser hoặc WebSocket client)
# Mở browser console và test:
# const socket = new SockJS('http://YOUR_SERVER_IP:1446/ws-sensor-sockjs');
```

### 6.2. Test MQTT Connection

Kiểm tra logs để xem MQTT đã kết nối:

```bash
docker-compose -f docker-compose.prod.yml logs app | grep -i mqtt
```

### 6.3. Test từ ESP32

Đảm bảo ESP32 có thể gửi data lên MQTT broker và backend nhận được.

## 🔧 Troubleshooting

### Container không start

```bash
# Xem logs chi tiết
docker-compose -f docker-compose.prod.yml logs app

# Kiểm tra container status
docker-compose -f docker-compose.prod.yml ps

# Rebuild từ đầu
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database connection failed

```bash
# Kiểm tra PostgreSQL đang chạy
docker-compose -f docker-compose.prod.yml ps postgres

# Kiểm tra logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection từ app container
docker exec -it lap306-app-prod ping postgres
```

### WebSocket không hoạt động

- Kiểm tra port đã expose chưa
- Kiểm tra firewall
- Kiểm tra CORS config trong backend
- Xem logs: `docker-compose -f docker-compose.prod.yml logs app | grep -i websocket`

### MQTT connection failed

```bash
# Test network từ container
docker exec -it lap306-app-prod ping phuongnamdts.com

# Kiểm tra MQTT credentials trong .env
cat .env | grep MQTT

# Xem logs MQTT
docker-compose -f docker-compose.prod.yml logs app | grep -i mqtt
```

## 📊 Monitoring

### Xem resource usage

```bash
# Xem CPU, Memory của containers
docker stats

# Xem disk usage
docker system df
```

### Log rotation

Docker Compose đã cấu hình log rotation (max 10MB, 3 files) trong `docker-compose.prod.yml`.

## 🔒 Security Checklist

- [ ] Đã đổi password database mạnh trong `.env`
- [ ] File `.env` không commit vào Git
- [ ] Firewall đã cấu hình đúng
- [ ] Chỉ expose port cần thiết (1446)
- [ ] Database port (5432) không expose ra ngoài
- [ ] Đã cấu hình SSL/TLS (nếu dùng domain)
- [ ] Đã backup database
- [ ] Đã test restore từ backup

## 🎯 Kết luận

Sau khi hoàn thành các bước trên, ứng dụng sẽ chạy tại:
- **HTTP**: `http://YOUR_SERVER_IP:1446`
- **WebSocket**: `ws://YOUR_SERVER_IP:1446/ws-sensor-sockjs`
- **API**: `http://YOUR_SERVER_IP:1446/api/...`

Nếu có domain và SSL:
- **HTTPS**: `https://your-domain.com`
- **WSS**: `wss://your-domain.com/ws-sensor-sockjs`

---

**Lưu ý:** Đảm bảo ESP32 có thể kết nối đến MQTT broker `phuongnamdts.com:4783` từ network của bạn.

