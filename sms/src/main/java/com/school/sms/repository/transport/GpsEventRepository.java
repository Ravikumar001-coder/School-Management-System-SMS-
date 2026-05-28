package com.school.sms.repository.transport;

import com.school.sms.model.transport.GpsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GpsEventRepository extends JpaRepository<GpsEvent, Long> {
    List<GpsEvent> findByVehicleIdAndEventTimeBetweenOrderByEventTimeDesc(Long vehicleId, LocalDateTime from, LocalDateTime to);
    List<GpsEvent> findByVehicleIdAndAcknowledgedFalseOrderByEventTimeDesc(Long vehicleId);
    List<GpsEvent> findBySeverityAndAcknowledgedFalse(String severity);
}
