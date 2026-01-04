package com.nguyentrungnam.lap306;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service tính toán dự đoán tiền điện
 * Giai đoạn "Giờ đầu tiên": Linear Extrapolation
 */
@Service
public class PowerPredictionService {

    @Autowired
    private PowerConsumptionHistoryRepository powerHistoryRepository;

    // Giá điện mặc định (VNĐ/kWh) - có thể cấu hình trong application.properties
    @Value("${electricity.price:2500}")
    private Double electricityPricePerKwh;

    /**
     * Tính dự đoán tiền điện dựa trên công suất tức thời
     * 
     * @param deviceId ID thiết bị
     * @param hours Số giờ cần dự đoán (ví dụ: 24 cho 1 ngày, 720 cho 1 tháng)
     * @return Map chứa các thông tin dự đoán
     */
    public Map<String, Object> predictCost(Long deviceId, Integer hours) {
        Map<String, Object> result = new HashMap<>();

        // Lấy dữ liệu mới nhất
        PowerConsumptionHistory latest = powerHistoryRepository
                .findFirstByDeviceIdOrderByTimestampDesc(deviceId);

        if (latest == null) {
            result.put("error", "Khong co du lieu");
            return result;
        }

        Double currentPower = latest.getPower(); // W
        Double powerKw = currentPower / 1000.0; // kW

        // Tính năng lượng tiêu thụ (kWh)
        Double energyKwh = powerKw * hours;

        // Tính tiền điện (VNĐ)
        Double costVnd = energyKwh * electricityPricePerKwh;

        // Tính số điện (kWh)
        result.put("currentPower", currentPower);
        result.put("currentPowerKw", powerKw);
        result.put("hours", hours);
        result.put("predictedEnergyKwh", Math.round(energyKwh * 100.0) / 100.0);
        result.put("predictedCostVnd", Math.round(costVnd));
        result.put("predictedCostVndFormatted", formatCurrency(costVnd));
        result.put("electricityPricePerKwh", electricityPricePerKwh);
        result.put("timestamp", latest.getTimestamp());
        result.put("message", generateMessage(hours, energyKwh, costVnd));

        return result;
    }

    /**
     * Dự đoán cho 24 giờ (1 ngày)
     */
    public Map<String, Object> predictDaily(Long deviceId) {
        return predictCost(deviceId, 24);
    }

    /**
     * Dự đoán cho 1 tháng (30 ngày = 720 giờ)
     */
    public Map<String, Object> predictMonthly(Long deviceId) {
        return predictCost(deviceId, 720);
    }

    /**
     * Dự đoán theo số giờ tùy chỉnh
     */
    public Map<String, Object> predictCustomHours(Long deviceId, Integer hours) {
        if (hours == null || hours <= 0) {
            hours = 24; // Mặc định 24 giờ
        }
        return predictCost(deviceId, hours);
    }

    /**
     * Tạo message cảnh báo cho người dùng
     */
    private String generateMessage(Integer hours, Double energyKwh, Double costVnd) {
        if (hours == 24) {
            return String.format("Neu tiep tuc su dung nhu hien tai, ban se tieu thu khoang %.2f so dien trong 24h, tuong duong %s VND",
                    energyKwh, formatCurrency(costVnd));
        } else if (hours == 720) {
            return String.format("Neu tiep tuc su dung nhu hien tai, ban se tieu thu khoang %.2f so dien trong 1 thang, tuong duong %s VND",
                    energyKwh, formatCurrency(costVnd));
        } else {
            return String.format("Neu tiep tuc su dung nhu hien tai trong %d gio, ban se tieu thu khoang %.2f so dien, tuong duong %s VND",
                    hours, energyKwh, formatCurrency(costVnd));
        }
    }

    /**
     * Format số tiền VNĐ
     */
    private String formatCurrency(Double amount) {
        if (amount >= 1000000) {
            return String.format("%.1f trieu", amount / 1000000.0);
        } else if (amount >= 1000) {
            return String.format("%.1f nghin", amount / 1000.0);
        } else {
            return String.format("%.0f", amount);
        }
    }

    /**
     * Lấy thống kê tiêu thụ trong khoảng thời gian
     */
    public Map<String, Object> getConsumptionStats(Long deviceId, LocalDateTime start, LocalDateTime end) {
        Map<String, Object> stats = new HashMap<>();

        // Tính trung bình công suất
        Double avgPower = powerHistoryRepository.getAveragePower(deviceId, start, end);
        if (avgPower == null) avgPower = 0.0;

        // Tính tổng năng lượng tiêu thụ dựa trên timestamp thực tế
        Double totalEnergy = calculateTotalEnergyConsumption(deviceId, start, end);

        // Tính tiền điện
        Double cost = totalEnergy * electricityPricePerKwh;

        stats.put("deviceId", deviceId);
        stats.put("startTime", start);
        stats.put("endTime", end);
        stats.put("averagePower", Math.round(avgPower * 100.0) / 100.0);
        stats.put("totalEnergyKwh", Math.round(totalEnergy * 100.0) / 100.0);
        stats.put("totalCostVnd", Math.round(cost));
        stats.put("totalCostVndFormatted", formatCurrency(cost));
        stats.put("electricityPricePerKwh", electricityPricePerKwh);

        return stats;
    }

    /**
     * Tính tổng năng lượng tiêu thụ (kWh) dựa trên timestamp thực tế
     * Sử dụng phương pháp tích phân: tính diện tích dưới đường cong công suất
     * Công thức: Energy = SUM(Power_i * TimeInterval_i) / 3600 / 1000
     * 
     * @param deviceId ID thiết bị
     * @param start Thời gian bắt đầu
     * @param end Thời gian kết thúc
     * @return Tổng năng lượng tiêu thụ (kWh)
     */
    private Double calculateTotalEnergyConsumption(Long deviceId, LocalDateTime start, LocalDateTime end) {
        // Lấy tất cả dữ liệu theo thứ tự timestamp
        List<PowerConsumptionHistory> history = powerHistoryRepository
                .findByDeviceIdAndTimestampBetweenOrdered(deviceId, start, end);

        if (history == null || history.size() < 2) {
            return 0.0;
        }

        double totalEnergyWh = 0.0; // Tổng năng lượng tính bằng Wh (Watt-hour)

        // Tính tích phân: diện tích dưới đường cong công suất
        for (int i = 0; i < history.size() - 1; i++) {
            PowerConsumptionHistory current = history.get(i);
            PowerConsumptionHistory next = history.get(i + 1);

            // Tính khoảng thời gian thực tế giữa 2 điểm dữ liệu (giây)
            long secondsBetween = java.time.Duration.between(
                    current.getTimestamp(), 
                    next.getTimestamp()
            ).getSeconds();

            // Nếu khoảng thời gian quá lớn (ví dụ > 1 phút), có thể bị mất dữ liệu, bỏ qua
            if (secondsBetween > 60) {
                continue;
            }

            // Tính năng lượng: Power (W) * Time (s) / 3600 = Wh
            // Sử dụng công suất trung bình giữa 2 điểm
            double avgPower = (current.getPower() + next.getPower()) / 2.0;
            double energyWh = avgPower * secondsBetween / 3600.0;
            totalEnergyWh += energyWh;
        }

        // Xử lý điểm cuối cùng: tính từ điểm cuối đến end time
        if (history.size() > 0) {
            PowerConsumptionHistory last = history.get(history.size() - 1);
            long secondsToEnd = java.time.Duration.between(
                    last.getTimestamp(), 
                    end
            ).getSeconds();

            // Chỉ tính nếu khoảng thời gian hợp lý (< 1 phút)
            if (secondsToEnd > 0 && secondsToEnd <= 60) {
                double energyWh = last.getPower() * secondsToEnd / 3600.0;
                totalEnergyWh += energyWh;
            }
        }

        // Convert từ Wh sang kWh
        return totalEnergyWh / 1000.0;
    }
}

