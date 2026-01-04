# Docker Quick Start Guide

## 🚀 Chạy Docker (Frontend + Backend)

### Bước 1: Build và chạy

```bash
# Build và chạy tất cả services (PostgreSQL + Backend với Frontend)
docker-compose up --build

# Hoặc chạy ở background
docker-compose up -d --build
```

### Bước 2: Kiểm tra logs

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của app (backend + frontend)
docker-compose logs -f app

# Xem logs của database
docker-compose logs -f postgres
```

### Bước 3: Truy cập ứng dụng

- **Frontend + Backend**: http://localhost:1446
- **API**: http://localhost:1446/devices
- **WebSocket**: ws://localhost:1446/ws-sensor

### Bước 4: Dừng services

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (xóa database)
docker-compose down -v
```

## 🔍 Kiểm tra

### 1. Kiểm tra containers đang chạy

```bash
docker-compose ps
```

Kết quả mong đợi:
```
NAME                STATUS          PORTS
lap306-app          Up              0.0.0.0:1446->1446/tcp
lap306-postgres     Up (healthy)    0.0.0.0:5432->5432/tcp
```

### 2. Kiểm tra frontend được build đúng

```bash
# Vào trong container
docker exec -it lap306-app sh

# Kiểm tra static files
ls -la /app/BOOT-INF/classes/static/

# Thoát
exit
```

### 3. Test API

```bash
# Test API devices
curl http://localhost:1446/devices

# Test frontend
curl http://localhost:1446/
```

### 4. Kiểm tra logs khi khởi động

Bạn sẽ thấy:
```
MQTT Subscribed to topics: home/+/status, home/+/cmd
Started Lap306Application
```

## 🐛 Troubleshooting

### Lỗi: Port 1446 đã được sử dụng

```bash
# Tìm process đang dùng port 1446
netstat -ano | findstr :1446  # Windows
lsof -i :1446                 # Linux/Mac

# Hoặc đổi port trong docker-compose.yml
ports:
  - "1447:1446"  # Thay đổi port bên ngoài
```

### Lỗi: Port 5432 đã được sử dụng

```bash
# Đổi port PostgreSQL trong docker-compose.yml
ports:
  - "5433:5432"  # Thay đổi port bên ngoài
```

### Lỗi: Frontend không load

1. Kiểm tra frontend có được build không:
```bash
docker exec lap306-app ls -la /app/BOOT-INF/classes/static/
```

2. Kiểm tra logs:
```bash
docker-compose logs app | grep -i error
```

### Lỗi: Database connection failed

1. Kiểm tra PostgreSQL đã sẵn sàng:
```bash
docker-compose logs postgres
```

2. Đợi PostgreSQL khởi động xong (có thể mất 10-20 giây)

### Rebuild từ đầu

```bash
# Xóa tất cả và rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## 📝 Lưu ý

1. **Lần đầu build sẽ mất thời gian** (5-10 phút) vì phải:
   - Download Node.js dependencies
   - Build frontend
   - Download Maven dependencies
   - Build Spring Boot

2. **Lần sau sẽ nhanh hơn** nhờ Docker layer caching

3. **Database data được lưu trong volume** `postgres_data`, nên khi `docker-compose down` (không có `-v`), data vẫn còn

4. **Frontend được build với `VITE_API_BASE_URL=/`** (relative path) nên sẽ tự động gọi API qua cùng origin

## 🎯 Production Build

Để build cho production:

```bash
docker-compose -f docker-compose.prod.yml up --build
```


