package com.nguyentrungnam.lap306;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.integration.mqtt.support.MqttHeaders; // <--- NHỚ IMPORT CÁI NÀY
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime; // <--- IMPORT CÁI NÀY ĐỂ LƯU THỜI GIAN
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class MqttConfig {
    // Track các topic đã log cảnh báo để tránh spam log
    private final Set<String> warnedTopics = ConcurrentHashMap.newKeySet();
    // ... (Các phần khai báo biến @Value giữ nguyên như cũ) ...
    @Value("${mqtt.broker.url}")
    private String brokerUrl;
    @Value("${mqtt.client.id}")
    private String clientId;
    @Value("${mqtt.username:}")
    private String username;
    @Value("${mqtt.password:}")
    private String password;

    @Autowired
    private TelemetryRepository telemetryRepository;

    @Autowired
    private MqttToWebSocketService mqttToWebSocketService;

    @Autowired
    private PowerConsumptionService powerConsumptionService;

    @Autowired
    private PublishedMessageTracker publishedMessageTracker;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        // ... (Giữ nguyên đoạn này) ...
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] { brokerUrl });
        if (username != null && !username.isEmpty())
            options.setUserName(username);
        if (password != null && !password.isEmpty())
            options.setPassword(password.toCharArray());
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MqttPahoMessageDrivenChannelAdapter inbound() {
        // Chỉ lắng nghe các topic pattern cụ thể (filter để tránh nhận message từ ESP32
        // khác)
        // Pattern sử dụng:
        // - home/+/status: Nhận tất cả status từ home/* (ví dụ: home/s3/status,
        // home/s4/status)
        // - home/+/cmd: Nhận tất cả command từ home/* (ví dụ: home/s3/cmd, home/s4/cmd)
        // - + là wildcard cho 1 level (ví dụ: home/s3/status, home/s4/status)
        // - # là wildcard cho nhiều level (ví dụ: home/s3/device/status)
        String[] topics = {
                "home/+/status", // Tất cả status từ home/*
                "home/+/cmd" // Tất cả command từ home/*
        };

        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter(
                clientId + "_in",
                mqttClientFactory(),
                topics // Chỉ subscribe các topic pattern này
        );
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());

        System.out.println("MQTT Subscribed to topics: " + String.join(", ", topics));
        return adapter;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return message -> {
            try {
                // Lấy topic và nội dung tin nhắn
                String topic = message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC, String.class);
                String payload = message.getPayload().toString();

                // Kiểm tra message có phải từ chính backend không (tránh loop)
                // Nếu message này đã được publish bởi backend, bỏ qua
                if (publishedMessageTracker.isFromBackend(topic, payload)) {
                    // Message này được publish bởi chính backend, bỏ qua để tránh loop
                    System.out.println("Bo qua message tu chinh backend (tranh loop) - Topic: " + topic);
                    return;
                }

                System.out.println("Nhan tin nhan tu ESP32: Topic=" + topic + ", Payload=" + payload);

                // --- CHỈ XỬ LÝ KHI CÓ DEVICE ID TRONG PAYLOAD ---
                // Thử lấy deviceId từ payload (bắt buộc)
                Long deviceId = extractDeviceIdFromPayload(payload);

                if (deviceId == null) {
                    // KHÔNG có deviceId trong payload -> BỎ QUA message hoàn toàn
                    // Không lưu DB, không push WebSocket, không xử lý gì cả
                    // Chỉ log cảnh báo 1 lần cho mỗi topic để tránh spam log
                    if (!warnedTopics.contains(topic)) {
                        System.out.println("⚠️  BO QUA message - Khong co deviceId trong payload - Topic: " + topic);
                        System.out.println(
                                "    KHUYEN NGHI: ESP32 nen gui kem field 'ID', 'deviceId' hoac 'DEVICE_ID' trong payload");
                        System.out.println("    (Se khong log lai cho topic nay nua de tranh spam)");
                        warnedTopics.add(topic);
                    }
                    return; // Bỏ qua message này hoàn toàn
                }

                // Có deviceId -> Xử lý bình thường
                System.out.println("✓ Su dung deviceId tu payload: " + deviceId + " (Topic: " + topic + ")");

                // ĐẨY SANG WEBSOCKET (chỉ khi có deviceId hợp lệ)
                mqttToWebSocketService.pushToWebSocket(topic, payload);

                // Lưu vào Telemetry
                saveTelemetry(deviceId, payload);

                // Nếu là topic status (có dữ liệu công suất), lưu vào PowerConsumptionHistory
                if (topic.contains("/status") || topic.contains("status")) {
                    powerConsumptionService.savePowerData(deviceId, payload);
                }

            } catch (Exception e) {
                System.err.println("Loi khi xu ly MQTT message: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    /**
     * Extract deviceId từ payload nếu ESP32 gửi kèm
     * Hỗ trợ nhiều format:
     * - "deviceId" (camelCase)
     * - "DEVICE_ID" (UPPER_CASE với underscore)
     * - "ID" (chữ hoa đơn giản - format từ ESP32)
     * Format: {"deviceId": 36, ...} hoặc {"DEVICE_ID": 111, ...} hoặc {"ID": 111,
     * ...}
     */
    private Long extractDeviceIdFromPayload(String payload) {
        try {
            // Fix JSON nếu bị cắt cụt
            String fixedPayload = fixIncompleteJson(payload);

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode jsonNode = mapper.readTree(fixedPayload);

            // Thử "deviceId" trước (camelCase)
            com.fasterxml.jackson.databind.JsonNode deviceIdNode = jsonNode.get("deviceId");
            if (deviceIdNode == null || deviceIdNode.isNull()) {
                // Thử "DEVICE_ID" (UPPER_CASE với underscore)
                deviceIdNode = jsonNode.get("DEVICE_ID");
            }
            if (deviceIdNode == null || deviceIdNode.isNull()) {
                // Thử "ID" (chữ hoa đơn giản - format từ ESP32)
                deviceIdNode = jsonNode.get("ID");
            }

            if (deviceIdNode != null && !deviceIdNode.isNull()) {
                if (deviceIdNode.isNumber()) {
                    return deviceIdNode.asLong();
                } else if (deviceIdNode.isTextual()) {
                    try {
                        return Long.parseLong(deviceIdNode.asText());
                    } catch (NumberFormatException e) {
                        return null;
                    }
                }
            }
        } catch (Exception e) {
            // Không có deviceId trong payload hoặc JSON không hợp lệ, dùng fallback
        }
        return null;
    }

    /**
     * Fix JSON nếu bị cắt cụt (thiếu dấu đóng ngoặc)
     * Xử lý trường hợp:
     * {"volt":2.1,"curr":0.000,"pwr":0.0,"humi":78.0,"relay":0,"DEVICE_ID":111
     * -> {"volt":2.1,"curr":0.000,"pwr":0.0,"humi":78.0,"relay":0}
     */
    private String fixIncompleteJson(String payload) {
        if (payload == null || payload.trim().isEmpty()) {
            return "{}";
        }

        String trimmed = payload.trim();

        // Nếu bắt đầu bằng { nhưng không kết thúc bằng }
        if (trimmed.startsWith("{") && !trimmed.endsWith("}")) {
            // Tìm vị trí dấu phẩy cuối cùng trước khi bị cắt
            int lastComma = trimmed.lastIndexOf(',');
            if (lastComma > 0) {
                // Cắt bỏ phần sau dấu phẩy cuối (field bị cắt cụt) và thêm }
                String fixed = trimmed.substring(0, lastComma) + "}";
                System.out.println(
                        "Fixed incomplete JSON in MqttConfig: " + trimmed.substring(0, Math.min(50, trimmed.length()))
                                + "... -> " + fixed.substring(0, Math.min(50, fixed.length())) + "...");
                return fixed;
            } else {
                // Nếu không có dấu phẩy, chỉ thêm }
                String fixed = trimmed + "}";
                System.out.println("Fixed incomplete JSON (no comma) in MqttConfig: "
                        + trimmed.substring(0, Math.min(50, trimmed.length())) + "... -> " + fixed);
                return fixed;
            }
        }

        return trimmed;
    }

    // Hàm phụ để code gọn hơn
    private void saveTelemetry(Long deviceId, String payload) {
        Telemetry t = new Telemetry();
        t.setDeviceId(deviceId);

        // Lưu ý: Kiểm tra file Telemetry.java xem biến là 'payload' hay 'value' để dùng
        // set cho đúng
        t.setPayload(payload);

        // --- SỬA LỖI TẠI ĐÂY ---
        // Xóa .toString() đi, truyền trực tiếp LocalDateTime vào
        t.setTimestamp(LocalDateTime.now());
        // -----------------------

        telemetryRepository.save(t);
        System.out.println("Da luu lich su cho Device ID: " + deviceId);
    }

    // MQTT Outbound - Publish messages to MQTT broker
    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound() {
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler(clientId + "_out", mqttClientFactory());
        messageHandler.setAsync(true);
        // Default topic (sẽ bị override bởi header "mqtt_topic" nếu có)
        messageHandler.setDefaultTopic("/test/topic");
        // QUAN TRỌNG: Set default qos để đảm bảo message được gửi
        messageHandler.setDefaultQos(1);
        return messageHandler;
    }

    @Bean
    public MessageChannel mqttOutboundChannel() {
        return new DirectChannel();
    }
}