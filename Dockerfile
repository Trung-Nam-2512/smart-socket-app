# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend (production mode, relative API paths)
ENV VITE_API_BASE_URL=/
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml và download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Copy frontend build output to Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

# Build Spring Boot application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Cài wget cho healthcheck
RUN apk add --no-cache wget

# Tạo user non-root để chạy ứng dụng (bảo mật)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR từ build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 1446

# Health check (sử dụng curl thay vì wget)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1446/ || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]

