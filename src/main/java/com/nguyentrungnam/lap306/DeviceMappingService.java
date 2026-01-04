package com.nguyentrungnam.lap306;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service thông minh để mapping MQTT topic -> DeviceId
 * Tự động tạo device nếu chưa tồn tại
 */
@Service
public class DeviceMappingService {

    @Autowired
    private DeviceRepository deviceRepository;

    // Cache để tránh query database mỗi lần
    private final Map<String, Long> topicToDeviceIdCache = new HashMap<>();

    /**
     * Lấy hoặc tạo deviceId từ MQTT topic
     * 
     * @param topic       MQTT topic (ví dụ: home/s3/status)
     * @param defaultName Tên mặc định nếu tạo device mới
     * @return DeviceId
     */
    @Transactional
    public Long getOrCreateDeviceId(String topic, String defaultName) {
        // Kiểm tra cache trước
        if (topicToDeviceIdCache.containsKey(topic)) {
            return topicToDeviceIdCache.get(topic);
        }

        // Tìm device theo topic trong database
        Optional<Device> deviceOpt = deviceRepository.findByTopic(topic);

        Long deviceId;
        if (deviceOpt.isPresent()) {
            // Device đã tồn tại
            deviceId = deviceOpt.get().getId();
        } else {
            // Tạo device mới tự động
            Device newDevice = new Device();
            newDevice.setTopic(topic);
            newDevice.setName(defaultName != null ? defaultName : generateDeviceName(topic));

            Device saved = deviceRepository.save(newDevice);
            deviceId = saved.getId();

            System.out.println("⚠️  Da tao device moi tu dong - Topic: " + topic +
                    ", DeviceId: " + deviceId + ", Name: " + saved.getName() +
                    " (KHUYEN NGHI: ESP32 nen gui kem field 'ID' trong payload de su dung deviceId co san)");
        }

        // Lưu vào cache
        topicToDeviceIdCache.put(topic, deviceId);
        return deviceId;
    }

    /**
     * Lấy deviceId từ topic (không tạo mới nếu chưa có)
     * 
     * @param topic MQTT topic
     * @return DeviceId hoặc null nếu không tìm thấy
     */
    public Long getDeviceIdByTopic(String topic) {
        // Kiểm tra cache
        if (topicToDeviceIdCache.containsKey(topic)) {
            return topicToDeviceIdCache.get(topic);
        }

        // Tìm trong database
        Optional<Device> deviceOpt = deviceRepository.findByTopic(topic);

        if (deviceOpt.isPresent()) {
            Long deviceId = deviceOpt.get().getId();
            topicToDeviceIdCache.put(topic, deviceId);
            return deviceId;
        }

        return null;
    }

    /**
     * Tạo tên device tự động từ topic
     * Ví dụ: home/s3/status -> "Sensor S3"
     */
    private String generateDeviceName(String topic) {
        if (topic == null || topic.isEmpty()) {
            return "Unknown Device";
        }

        // Xử lý các pattern topic phổ biến
        if (topic.contains("/status")) {
            // home/s3/status -> Sensor S3
            String[] parts = topic.split("/");
            if (parts.length >= 2) {
                return "Sensor " + parts[parts.length - 2].toUpperCase();
            }
            return "Sensor Device";
        } else if (topic.contains("/cmd")) {
            // home/s3/cmd -> Command Controller S3
            String[] parts = topic.split("/");
            if (parts.length >= 2) {
                return "Command Controller " + parts[parts.length - 2].toUpperCase();
            }
            return "Command Controller";
        } else if (topic.contains("/led")) {
            // home/s3/led -> LED S3
            String[] parts = topic.split("/");
            if (parts.length >= 2) {
                return "LED " + parts[parts.length - 2].toUpperCase();
            }
            return "LED Device";
        } else if (topic.contains("/temp")) {
            return "Temperature Sensor";
        } else if (topic.contains("/pump")) {
            // esp32/pump/data -> Pump ESP32
            String[] parts = topic.split("/");
            if (parts.length >= 2) {
                String deviceName = parts[0].toUpperCase() + " Pump";
                if (parts.length >= 3) {
                    deviceName += " " + parts[2].substring(0, 1).toUpperCase() + parts[2].substring(1);
                }
                return deviceName;
            }
            return "Pump Device";
        }

        // Mặc định: dùng topic làm tên
        return topic.replace("/", " ").replace("_", " ");
    }

    /**
     * Xóa cache (gọi khi có device mới được tạo từ API)
     */
    public void clearCache() {
        topicToDeviceIdCache.clear();
    }

    /**
     * Xóa cache cho một topic cụ thể
     */
    public void clearCacheForTopic(String topic) {
        topicToDeviceIdCache.remove(topic);
    }
}
