package com.nguyentrungnam.lap306;

import com.nguyentrungnam.lap306.Device;
import com.nguyentrungnam.lap306.DeviceRepository;
import com.nguyentrungnam.lap306.MqttPublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private MqttPublisherService mqttPublisherService;
    @Autowired
    private MqttPahoMessageDrivenChannelAdapter mqttAdapter;
    @Autowired
    private DeviceMappingService deviceMappingService;

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @PostMapping
    public Device createDevice(@RequestBody Device device) {
        try {
            mqttAdapter.addTopic(device.getTopic(), 1);
        } catch (Exception e) {
            // Topic already exists, ignore the error
            // Multiple devices can share the same topic
        }
        Device saved = deviceRepository.save(device);
        
        // Xóa cache để đảm bảo device mới được nhận diện
        if (saved.getTopic() != null) {
            deviceMappingService.clearCacheForTopic(saved.getTopic());
        }
        
        return saved;
    }

    @PostMapping("/{id}/control")
    public String controlDevice(@PathVariable Long id, @RequestBody String payload) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device != null) {
            mqttPublisherService.publish(device.getTopic(), payload);
            return "Published to " + device.getTopic();
        }
        return "Device not found";
    }

    /**
     * API để ESP32 query deviceId từ topic
     * GET /devices/by-topic?topic=home/s3/status
     */
    @GetMapping("/by-topic")
    public Map<String, Object> getDeviceByTopic(@RequestParam String topic) {
        Map<String, Object> response = new HashMap<>();
        Optional<Device> deviceOpt = deviceRepository.findByTopic(topic);
        
        if (deviceOpt.isPresent()) {
            Device device = deviceOpt.get();
            response.put("found", true);
            response.put("deviceId", device.getId());
            response.put("name", device.getName());
            response.put("topic", device.getTopic());
        } else {
            response.put("found", false);
            response.put("message", "Device not found for topic: " + topic);
        }
        
        return response;
    }
}