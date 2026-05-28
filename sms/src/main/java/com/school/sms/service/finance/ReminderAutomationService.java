package com.school.sms.service.finance;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderAutomationService {

    /**
     * Cron job to send automated reminders for overdue payments.
     */
    @Scheduled(cron = "0 30 8 * * ?") // 8:30 AM daily
    public void processOverdueReminders() {
        log.info("Starting Automated Reminder Engine...");
        // 1. Fetch active reminder_rules (e.g. Day 0, Day 3, Day 7)
        // 2. Fetch ledgers with balance > 0
        // 3. Compare ledger due dates with trigger days
        // 4. Send SMS/Email/WhatsApp via NotificationService
        // 5. Log in reminder_logs
        log.info("Automated Reminder Engine completed.");
    }
}
