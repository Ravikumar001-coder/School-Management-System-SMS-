package com.school.sms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(Objects.requireNonNull(to));
            helper.setSubject(Objects.requireNonNull(subject));
            helper.setText(Objects.requireNonNull(htmlContent), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email: {}", e.getMessage());
        }
    }

    public void sendFeeReminder(String parentEmail, String studentName,
                                Double amount, String month) {
        String subject = "Fee Payment Reminder - " + studentName;
        String body = String.format("""
            Dear Parent,

            This is a reminder that the fee for %s (Month: %s)
            amounting to ₹%.2f is due.

            Please pay at your earliest convenience to avoid late fees.

            Regards,
            School Management
            """, studentName, month, amount);

        sendSimpleEmail(parentEmail, subject, body);
    }

    public void sendAbsenceAlert(String parentEmail, String studentName,
                                 String date) {
        String subject = "Attendance Alert - " + studentName;
        String body = String.format("""
            Dear Parent,

            Your child %s was marked ABSENT today (%s).

            If this is incorrect, please contact the school.

            Regards,
            School Management
            """, studentName, date);

        sendSimpleEmail(parentEmail, subject, body);
    }
}
