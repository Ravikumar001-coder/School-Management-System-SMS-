package com.school.sms.repository.transport;

import com.school.sms.model.transport.TransportNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransportNotificationRepository extends JpaRepository<TransportNotification, Long> {
    List<TransportNotification> findByStudentIdOrderBySentAtDesc(Long studentId);
    List<TransportNotification> findByRouteIdOrderBySentAtDesc(Long routeId);
}
