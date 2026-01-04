package com.nguyentrungnam.lap306;

import com.nguyentrungnam.lap306.Telemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {
    List<Telemetry> findByDeviceId(Long deviceId);
}