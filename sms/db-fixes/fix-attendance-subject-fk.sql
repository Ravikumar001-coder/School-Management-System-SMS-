-- Purpose: Permanently fix attendance -> subjects foreign key failures caused by orphan subject_id values.
-- Target DB: MySQL (school_db)
-- Safety model:
-- 1) Backup orphan attendance rows into attendance_orphan_subject_backup
-- 2) Delete only orphan rows from attendance
-- 3) Add the foreign key if it does not already exist

-- Optional: make sure you are in the right schema
-- USE school_db;

START TRANSACTION;

-- Create backup table once (same structure as attendance)
CREATE TABLE IF NOT EXISTS attendance_orphan_subject_backup LIKE attendance;

-- Backup orphan rows (if any) before cleanup
INSERT INTO attendance_orphan_subject_backup
SELECT a.*
FROM attendance a
LEFT JOIN subjects s ON s.id = a.subject_id
WHERE a.subject_id IS NOT NULL
  AND s.id IS NULL;

-- Remove only orphan rows that violate FK integrity
DELETE a
FROM attendance a
LEFT JOIN subjects s ON s.id = a.subject_id
WHERE a.subject_id IS NOT NULL
  AND s.id IS NULL;

COMMIT;

-- Add FK only when missing (idempotent)
SET @fk_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS tc
    WHERE tc.CONSTRAINT_SCHEMA = DATABASE()
      AND tc.TABLE_NAME = 'attendance'
      AND tc.CONSTRAINT_NAME = 'FKcjg1qkkmmy4dtktcdug457x4p'
      AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @fk_sql := IF(
    @fk_exists = 0,
    'ALTER TABLE attendance ADD CONSTRAINT FKcjg1qkkmmy4dtktcdug457x4p FOREIGN KEY (subject_id) REFERENCES subjects(id)',
    'SELECT ''FK already exists on attendance.subject_id'''
);

PREPARE stmt FROM @fk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verification queries
SELECT COUNT(*) AS orphan_count_after_cleanup
FROM attendance a
LEFT JOIN subjects s ON s.id = a.subject_id
WHERE a.subject_id IS NOT NULL
  AND s.id IS NULL;

SELECT CONSTRAINT_NAME, TABLE_NAME
FROM information_schema.TABLE_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = DATABASE()
  AND TABLE_NAME = 'attendance'
  AND CONSTRAINT_NAME = 'FKcjg1qkkmmy4dtktcdug457x4p';
