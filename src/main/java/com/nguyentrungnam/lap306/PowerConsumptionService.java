package com.nguyentrungnam.lap306;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service xử lý lưu trữ dữ liệu công suất từ MQTT
 */
@Service
public class PowerConsumptionService {

    @Autowired
    private PowerConsumptionHistoryRepository powerHistoryRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Parse và lưu dữ liệu công suất từ MQTT payload
     * Hỗ trợ deviceId từ payload hoặc từ tham số
     * 
     * @param deviceId ID thiết bị (fallback nếu payload không có deviceId)
     * @param payload JSON payload từ ESP32 (có thể chứa deviceId)
     * @return PowerConsumptionHistory đã lưu, hoặc null nếu lỗi
     */
    public PowerConsumptionHistory savePowerData(Long deviceId, String payload) {
        // Thử lấy deviceId từ payload trước
        Long actualDeviceId = extractDeviceIdFromPayload(payload);
        if (actualDeviceId != null) {
            deviceId = actualDeviceId;
            System.out.println("Su dung deviceId tu payload: " + deviceId);
        }
        try {
            // Fix JSON nếu bị cắt cụt (thiếu dấu đóng ngoặc)
            String fixedPayload = fixIncompleteJson(payload);
            
            // Parse JSON payload
            JsonNode jsonNode = objectMapper.readTree(fixedPayload);

            // Extract các field từ JSON
            // Format: {"volt":235.6,"curr":0.423,"pwr":99.7,"humi":2.0,"relay":1}
            Double voltage = getDoubleValue(jsonNode, "volt", 0.0);
            Double current = getDoubleValue(jsonNode, "curr", 0.0);
            Double power = getDoubleValue(jsonNode, "pwr", 0.0);
            Double humidity = getDoubleValue(jsonNode, "humi", null);
            Integer relay = getIntValue(jsonNode, "relay", 0);

            // Tạo entity và lưu
            PowerConsumptionHistory history = new PowerConsumptionHistory(
                    deviceId, voltage, current, power, humidity, relay);

            PowerConsumptionHistory saved = powerHistoryRepository.save(history);

            System.out.println("Da luu du lieu cong suat - Device: " + deviceId + 
                             ", Power: " + power + "W, Voltage: " + voltage + "V");

            return saved;
        } catch (Exception e) {
            System.err.println("Loi khi luu du lieu cong suat: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Helper method để lấy giá trị Double từ JSON
     */
    private Double getDoubleValue(JsonNode node, String fieldName, Double defaultValue) {
        JsonNode field = node.get(fieldName);
        if (field != null && !field.isNull()) {
            if (field.isNumber()) {
                return field.asDouble();
            } else if (field.isTextual()) {
                try {
                    return Double.parseDouble(field.asText());
                } catch (NumberFormatException e) {
                    return defaultValue;
                }
            }
        }
        return defaultValue;
    }

    /**
     * Fix JSON nếu bị cắt cụt (thiếu dấu đóng ngoặc)
     * Xử lý trường hợp: {"volt":2.1,"curr":0.000,"pwr":0.0,"humi":78.0,"relay":0,"DEVICE_ID":111
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
                System.out.println("Fixed incomplete JSON: " + trimmed.substring(0, Math.min(50, trimmed.length())) + "... -> " + fixed.substring(0, Math.min(50, fixed.length())) + "...");
                return fixed;
            } else {
                // Nếu không có dấu phẩy, chỉ thêm }
                String fixed = trimmed + "}";
                System.out.println("Fixed incomplete JSON (no comma): " + trimmed.substring(0, Math.min(50, trimmed.length())) + "... -> " + fixed);
                return fixed;
            }
        }
        
        return trimmed;
    }

    /**
     * Extract deviceId từ payload nếu có
     * Hỗ trợ nhiều format:
     * - "deviceId" (camelCase)
     * - "DEVICE_ID" (UPPER_CASE với underscore)
     * - "ID" (chữ hoa đơn giản - format từ ESP32)
     * ESP32 có thể gửi: {"deviceId": 36, ...} hoặc {"DEVICE_ID": 111, ...} hoặc {"ID": 111, ...}
     */
    private Long extractDeviceIdFromPayload(String payload) {
        try {
            String fixedPayload = fixIncompleteJson(payload);
            JsonNode jsonNode = objectMapper.readTree(fixedPayload);
            
            // Thử "deviceId" trước (camelCase)
            JsonNode deviceIdNode = jsonNode.get("deviceId");
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
     * Helper method để lấy giá trị Integer từ JSON
     */
    private Integer getIntValue(JsonNode node, String fieldName, Integer defaultValue) {
        JsonNode field = node.get(fieldName);
        if (field != null && !field.isNull()) {
            if (field.isNumber()) {
                return field.asInt();
            } else if (field.isTextual()) {
                try {
                    return Integer.parseInt(field.asText());
                } catch (NumberFormatException e) {
                    return defaultValue;
                }
            }
        }
        return defaultValue;
    }
}

