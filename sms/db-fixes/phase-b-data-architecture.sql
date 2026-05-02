-- =============================================================
-- Migration: Phase B Data Architecture
-- Applies to: MySQL (school_db)
-- Date: 2026-05-01
-- Purpose: Add academic_year_id, branch_id, soft-delete columns,
--          and the receipt_sequences + audit_logs tables.
-- Run order: AFTER phase-a-token-architecture.sql
-- =============================================================

-- =============================================================
-- STEP 1: Create new foundation tables
-- =============================================================

CREATE TABLE IF NOT EXISTS branches (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(500),
    phone       VARCHAR(50),
    email       VARCHAR(255),
    active      TINYINT(1)   NOT NULL DEFAULT 1,
    created_at  DATETIME(6)
);

-- Seed the default branch (id=1 = MAIN) so FKs from old rows can be backfilled
INSERT IGNORE INTO branches (id, code, name, active, created_at)
VALUES (1, 'MAIN', 'Main Campus', 1, NOW());

-- =============================================================

CREATE TABLE IF NOT EXISTS academic_years (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    label       VARCHAR(20)  NOT NULL,
    start_year  INT          NOT NULL,
    end_year    INT          NOT NULL,
    school_code VARCHAR(20)  NOT NULL DEFAULT 'SMS',
    start_date  DATE,
    end_date    DATE,
    active      TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME(6),
    UNIQUE KEY UK_school_label (school_code, label)
);

-- Seed the current academic year (2025-26) as active
-- Change the label/years if you are in a different year
INSERT IGNORE INTO academic_years (label, start_year, end_year, school_code, start_date, end_date, active, created_at)
VALUES ('2025-26', 2025, 2026, 'SMS', '2025-04-01', '2026-03-31', 1, NOW());

-- =============================================================

CREATE TABLE IF NOT EXISTS receipt_sequences (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_code      VARCHAR(20)  NOT NULL,
    academic_year_id BIGINT       NOT NULL,
    last_sequence    BIGINT       NOT NULL DEFAULT 0,
    updated_at       DATETIME(6),
    UNIQUE KEY UK_school_year (school_code, academic_year_id),
    CONSTRAINT fk_rcptseq_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

-- =============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type         VARCHAR(100) NOT NULL,
    entity_id           BIGINT       NOT NULL,
    action              VARCHAR(20)  NOT NULL,
    field_name          VARCHAR(100),
    old_value           TEXT,
    new_value           TEXT,
    actor_username      VARCHAR(255) NOT NULL,
    actor_id            BIGINT       NOT NULL,
    ip_address          VARCHAR(50),
    academic_year_label VARCHAR(20),
    changed_at          DATETIME(6)  NOT NULL,
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_actor  (actor_id),
    INDEX idx_audit_time   (changed_at)
);

-- =============================================================
-- STEP 2: Add soft-delete columns to all domain tables
-- =============================================================

ALTER TABLE students
    ADD COLUMN IF NOT EXISTS deleted_at DATETIME(6)  AFTER updated_at,
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255) AFTER deleted_at;

ALTER TABLE teachers
    ADD COLUMN IF NOT EXISTS deleted_at DATETIME(6)  AFTER updated_at,
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255) AFTER deleted_at;

ALTER TABLE fee_payments
    ADD COLUMN IF NOT EXISTS deleted_at DATETIME(6)  AFTER created_at,
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255) AFTER deleted_at;

ALTER TABLE fee_structures
    ADD COLUMN IF NOT EXISTS deleted_at DATETIME(6),
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255);

ALTER TABLE attendance
    ADD COLUMN IF NOT EXISTS deleted_at DATETIME(6)  AFTER created_at,
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255) AFTER deleted_at;

ALTER TABLE marks
    ADD COLUMN IF NOT EXISTS deleted_at DATETIME(6)  AFTER created_at,
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255) AFTER deleted_at;

ALTER TABLE exams
    ADD COLUMN IF NOT EXISTS deleted_at DATETIME(6),
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255),
    ADD COLUMN IF NOT EXISTS created_at DATETIME(6);

-- =============================================================
-- STEP 3: Add academic_year_id FK to transactional tables
-- =============================================================

-- Store the active year's ID for backfill
SET @active_year_id := (SELECT id FROM academic_years WHERE active = 1 LIMIT 1);

ALTER TABLE fee_payments
    ADD COLUMN IF NOT EXISTS academic_year_id BIGINT AFTER receipt_number;

UPDATE fee_payments SET academic_year_id = @active_year_id WHERE academic_year_id IS NULL;

SET @fk1_exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fee_payments' AND CONSTRAINT_NAME = 'fk_fp_year');
SET @fk1_sql := IF(@fk1_exists = 0,
    'ALTER TABLE fee_payments ADD CONSTRAINT fk_fp_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)',
    'SELECT ''fk_fp_year already exists''');
PREPARE stmt FROM @fk1_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ----------

ALTER TABLE attendance
    ADD COLUMN IF NOT EXISTS academic_year_id BIGINT AFTER remarks;

UPDATE attendance SET academic_year_id = @active_year_id WHERE academic_year_id IS NULL;

SET @fk2_exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attendance' AND CONSTRAINT_NAME = 'fk_att_year');
SET @fk2_sql := IF(@fk2_exists = 0,
    'ALTER TABLE attendance ADD CONSTRAINT fk_att_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)',
    'SELECT ''fk_att_year already exists''');
PREPARE stmt FROM @fk2_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ----------

ALTER TABLE marks
    ADD COLUMN IF NOT EXISTS academic_year_id BIGINT AFTER remarks;

UPDATE marks SET academic_year_id = @active_year_id WHERE academic_year_id IS NULL;

SET @fk3_exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'marks' AND CONSTRAINT_NAME = 'fk_mark_year');
SET @fk3_sql := IF(@fk3_exists = 0,
    'ALTER TABLE marks ADD CONSTRAINT fk_mark_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)',
    'SELECT ''fk_mark_year already exists''');
PREPARE stmt FROM @fk3_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ----------

ALTER TABLE exams
    ADD COLUMN IF NOT EXISTS academic_year_id BIGINT;

UPDATE exams SET academic_year_id = @active_year_id WHERE academic_year_id IS NULL;

-- Drop the old string academicYear column from exams (now replaced by FK)
ALTER TABLE exams MODIFY COLUMN IF EXISTS academic_year VARCHAR(20) NULL;
-- We leave the column nullable rather than dropping to avoid breaking any existing reports.
-- Drop it manually once all code references are confirmed removed.

SET @fk4_exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'exams' AND CONSTRAINT_NAME = 'fk_exam_year');
SET @fk4_sql := IF(@fk4_exists = 0,
    'ALTER TABLE exams ADD CONSTRAINT fk_exam_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)',
    'SELECT ''fk_exam_year already exists''');
PREPARE stmt FROM @fk4_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- =============================================================
-- STEP 4: Add branch_id FK to all domain tables
-- =============================================================

ALTER TABLE students      ADD COLUMN IF NOT EXISTS branch_id BIGINT DEFAULT 1;
ALTER TABLE teachers      ADD COLUMN IF NOT EXISTS branch_id BIGINT DEFAULT 1;
ALTER TABLE fee_payments  ADD COLUMN IF NOT EXISTS branch_id BIGINT DEFAULT 1;
ALTER TABLE attendance    ADD COLUMN IF NOT EXISTS branch_id BIGINT DEFAULT 1;
ALTER TABLE marks         ADD COLUMN IF NOT EXISTS branch_id BIGINT DEFAULT 1;
ALTER TABLE exams         ADD COLUMN IF NOT EXISTS branch_id BIGINT DEFAULT 1;
ALTER TABLE fee_structures ADD COLUMN IF NOT EXISTS branch_id BIGINT DEFAULT 1;

-- Backfill all existing rows to MAIN branch
UPDATE students       SET branch_id = 1 WHERE branch_id IS NULL;
UPDATE teachers       SET branch_id = 1 WHERE branch_id IS NULL;
UPDATE fee_payments   SET branch_id = 1 WHERE branch_id IS NULL;
UPDATE attendance     SET branch_id = 1 WHERE branch_id IS NULL;
UPDATE marks          SET branch_id = 1 WHERE branch_id IS NULL;
UPDATE exams          SET branch_id = 1 WHERE branch_id IS NULL;
UPDATE fee_structures SET branch_id = 1 WHERE branch_id IS NULL;

-- =============================================================
-- STEP 5: Update receipt_number format
-- Convert existing "REC-{timestamp}" receipts to structured format
-- This is a best-effort migration: old receipts keep their numbers.
-- New payments will use the sequence-based generator.
-- =============================================================

-- Verification queries
SELECT 'branches' AS tbl, COUNT(*) AS rows FROM branches UNION ALL
SELECT 'academic_years', COUNT(*) FROM academic_years UNION ALL
SELECT 'receipt_sequences', COUNT(*) FROM receipt_sequences UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;

SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('students', 'teachers', 'attendance', 'marks', 'fee_payments', 'exams')
  AND COLUMN_NAME IN ('deleted_at', 'deleted_by', 'academic_year_id', 'branch_id')
ORDER BY TABLE_NAME, COLUMN_NAME;
