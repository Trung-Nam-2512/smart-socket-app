package com.nguyentrungnam.lap306;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PowerConsumptionHistoryRepository extends JpaRepository<PowerConsumptionHistory, Long> {

    /**
     * Lấy dữ liệu theo deviceId và khoảng thời gian
     */
    List<PowerConsumptionHistory> findByDeviceIdAndTimestampBetween(
            Long deviceId, LocalDateTime start, LocalDateTime end);

    /**
     * Lấy dữ liệu mới nhất của device
     */
    PowerConsumptionHistory findFirstByDeviceIdOrderByTimestampDesc(Long deviceId);

    /**
     * Tính trung bình công suất trong khoảng thời gian
     * Sử dụng native query để tránh lỗi JPQL
     */
    @Query(value = "SELECT AVG(power) FROM power_consumption_history " +
           "WHERE device_id = :deviceId AND timestamp BETWEEN :start AND :end",
           nativeQuery = true)
    Double getAveragePower(@Param("deviceId") Long deviceId, 
                          @Param("start") LocalDateTime start, 
                          @Param("end") LocalDateTime end);

    /**
     * Lấy danh sách dữ liệu theo thứ tự timestamp để tính năng lượng tiêu thụ
     * Sẽ tính trong service dựa trên timestamp thực tế
     */
    @Query("SELECT p FROM PowerConsumptionHistory p " +
           "WHERE p.deviceId = :deviceId AND p.timestamp BETWEEN :start AND :end " +
           "ORDER BY p.timestamp ASC")
    List<PowerConsumptionHistory> findByDeviceIdAndTimestampBetweenOrdered(
            @Param("deviceId") Long deviceId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    /**
     * Lấy dữ liệu theo khoảng thời gian để vẽ biểu đồ
     */
    @Query("SELECT p FROM PowerConsumptionHistory p " +
           "WHERE p.deviceId = :deviceId AND p.timestamp >= :start " +
           "ORDER BY p.timestamp ASC")
    List<PowerConsumptionHistory> findByDeviceIdAndTimestampAfter(
            @Param("deviceId") Long deviceId, 
            @Param("start") LocalDateTime start);

    /**
     * Lấy danh sách deviceId có dữ liệu (distinct)
     */
    @Query(value = "SELECT DISTINCT device_id FROM power_consumption_history ORDER BY device_id DESC", 
           nativeQuery = true)
    List<Long> findDistinctDeviceIds();
}

