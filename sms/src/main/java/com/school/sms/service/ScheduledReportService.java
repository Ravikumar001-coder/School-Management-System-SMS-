package com.school.sms.service;

import com.school.sms.model.ScheduledReport;
import com.school.sms.repository.ScheduledReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ScheduledReportService {

    private final ScheduledReportRepository scheduledReportRepository;
    private final AuditLogService auditLogService;

    public ScheduledReport saveReport(ScheduledReport report) {
        log.info("[ScheduledReport] Saving scheduled report: {}", report.getReportName());
        ScheduledReport saved = scheduledReportRepository.save(report);
        auditLogService.logCreate(
                "ScheduledReport",
                saved.getId(),
                report.getReportName() + " frequency=" + report.getFrequency() + " format=" + report.getExportFormat(),
                null
        );
        return saved;
    }

    @Transactional(readOnly = true)
    public List<ScheduledReport> getAll() {
        return scheduledReportRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<ScheduledReport> getByBranch(Long branchId) {
        return scheduledReportRepository.findByBranchId(branchId);
    }

    public void deleteReport(Long id) {
        scheduledReportRepository.findById(id).ifPresent(report -> {
            log.info("[ScheduledReport] Deleting scheduled report: {}", report.getReportName());
            scheduledReportRepository.delete(report);
            auditLogService.logDelete(
                    "ScheduledReport",
                    report.getId(),
                    report.getReportName(),
                    null
            );
        });
    }

    public void executeDueReports() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledReport> dueReports = scheduledReportRepository.findByNextRunAtBefore(now);
        if (dueReports.isEmpty()) {
            return;
        }

        log.info("[ScheduledReport] Executing {} due scheduled reports...", dueReports.size());
        for (ScheduledReport report : dueReports) {
            try {
                log.info("[ScheduledReport] Running scheduled report: {} for recipients: {}", 
                        report.getReportName(), report.getRecipients());
                
                // Simulate email delivery of the report
                auditLogService.logCreate(
                        "ScheduledReportExecution",
                        report.getId(),
                        "Report '" + report.getReportName() + "' sent to " + report.getRecipients() + " in format " + report.getExportFormat(),
                        null
                );

                // Update next execution time
                report.calculateNextRun();
                scheduledReportRepository.save(report);
            } catch (Exception e) {
                log.error("[ScheduledReport] Failed to run scheduled report " + report.getId(), e);
            }
        }
    }
}
