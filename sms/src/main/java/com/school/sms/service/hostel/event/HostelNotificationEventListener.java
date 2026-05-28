package com.school.sms.service.hostel.event;

import com.school.sms.repository.StudentRepository;
import com.school.sms.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@Slf4j
@RequiredArgsConstructor
public class HostelNotificationEventListener {

    private final NotificationService notificationService;
    private final StudentRepository studentRepository;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleNightAbsence(NightAbsenceEvent event) {
        log.info("Processing async night absence notification for student {}", event.getStudentId());
        try {
            studentRepository.findById(event.getStudentId()).ifPresent(student -> {
                String phone = student.getParentPhone();
                if (phone != null && !phone.trim().isEmpty()) {
                    String msg = String.format("URGENT: Your ward %s %s was marked ABSENT during hostel night roll call on %s. Please contact the warden immediately.", 
                            student.getFirstName(), student.getLastName(), event.getAttendanceDate());
                    notificationService.sendSms(phone, msg);
                } else {
                    log.warn("Cannot send Night Absence SMS for student {}: No parent phone found", student.getId());
                }
            });
        } catch (Exception e) {
            log.error("Failed to send night absence SMS to student {}", event.getStudentId(), e);
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleMessBillGenerated(MessBillGeneratedEvent event) {
        log.info("Processing async mess bill notification for student {}", event.getStudentId());
        try {
            studentRepository.findById(event.getStudentId()).ifPresent(student -> {
                String phone = student.getParentPhone();
                if (phone != null && !phone.trim().isEmpty()) {
                    String msg = String.format("NOTICE: Hostel Mess Bill for %s %s generated. Amount: $%.2f. Due for Month %d/%d. Please pay to avoid late fees.", 
                            student.getFirstName(), student.getLastName(), event.getAmount(), event.getMonth(), event.getYear());
                    notificationService.sendSms(phone, msg);
                }
            });
        } catch (Exception e) {
            log.error("Failed to send mess bill SMS to student {}", event.getStudentId(), e);
        }
    }
}
