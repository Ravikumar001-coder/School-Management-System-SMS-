package com.school.sms.service.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class NotificationService {

    public void sendSms(String phone, String message) {
        log.info("Sending SMS to {}: {}", phone, message);
        // Implement Twilio / MSG91 API here
    }

    public void sendWhatsApp(String phone, String templateId, List<String> params) {
        log.info("Sending WhatsApp to {} using template {}", phone, templateId);
        // Implement Meta WhatsApp Business API here
    }

    public void sendEmail(String email, String subject, String body) {
        log.info("Sending Email to {}: {}", email, subject);
        // Implement JavaMailSender / SendGrid API here
    }

    public void sendPushNotification(Long userId, String title, String body) {
        log.info("Sending Push Notification to user {}: {}", userId, title);
        // Implement Firebase Cloud Messaging (FCM) API here
    }
}
