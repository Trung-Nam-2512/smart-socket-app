package com.nguyentrungnam.lap306;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller cung cấp API cho tính năng dự đoán tiền điện và thống kê
 */
@RestController
@RequestMapping("/api/power")
@CrossOrigin(origins = "*")
public class PowerPredictionController {

    @Autowired
    private PowerPredictionService powerPredictionService;

    @Autowired
    private PowerConsumptionHistoryRepository powerHistoryRepository;

    /**
     * Dự đoán tiền điện cho 24 giờ (1 ngày)
     * GET /api/power/predict/daily/{deviceId}
     */
    @GetMapping("/predict/daily/{deviceId}")
    public Map<String, Object> predictDaily(@PathVariable Long deviceId) {
        return powerPredictionService.predictDaily(deviceId);
    }

    /**
     * Dự đoán tiền điện cho 1 tháng (30 ngày)
     * GET /api/power/predict/monthly/{deviceId}
     */
    @GetMapping("/predict/monthly/{deviceId}")
    public Map<String, Object> predictMonthly(@PathVariable Long deviceId) {
        return powerPredictionService.predictMonthly(deviceId);
    }

    /**
     * Dự đoán tiền điện theo số giờ tùy chỉnh
     * GET /api/power/predict/{deviceId}?hours=12
     */
    @GetMapping("/predict/{deviceId}")
    public Map<String, Object> predictCustom(
            @PathVariable Long deviceId,
            @RequestParam(required = false, defaultValue = "24") Integer hours) {
        return powerPredictionService.predictCustomHours(deviceId, hours);
    }

    /**
     * Lấy thống kê tiêu thụ trong khoảng thời gian
     * GET /api/power/stats/{deviceId}?start=2026-01-01T00:00:00&end=2026-01-02T00:00:00
     * Nếu không có start/end, mặc định lấy 24h gần nhất
     */
    @GetMapping("/stats/{deviceId}")
    public Map<String, Object> getStats(
            @PathVariable Long deviceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false, defaultValue = "24") Integer hours) {
        // Nếu không có start/end, tính từ hours gần nhất
        if (start == null || end == null) {
            end = LocalDateTime.now();
            start = end.minusHours(hours);
        }
        return powerPredictionService.getConsumptionStats(deviceId, start, end);
    }

    /**
     * Lấy dữ liệu lịch sử để vẽ biểu đồ
     * GET /api/power/history/{deviceId}?hours=24
     */
    @GetMapping("/history/{deviceId}")
    public Map<String, Object> getHistory(
            @PathVariable Long deviceId,
            @RequestParam(required = false, defaultValue = "24") Integer hours) {
        Map<String, Object> result = new HashMap<>();
        
        LocalDateTime start = LocalDateTime.now().minusHours(hours);
        List<PowerConsumptionHistory> history = powerHistoryRepository
                .findByDeviceIdAndTimestampAfter(deviceId, start);

        result.put("deviceId", deviceId);
        result.put("startTime", start);
        result.put("endTime", LocalDateTime.now());
        result.put("data", history);
        result.put("count", history.size());

        return result;
    }

    /**
     * Lấy dữ liệu mới nhất
     * GET /api/power/latest/{deviceId}
     */
    @GetMapping("/latest/{deviceId}")
    public PowerConsumptionHistory getLatest(@PathVariable Long deviceId) {
        return powerHistoryRepository.findFirstByDeviceIdOrderByTimestampDesc(deviceId);
    }

    /**
     * Lấy danh sách deviceId có dữ liệu trong PowerConsumptionHistory
     * GET /api/power/devices-with-data
     */
    @GetMapping("/devices-with-data")
    public List<Long> getDevicesWithData() {
        return powerHistoryRepository.findDistinctDeviceIds();
    }
}

