package com.nguyentrungnam.lap306;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * MqttMessageHandler - Đã được thay thế bởi MqttToWebSocketService
 * Giữ lại class này để tương thích ngược, nhưng không sử dụng @ServiceActivator
 * để tránh xung đột với handler trong MqttConfig
 */
@Service
public class MqttMessageHandler {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Method này không còn được gọi tự động nữa
     * Logic đã được chuyển sang MqttConfig.handler() và MqttToWebSocketService
     */
    @Deprecated
    public void handleMessage(Message<?> message) {
        String payload = message.getPayload().toString();
        // Log để bạn debug xem backend đã nhận được data chưa
        System.out.println("MQTT Data received: " + payload);

        // Đẩy dữ liệu này xuống Flutter qua WebSocket
        messagingTemplate.convertAndSend("/topic/sensor", payload);
    }
}