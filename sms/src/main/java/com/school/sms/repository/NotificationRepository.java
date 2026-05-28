package com.school.sms.repository;

import com.school.sms.model.Notification;
import com.school.sms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientAndDeletedAtIsNullOrderByCreatedAtDesc(User recipient);
    long countByRecipientAndReadIsFalseAndDeletedAtIsNull(User recipient);
}
