package com.school.sms.service.transport;

import com.school.sms.model.Student;
import com.school.sms.model.transport.BusAttendanceLog;
import com.school.sms.model.transport.TransportNotification;
import com.school.sms.repository.transport.TransportNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Transport Notification Service.
 *
 * Sends pickup/drop alerts to parents via:
 * - WhatsApp (Twilio / Gupshup abstraction)
 * - SMS
 * - Push notifications (Firebase)
 * - In-app alerts (WebSocket)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransportNotificationService {

    private final TransportNotificationRepository notificationRepository;

    @Async
    @Transactional
    public void notifyParent(Student student, Long vehicleId, Long routeId,
                              BusAttendanceLog.AttendanceType type) {
        TransportNotification.NotificationType notifType =
                type == BusAttendanceLog.AttendanceType.BOARDED
                        ? TransportNotification.NotificationType.BOARDED
                        : TransportNotification.NotificationType.DROPPED;

        String message = buildMessage(student, type);

        TransportNotification notification = TransportNotification.builder()
                .student(student)
                .notificationType(notifType)
                .message(message)
                .sentVia("IN_APP") // expandable to WHATSAPP, SMS
                .deliveryStatus("SENT")
                .sentAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // TODO: Integrate Twilio/Gupshup for WhatsApp
        // TODO: Integrate Firebase for push notification
        log.info("Parent notified: student={} type={} message='{}'",
                 student.getId(), type, message);
    }

    @Async
    @Transactional
    public void sendEmergencyAlert(Long vehicleId, Long routeId, String message) {
        log.error("EMERGENCY TRANSPORT ALERT: vehicle={} route={} msg={}", vehicleId, routeId, message);
        // Broadcast to all parents on this route
        // TODO: fetch all students on route, notify all parents
    }

    @Async
    @Transactional
    public void sendBusApproachingAlert(Student student, Long vehicleId, int stopsAway) {
        String msg = "Your child's bus is " + stopsAway + " stop(s) away. Get ready!";
        TransportNotification notification = TransportNotification.builder()
                .student(student)
                .notificationType(TransportNotification.NotificationType.BUS_APPROACHING)
                .message(msg)
                .sentVia("PUSH")
                .deliveryStatus("PENDING")
                .sentAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
        log.info("Bus approaching alert sent to parent of student {}", student.getId());
    }

    @Transactional(readOnly = true)
    public List<TransportNotification> getNotificationsForStudent(Long studentId) {
        return notificationRepository.findByStudentIdOrderBySentAtDesc(studentId);
    }

    private String buildMessage(Student student, BusAttendanceLog.AttendanceType type) {
        String name = student.getFirstName() + " " + student.getLastName();
        return type == BusAttendanceLog.AttendanceType.BOARDED
                ? name + " has boarded the school bus safely."
                : name + " has been dropped off at the stop.";
    }
}
