-- ============================================================
-- V3__performance_indexes_and_constraints.sql
-- Phase 0: Add missing indexes and data integrity constraints
-- ============================================================

-- ── students table ─────────────────────────────────────────
ALTER TABLE students
    ADD INDEX IF NOT EXISTS idx_students_student_id        (student_id),
    ADD INDEX IF NOT EXISTS idx_students_academic_year     (academic_year_id),
    ADD INDEX IF NOT EXISTS idx_students_classroom         (classroom_id),
    ADD INDEX IF NOT EXISTS idx_students_branch            (branch_id),
    ADD INDEX IF NOT EXISTS idx_students_status            (status),
    ADD INDEX IF NOT EXISTS idx_students_deleted_at        (deleted_at);

-- ── teachers table ─────────────────────────────────────────
ALTER TABLE teachers
    ADD INDEX IF NOT EXISTS idx_teachers_user_id           (user_id),
    ADD INDEX IF NOT EXISTS idx_teachers_branch            (branch_id),
    ADD INDEX IF NOT EXISTS idx_teachers_status            (status);

-- ── attendance table ───────────────────────────────────────
ALTER TABLE attendance
    ADD INDEX IF NOT EXISTS idx_attendance_student         (student_id),
    ADD INDEX IF NOT EXISTS idx_attendance_date            (attendance_date),
    ADD INDEX IF NOT EXISTS idx_attendance_academic_year   (academic_year_id),
    ADD INDEX IF NOT EXISTS idx_attendance_class           (class_id),
    ADD INDEX IF NOT EXISTS idx_attendance_branch          (branch_id),
    ADD INDEX IF NOT EXISTS idx_attendance_deleted_at      (deleted_at);

-- ── fee_payments table ─────────────────────────────────────
ALTER TABLE fee_payments
    ADD INDEX IF NOT EXISTS idx_fee_student                (student_id),
    ADD INDEX IF NOT EXISTS idx_fee_academic_year          (academic_year_id),
    ADD INDEX IF NOT EXISTS idx_fee_branch                 (branch_id),
    ADD INDEX IF NOT EXISTS idx_fee_receipt                (receipt_number),
    ADD INDEX IF NOT EXISTS idx_fee_status                 (status),
    ADD INDEX IF NOT EXISTS idx_fee_deleted_at             (deleted_at);

-- ── exams table ────────────────────────────────────────────
ALTER TABLE exams
    ADD INDEX IF NOT EXISTS idx_exams_academic_year        (academic_year_id),
    ADD INDEX IF NOT EXISTS idx_exams_branch               (branch_id),
    ADD INDEX IF NOT EXISTS idx_exams_class                (class_id),
    ADD INDEX IF NOT EXISTS idx_exams_subject              (subject_id),
    ADD INDEX IF NOT EXISTS idx_exams_date                 (exam_date),
    ADD INDEX IF NOT EXISTS idx_exams_deleted_at           (deleted_at);

-- ── marks table ────────────────────────────────────────────
ALTER TABLE marks
    ADD INDEX IF NOT EXISTS idx_marks_student              (student_id),
    ADD INDEX IF NOT EXISTS idx_marks_exam                 (exam_id),
    ADD INDEX IF NOT EXISTS idx_marks_academic_year        (academic_year_id),
    ADD INDEX IF NOT EXISTS idx_marks_deleted_at           (deleted_at);

-- ── classrooms table ──────────────────────────────────────
ALTER TABLE classrooms
    ADD INDEX IF NOT EXISTS idx_classrooms_academic_year   (academic_year_id),
    ADD INDEX IF NOT EXISTS idx_classrooms_branch          (branch_id),
    ADD INDEX IF NOT EXISTS idx_classrooms_teacher         (teacher_id);

-- ── audit_logs table ───────────────────────────────────────
ALTER TABLE audit_logs
    ADD INDEX IF NOT EXISTS idx_audit_entity               (entity_type, entity_id),
    ADD INDEX IF NOT EXISTS idx_audit_actor                (actor_username),
    ADD INDEX IF NOT EXISTS idx_audit_changed_at           (changed_at),
    ADD INDEX IF NOT EXISTS idx_audit_academic_year        (academic_year_id);

-- ── academic_years: fix is_current NULL issue ──────────────
-- Set SMS current year
UPDATE academic_years SET is_current = 1 WHERE id = 1 AND label = '2026-27';

-- Set current year for other branches (latest year they have)
UPDATE academic_years SET is_current = 1
WHERE label = '2024-25'
  AND school_code IN ('NTH','STH','EST','WST','CTR')
  AND is_current IS NULL;

-- ── academic_years: composite unique constraint ────────────
-- Drop single-column unique if it exists (from failed attempt)
ALTER TABLE academic_years
    DROP INDEX IF EXISTS uk_academic_years_label;

-- Safe composite unique
ALTER TABLE academic_years
    ADD UNIQUE INDEX IF NOT EXISTS uk_ay_label_school (label, school_code);

-- ── refresh_tokens: missing created_at ─────────────────────
ALTER TABLE refresh_tokens
    ADD COLUMN IF NOT EXISTS created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6);
