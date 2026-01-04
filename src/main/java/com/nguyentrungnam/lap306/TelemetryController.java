package com.nguyentrungnam.lap306;

import com.nguyentrungnam.lap306.Telemetry;
import com.nguyentrungnam.lap306.TelemetryRepository;
import com.nguyentrungnam.lap306.Device;
import com.nguyentrungnam.lap306.DeviceRepository;
import com.nguyentrungnam.lap306.MqttPublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/telemetry")
public class TelemetryController {
    @Autowired
    private TelemetryRepository telemetryRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private MqttPublisherService mqttPublisherService;

    @GetMapping("/{deviceId}")
    public List<Telemetry> getByDevice(@PathVariable Long deviceId) {
        return telemetryRepository.findByDeviceId(deviceId);
    }

    @PostMapping
    public Telemetry createTelemetry(@RequestBody Telemetry telemetry) {
        // Push to MQTT if device exists
        // Data will be saved to database by MQTT handler when message is received
        Device device = deviceRepository.findById(telemetry.getDeviceId()).orElse(null);
        if (device != null && device.getTopic() != null) {
            mqttPublisherService.publish(device.getTopic(), telemetry.getPayload());
        }

        // Return the telemetry object (not saved yet, will be saved by MQTT handler)
        return telemetry;
    }
}
