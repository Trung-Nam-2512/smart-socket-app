package com.nguyentrungnam.lap306;

import com.nguyentrungnam.lap306.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    /**
     * Tìm device theo MQTT topic
     */
    Optional<Device> findByTopic(String topic);
}
