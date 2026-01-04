package com.nguyentrungnam.lap306;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Entity lưu trữ lịch sử tiêu thụ điện năng từ ESP32
 * Dữ liệu được parse từ MQTT topic home/s3/status
 */
@Entity
@Table(name = "power_consumption_history", indexes = {
    @Index(name = "idx_timestamp", columnList = "timestamp"),
    @Index(name = "idx_device_timestamp", columnList = "deviceId,timestamp")
})
public class PowerConsumptionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long deviceId;

    // Điện áp (Voltage) - V
    @Column(nullable = false)
    private Double voltage;

    // Dòng điện (Current) - A
    @Column(nullable = false)
    private Double current;

    // Công suất (Power) - W
    @Column(nullable = false)
    private Double power;

    // Độ ẩm (Humidity) - %
    private Double humidity;

    // Trạng thái relay (0 = OFF, 1 = ON)
    @Column(nullable = false)
    private Integer relay;

    // Thời gian ghi nhận
    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Timezone Vietnam (UTC+7)
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    // Constructor
    public PowerConsumptionHistory() {
        // Sử dụng timezone Việt Nam (UTC+7)
        this.timestamp = LocalDateTime.now(VIETNAM_ZONE);
    }

    public PowerConsumptionHistory(Long deviceId, Double voltage, Double current, 
                                   Double power, Double humidity, Integer relay) {
        this.deviceId = deviceId;
        this.voltage = voltage;
        this.current = current;
        this.power = power;
        this.humidity = humidity;
        this.relay = relay;
        // Sử dụng timezone Việt Nam (UTC+7)
        this.timestamp = LocalDateTime.now(VIETNAM_ZONE);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public Double getVoltage() {
        return voltage;
    }

    public void setVoltage(Double voltage) {
        this.voltage = voltage;
    }

    public Double getCurrent() {
        return current;
    }

    public void setCurrent(Double current) {
        this.current = current;
    }

    public Double getPower() {
        return power;
    }

    public void setPower(Double power) {
        this.power = power;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Integer getRelay() {
        return relay;
    }

    public void setRelay(Integer relay) {
        this.relay = relay;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

