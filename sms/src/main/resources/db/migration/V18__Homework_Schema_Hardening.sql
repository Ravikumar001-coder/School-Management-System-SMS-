-- V18__Homework_Schema_Hardening.sql
-- Safe schema hardening using INFORMATION_SCHEMA checks
-- MySQL 5.7+ compatible (no DELIMITER, no stored procedures)

-- Step 1: Temporarily create a view to check which columns exist
-- We use a procedure-less approach: SET @vars + conditional DDL via prepared statements

SET @hw_status_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'homework' AND COLUMN_NAME = 'status'
);
SET @hw_resource_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'homework' AND COLUMN_NAME = 'resource_links'
);
SET @hw_publish_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'homework' AND COLUMN_NAME = 'scheduled_publish_at'
);
SET @at_branch_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attendance_templates' AND COLUMN_NAME = 'branch_id'
);
SET @at_year_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attendance_templates' AND COLUMN_NAME = 'academic_year_id'
);

SET @sql1 = IF(@hw_status_exists   = 0, "ALTER TABLE homework ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED'", 'SELECT 1');
SET @sql2 = IF(@hw_resource_exists = 0, "ALTER TABLE homework ADD COLUMN resource_links TEXT",                             'SELECT 1');
SET @sql3 = IF(@hw_publish_exists  = 0, "ALTER TABLE homework ADD COLUMN scheduled_publish_at TIMESTAMP NULL",             'SELECT 1');
SET @sql4 = IF(@at_branch_exists   = 0, "ALTER TABLE attendance_templates ADD COLUMN branch_id BIGINT",                   'SELECT 1');
SET @sql5 = IF(@at_year_exists     = 0, "ALTER TABLE attendance_templates ADD COLUMN academic_year_id BIGINT",            'SELECT 1');

PREPARE s1 FROM @sql1; EXECUTE s1; DEALLOCATE PREPARE s1;
PREPARE s2 FROM @sql2; EXECUTE s2; DEALLOCATE PREPARE s2;
PREPARE s3 FROM @sql3; EXECUTE s3; DEALLOCATE PREPARE s3;
PREPARE s4 FROM @sql4; EXECUTE s4; DEALLOCATE PREPARE s4;
PREPARE s5 FROM @sql5; EXECUTE s5; DEALLOCATE PREPARE s5;
