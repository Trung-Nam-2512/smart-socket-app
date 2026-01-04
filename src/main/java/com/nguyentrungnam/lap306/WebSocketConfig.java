package com.nguyentrungnam.lap306;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Bật simple broker cho các topic bắt đầu bằng "/topic"
        // Flutter sẽ subscribe tại /topic/sensor để nhận message từ MQTT
        config.enableSimpleBroker("/topic");
        // Prefix cho các message từ client gửi lên server
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để Flutter kết nối: ws://your-ip:8080/ws-sensor
        // QUAN TRỌNG: Cho phép tất cả origins để Flutter có thể kết nối từ:
        // - Android Emulator (10.0.2.2)
        // - iOS Simulator (localhost)
        // - Điện thoại thật (IP address của máy chạy Spring Boot)
        // - Các thiết bị khác trong cùng mạng

        // CHỈ dùng setAllowedOriginPatterns("*") - KHÔNG dùng setAllowedOrigins("*")
        // vì setAllowedOrigins("*") conflict với allowCredentials
        registry.addEndpoint("/ws-sensor")
                .setAllowedOriginPatterns("*"); // Cho phép tất cả origin patterns

        // Endpoint với SockJS fallback (nếu Flutter client cần)
        registry.addEndpoint("/ws-sensor-sockjs")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}