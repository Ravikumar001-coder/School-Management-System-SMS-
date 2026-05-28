-- ============================================================
-- V24__Root_Admin_Dashboard_System_Alerts.sql
-- Create system_alerts, activity_logs, and add indexes
-- ============================================================

CREATE TABLE IF NOT EXISTS `system_alerts` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `type` varchar(50) NOT NULL,
    `severity` varchar(20) NOT NULL,
    `title` varchar(150) NOT NULL,
    `message` text,
    `module` varchar(50),
    `branch_id` bigint DEFAULT NULL,
    `resolved` boolean NOT NULL DEFAULT false,
    `created_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_system_alerts_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `user` varchar(100),
    `avatar` varchar(10),
    `message` varchar(255),
    `timestamp` datetime,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Safe performance indexes for dashboard queries
ALTER TABLE staff
    ADD INDEX IF NOT EXISTS idx_staff_branch (branch_id),
    ADD INDEX IF NOT EXISTS idx_staff_status (status);

ALTER TABLE staff_attendance
    ADD INDEX IF NOT EXISTS idx_staff_attendance_date (attendance_date),
    ADD INDEX IF NOT EXISTS idx_staff_attendance_status (attendance_status);

ALTER TABLE vehicles
    ADD INDEX IF NOT EXISTS idx_vehicles_branch (branch_id),
    ADD INDEX IF NOT EXISTS idx_vehicles_status (current_status);

ALTER TABLE payroll_runs
    ADD INDEX IF NOT EXISTS idx_payroll_runs_branch (branch_id),
    ADD INDEX IF NOT EXISTS idx_payroll_runs_status (status);

ALTER TABLE system_alerts
    ADD INDEX IF NOT EXISTS idx_system_alerts_resolved_created (resolved, created_at);

-- Seed initial high-quality system alerts
INSERT INTO `system_alerts` (`type`, `severity`, `title`, `message`, `module`, `branch_id`, `resolved`, `created_at`) VALUES
('PAYROLL', 'HIGH', 'Payroll Process Pending', 'Monthly payroll runs for the current month are still in DRAFT status and have not been locked or paid.', 'HRMS', NULL, false, NOW()),
('TRANSPORT', 'MEDIUM', 'Vehicle Under Maintenance', 'Vehicle DL-3C-AB-1234 is currently in maintenance mode and unavailable for transport routes.', 'TRANSPORT', NULL, false, NOW()),
('FINANCE', 'HIGH', 'Tally Export Failure', 'Auto-export of finance data to Tally has failed due to connection timeout.', 'FINANCE', NULL, false, NOW()),
('SECURITY', 'HIGH', 'Unresolved Security Incident', 'An unresolved security incident of category INTRUSION has been reported in Hostel Block A.', 'HOSTEL', NULL, false, NOW());

-- Seed initial activity feed logs
INSERT INTO `activity_logs` (`user`, `avatar`, `message`, `timestamp`) VALUES
('System', 'S', 'Daily backups completed successfully for all branches.', NOW() - INTERVAL 10 MINUTE),
('Rahul Sharma', 'RS', 'Approved leave request for Staff member Priya Sen (Academic Dept).', NOW() - INTERVAL 2 HOUR),
('Amit Verma', 'AV', 'Collected annual registration fee payment of ₹12,000 from student Rohan Gupta.', NOW() - INTERVAL 3 HOUR),
('System', 'S', 'Biometric sync completed for 142 teaching staff members.', NOW() - INTERVAL 5 HOUR),
('System', 'S', 'Critical alert generated: Vehicle DL-3C-AB-1234 reported offline.', NOW() - INTERVAL 8 HOUR);
