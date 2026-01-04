# Docker Frontend Integration Guide

## Tổng quan

Frontend và backend được deploy trong cùng một Docker container. Frontend được build và tích hợp vào Spring Boot như static resources, sử dụng relative paths cho API calls.

## Cấu trúc Build

### Multi-stage Docker Build

1. **Stage 1: Frontend Build**
   - Sử dụng `node:20-alpine`
   - Build frontend với `VITE_API_BASE_URL=/` (relative path)
   - Output: `frontend/dist/`

2. **Stage 2: Backend Build**
   - Sử dụng `maven:3.9-eclipse-temurin-17`
   - Copy frontend build output vào `src/main/resources/static/`
   - Build Spring Boot JAR

3. **Stage 3: Runtime**
   - Sử dụng `eclipse-temurin:17-jre-alpine`
   - Chạy Spring Boot JAR
   - Serve cả API và frontend từ cùng một port (1446)

## Cấu hình API Service

### Development (Local)

Tạo file `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:1446
```

### Production (Docker)

Tạo file `frontend/.env.production` hoặc set trong Dockerfile:
```env
VITE_API_BASE_URL=/
```

**Lưu ý:** Khi `VITE_API_BASE_URL=/` hoặc empty, API service sẽ sử dụng relative paths, gọi API qua cùng origin với frontend.

## Spring Boot Configuration

File `WebMvcConfig.java` đã được cấu hình để:

1. **Serve Static Files**: Serve files từ `classpath:/static/` (frontend build output)
2. **SPA Routing**: Redirect tất cả non-API routes về `index.html` để React Router hoạt động
3. **API Protection**: Các routes bắt đầu với `/api/`, `/devices`, `/ws-sensor` không bị redirect

### API Routes được bảo vệ:
- `/api/*` - Tất cả API endpoints
- `/devices` - Device management API
- `/ws-sensor` - WebSocket endpoint
- `/ws-sensor-sockjs` - WebSocket SockJS endpoint

## Build và Deploy

### Development Build

```bash
# Build frontend (development)
cd frontend
npm install
npm run dev

# Backend chạy riêng
mvn spring-boot:run
```

### Docker Build

```bash
# Build Docker image (tự động build cả frontend và backend)
docker build -t lap306-app .

# Hoặc dùng docker-compose
docker-compose build
docker-compose up
```

### Production Deploy

```bash
# Sử dụng docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d

# Hoặc build và run trực tiếp
docker build -t lap306-app .
docker run -p 1446:1446 lap306-app
```

## Kiểm tra Deployment

### 1. Frontend được serve đúng
```bash
curl http://localhost:1446/
# Should return index.html
```

### 2. API hoạt động
```bash
curl http://localhost:1446/devices
# Should return JSON array of devices
```

### 3. SPA Routing hoạt động
- Truy cập `http://localhost:1446/app/devices`
- React Router sẽ handle routing client-side
- Không bị 404

### 4. WebSocket hoạt động
```bash
# WebSocket endpoint
ws://localhost:1446/ws-sensor
```

## Troubleshooting

### Frontend không load

1. Kiểm tra frontend build output có trong JAR:
```bash
jar -tf target/*.jar | grep index.html
```

2. Kiểm tra static resources path:
```bash
# Trong container
ls -la /app/BOOT-INF/classes/static/
```

### API calls fail

1. Kiểm tra `VITE_API_BASE_URL` trong build:
```bash
# Trong frontend build output
grep -r "VITE_API_BASE_URL" dist/
```

2. Kiểm tra browser console để xem API calls

### SPA routing không hoạt động

1. Kiểm tra `WebMvcConfig.java` có được load:
```bash
# Check Spring Boot logs
docker logs lap306-app | grep WebMvcConfig
```

2. Kiểm tra API routes không bị redirect:
```bash
curl http://localhost:1446/devices
# Should return JSON, not HTML
```

## Environment Variables

### Frontend Build Time

- `VITE_API_BASE_URL`: API base URL (set trong Dockerfile)

### Runtime (Spring Boot)

- `SERVER_PORT`: Port để serve (default: 1446)
- `SPRING_DATASOURCE_URL`: Database connection string
- `MQTT_BROKER_URL`: MQTT broker URL

## File Structure trong Container

```
/app/
├── app.jar (Spring Boot JAR)
└── BOOT-INF/
    └── classes/
        └── static/          # Frontend build output
            ├── index.html
            ├── assets/
            └── ...
```

## Lưu ý

1. **Build Context**: Docker build context phải include cả `frontend/` và `src/`
2. **Node Modules**: `frontend/node_modules/` được exclude trong `.dockerignore` để tối ưu build
3. **Environment Variables**: Frontend env vars chỉ có hiệu lực tại build time, không phải runtime
4. **Caching**: Docker layer caching được tối ưu để build nhanh hơn khi chỉ thay đổi code


