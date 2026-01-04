# Hướng dẫn Triển khai Docker cho IoT Project

## 📋 Tổng quan

Dự án sử dụng:
- **PostgreSQL 15** - Database chính
- **Spring Boot 3.1.0** - Backend API
- **MQTT Broker** (external) - `phuongnamdts.com:4783`
- **WebSocket** - Real-time communication

## ✅ Xác nhận: Dự án đang dùng PostgreSQL

- ✅ Dependency: `org.postgresql:postgresql` trong `pom.xml`
- ✅ Configuration: `jdbc:postgresql://localhost:5432/IoT` trong `application.properties`

## 🐳 Triển khai bằng Docker - ĐÁNH GIÁ

### ✅ **ƯU ĐIỂM của Docker:**

1. **Dễ triển khai**: Một lệnh `docker-compose up` là xong
2. **Nhất quán môi trường**: Dev/Test/Prod giống nhau
3. **Isolation**: Database và App tách biệt, dễ quản lý
4. **Scalability**: Dễ scale horizontal khi cần
5. **Backup/Restore**: Dễ dàng với Docker volumes
6. **Rollback**: Dễ dàng rollback version cũ

### ⚠️ **LƯU Ý:**

1. **MQTT Broker External**: 
   - MQTT broker ở `phuongnamdts.com:4783` (external)
   - Container cần network access ra ngoài
   - ✅ Docker hỗ trợ tốt việc này

2. **WebSocket**:
   - Cần expose port 8080 ra ngoài
   - ✅ Docker port mapping hoạt động tốt

3. **Database Persistence**:
   - Dữ liệu cần được lưu trong volume
   - ✅ Docker volumes đảm bảo data persistence

## 🚀 HƯỚNG DẪN TRIỂN KHAI

### 1. Development/Testing

```bash
# Build và chạy
docker-compose up -d

# Xem logs
docker-compose logs -f app

# Dừng
docker-compose down

# Dừng và xóa data
docker-compose down -v
```

### 2. Production

#### Bước 1: Tạo file `.env` cho production

```bash
# .env
POSTGRES_DB=IoT
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<strong-password>
POSTGRES_PORT=5432

MQTT_BROKER_URL=tcp://phuongnamdts.com:4783
MQTT_USERNAME=baonammqtt
MQTT_PASSWORD=mqtt@d1git
MQTT_CLIENT_ID=spring-boot-client-prod

APP_PORT=8080
SPRING_JPA_DDL_AUTO=validate
```

#### Bước 2: Build và chạy production

```bash
# Build image
docker-compose -f docker-compose.prod.yml build

# Chạy production
docker-compose -f docker-compose.prod.yml up -d

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Bước 3: Backup Database

```bash
# Backup
docker exec lap306-postgres-prod pg_dump -U postgres IoT > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker exec -i lap306-postgres-prod psql -U postgres IoT < backup.sql
```

## 🔒 BẢO MẬT PRODUCTION

### 1. Environment Variables
- ✅ Dùng `.env` file (không commit vào git)
- ✅ Dùng secrets management (Docker Secrets, AWS Secrets Manager, etc.)

### 2. Network Security
- Chỉ expose port cần thiết (8080)
- Database port (5432) có thể chỉ dùng internal network
- Dùng reverse proxy (Nginx) với SSL/TLS

### 3. Database Security
- Đổi password mạnh
- Giới hạn connection từ app container only
- Enable SSL cho PostgreSQL connection

## 📊 MONITORING & LOGGING

### Health Checks
- ✅ Đã cấu hình healthcheck trong docker-compose
- Có thể thêm Spring Boot Actuator để monitoring

### Logs
```bash
# Xem logs real-time
docker-compose logs -f app

# Export logs
docker-compose logs app > app.log
```

## 🔄 ALTERNATIVE: Triển khai không dùng Docker

### Nếu KHÔNG dùng Docker, có thể:

1. **Triển khai trực tiếp trên server:**
   - Cài PostgreSQL trên server
   - Build JAR file: `mvn clean package`
   - Chạy: `java -jar target/lap306-0.0.1-SNAPSHOT.jar`
   - Dùng systemd để quản lý service

2. **Dùng Cloud Platform:**
   - **AWS**: Elastic Beanstalk, ECS, EKS
   - **Google Cloud**: Cloud Run, GKE
   - **Azure**: App Service, AKS
   - **DigitalOcean**: App Platform

3. **Dùng PaaS:**
   - Heroku
   - Railway
   - Render

## 💡 ĐỀ XUẤT

### ✅ **NÊN dùng Docker nếu:**
- Bạn muốn triển khai nhanh và dễ dàng
- Cần môi trường nhất quán (dev/test/prod)
- Muốn dễ dàng scale và backup
- Server có Docker và Docker Compose

### ⚠️ **Cân nhắc nếu:**
- Server không hỗ trợ Docker
- Cần tối ưu hiệu năng tối đa (native deployment có thể nhanh hơn 5-10%)
- Có yêu cầu đặc biệt về security/compliance

### 🎯 **KHUYẾN NGHỊ:**
**Dùng Docker** vì:
1. Dự án IoT này phù hợp với containerization
2. Dễ quản lý và maintain
3. Dễ scale khi có nhiều thiết bị IoT
4. Backup/restore đơn giản

## 📝 CHECKLIST TRIỂN KHAI

- [ ] Tạo file `.env` với credentials
- [ ] Build Docker image
- [ ] Test trên môi trường staging
- [ ] Cấu hình firewall (port 8080)
- [ ] Setup SSL/TLS (Nginx reverse proxy)
- [ ] Cấu hình backup tự động
- [ ] Setup monitoring/alerting
- [ ] Test WebSocket connection
- [ ] Test MQTT connection
- [ ] Load testing

## 🆘 TROUBLESHOOTING

### App không kết nối được database
```bash
# Kiểm tra PostgreSQL đang chạy
docker-compose ps postgres

# Kiểm tra logs
docker-compose logs postgres
```

### WebSocket không hoạt động
- Kiểm tra port 8080 đã expose chưa
- Kiểm tra firewall
- Kiểm tra CORS configuration

### MQTT connection failed
- Kiểm tra network connectivity từ container
- Kiểm tra MQTT broker credentials
- Test connection: `docker exec lap306-app ping phuongnamdts.com`



