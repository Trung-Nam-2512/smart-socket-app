package com.nguyentrungnam.lap306;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Service để đẩy message từ MQTT sang WebSocket ngay lập tức
 */
@Service
public class MqttToWebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Đẩy message từ MQTT sang WebSocket với topic và payload
     * 
     * @param topic   MQTT topic nhận được
     * @param payload Nội dung message
     */
    public void pushToWebSocket(String topic, String payload) {
        try {
            // Tạo object chứa cả topic và payload để gửi đi
            Map<String, Object> message = new HashMap<>();
            message.put("topic", topic);
            message.put("payload", payload);
            message.put("timestamp", System.currentTimeMillis());

            // Đẩy message đến WebSocket topic /topic/sensor
            // Flutter sẽ lắng nghe tại /topic/sensor
            messagingTemplate.convertAndSend("/topic/sensor", message);

            System.out.println("Đã đẩy MQTT message sang WebSocket - Topic: " + topic + ", Payload: " + payload);
        } catch (Exception e) {
            System.err.println("Lỗi khi đẩy message sang WebSocket: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Đẩy message với format JSON string trực tiếp (nếu payload đã là JSON)
     * 
     * @param topic   MQTT topic
     * @param payload JSON payload
     */
    public void pushRawPayload(String topic, String payload) {
        try {
            // Đẩy payload trực tiếp (nếu đã là JSON string)
            messagingTemplate.convertAndSend("/topic/sensor", payload);
            System.out.println("Đã đẩy raw payload sang WebSocket - Topic: " + topic);
        } catch (Exception e) {
            System.err.println("Lỗi khi đẩy raw payload sang WebSocket: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
