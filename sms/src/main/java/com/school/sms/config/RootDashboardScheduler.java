package com.school.sms.config;

import com.school.sms.model.SystemAlert;
import com.school.sms.model.transport.Vehicle;
import com.school.sms.service.RootDashboardService;
import com.school.sms.service.ScheduledReportService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class RootDashboardScheduler {

    private final RootDashboardService rootDashboardService;
    private final ScheduledReportService scheduledReportService;

    @PersistenceContext
    private EntityManager entityManager;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. REFRESH DASHBOARD ANALYTICS CACHE (Every 5 minutes)
    // ─────────────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 */5 * * * *")
    public void refreshDashboardAnalytics() {
        log.info("[Scheduler] Refreshing dashboard analytics...");
        rootDashboardService.clearCache();
        // Warm up global cache
        try {
            rootDashboardService.getSummary(null);
            rootDashboardService.getFinanceMetrics(null);
            rootDashboardService.getAttendanceTrends(null);
            log.info("[Scheduler] Dashboard analytics cache refreshed and warmed successfully.");
        } catch (Exception e) {
            log.error("[Scheduler] Failed to warm up dashboard cache", e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. AUTOMATIC SYSTEM ALERT GENERATION ENGINE (Every 10 minutes)
    // ─────────────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 */10 * * * *")
    @Transactional
    public void generateAlerts() {
        log.info("[Scheduler] Scanning database for system anomalies and generating alerts...");

        try {
            // A. Check for pending payrolls in draft status
            String draftPayrollQuery = "select count(r) from PayrollRun r where r.status = com.school.sms.model.hrms.PayrollRun.RunStatus.DRAFT";
            Long draftPayrolls = entityManager.createQuery(draftPayrollQuery, Long.class).getSingleResult();
            if (draftPayrolls > 0) {
                createAlertIfNotExists(
                        "PAYROLL",
                        "MEDIUM",
                        "Pending Payroll Runs in Draft",
                        "There are currently " + draftPayrolls + " payroll runs pending processing and approval.",
                        "HRMS"
                );
            }

            // B. Check for buses/vehicles offline
            String offlineVehiclesQuery = "select v from Vehicle v where v.currentStatus = com.school.sms.model.transport.Vehicle.VehicleStatus.OFFLINE";
            List<Vehicle> offlineVehicles = entityManager.createQuery(offlineVehiclesQuery, Vehicle.class).getResultList();
            for (Vehicle v : offlineVehicles) {
                createAlertIfNotExists(
                        "TRANSPORT",
                        "HIGH",
                        "Vehicle Offline - " + v.getVehicleNumber(),
                        "Vehicle with plate number " + v.getVehicleNumber() + " has changed status to OFFLINE.",
                        "TRANSPORT"
                );
            }

            // C. Check for high outstanding fee payments
            String highFeesQuery = "select count(f) from FeePayment f where f.status = com.school.sms.model.PaymentStatus.PENDING and f.amount > 15000";
            Long highDues = entityManager.createQuery(highFeesQuery, Long.class).getSingleResult();
            if (highDues > 0) {
                createAlertIfNotExists(
                        "FINANCE",
                        "MEDIUM",
                        "High Outstanding Fee Dues",
                        "There are currently " + highDues + " pending fee structures with amount exceeding ₹15,000.",
                        "FINANCE"
                );
            }

            // D. Check for attendance anomaly (e.g. today's attendance low)
            LocalDate today = LocalDate.now();
            String totalAttQuery = "select count(a) from Attendance a where a.date = :today";
            String presentAttQuery = "select count(a) from Attendance a where a.date = :today and a.status = com.school.sms.model.AttendanceStatus.PRESENT";
            long total = entityManager.createQuery(totalAttQuery, Long.class).setParameter("today", today).getSingleResult();
            long present = entityManager.createQuery(presentAttQuery, Long.class).setParameter("today", today).getSingleResult();
            if (total > 50) {
                double pct = (present * 100.0) / total;
                if (pct < 85.0) {
                    createAlertIfNotExists(
                            "ATTENDANCE",
                            "HIGH",
                            "Low Student Attendance Today",
                            "Today's student attendance rate is abnormally low at " + Math.round(pct * 10.0)/10.0 + "%. Please audit attendance rosters.",
                            "ATTENDANCE"
                    );
                }
            }

            log.info("[Scheduler] Automated system alert generation completed successfully.");
        } catch (Exception e) {
            log.error("[Scheduler] Error running automated alert generation", e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. CLEANUP OLD EXPIRED CACHE (Every hour)
    // ─────────────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupOldCache() {
        log.info("[Scheduler] Cleaning up expired dashboard cache entries...");
        // In-memory cache handles TTL internally, but clear periodically to avoid memory creep
        rootDashboardService.clearCache();
        log.info("[Scheduler] Dashboard cache cleanup completed.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. PRECOMPUTE ATTENDANCE TRENDS (Every day at 1:00 AM)
    // ─────────────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 0 1 * * *")
    public void precomputeAttendanceTrends() {
        log.info("[Scheduler] Daily precomputation of student and staff attendance trends...");
        try {
            rootDashboardService.clearCache();
            rootDashboardService.getAttendanceTrends(null);
            log.info("[Scheduler] Attendance trends precomputed successfully.");
        } catch (Exception e) {
            log.error("[Scheduler] Error precomputing attendance trends", e);
        }
    }

    // Helper to log a critical alert uniquely
    private void createAlertIfNotExists(String type, String severity, String title, String description, String module) {
        String checkQuery = "select count(a) from SystemAlert a where a.type = :type and a.title = :title and a.resolved = false";
        Long count = entityManager.createQuery(checkQuery, Long.class)
                .setParameter("type", type)
                .setParameter("title", title)
                .getSingleResult();

        if (count == 0) {
            SystemAlert alert = SystemAlert.builder()
                    .type(type)
                    .severity(severity)
                    .title(title)
                    .message(description)
                    .module(module)
                    .resolved(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            entityManager.persist(alert);
            log.info("[Alerts Engine] Automatically generated new critical alert: {}", title);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. BACKGROUND JOB FOR SCHEDULED REPORTS (Every minute)
    // ─────────────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 * * * * *")
    public void runScheduledReports() {
        log.info("[Scheduler] Running background task for scheduled reports...");
        try {
            scheduledReportService.executeDueReports();
        } catch (Exception e) {
            log.error("[Scheduler] Error executing scheduled reports", e);
        }
    }
}

