-- ==============================================================================
-- PHASE A: DATABASE INDEXING & PERFORMANCE MIGRATION
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FOREIGN KEY INDEXES
-- ------------------------------------------------------------------------------
-- Creating indexes on FKs to prevent full table scans on JOINs and cascaded deletes.

CREATE INDEX IF NOT EXISTS idx_students_classroom_id ON students(classroom_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);

CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_subject_id ON teachers(subject_id);

CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_classroom_id ON attendance(class_id);

CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_exam_id ON marks(exam_id);

CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_fee_structure_id ON fee_payments(fee_structure_id);

CREATE INDEX IF NOT EXISTS idx_exams_classroom_id ON exams(class_id);
CREATE INDEX IF NOT EXISTS idx_exams_subject_id ON exams(subject_id);

-- ------------------------------------------------------------------------------
-- 2. COMPOSITE INDEXES
-- ------------------------------------------------------------------------------

-- fee_payments: Often queried by student and year (e.g. "has this student paid for this year?")
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_year ON fee_payments(student_id, academic_year_id);

-- attendance: High volume, usually queried by class and date for daily roll call
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance(class_id, date);

-- marks: Searched by student and exam for report cards
CREATE INDEX IF NOT EXISTS idx_marks_student_exam ON marks(student_id, exam_id);

-- students: Multi-tenant & year aware lookup
CREATE INDEX IF NOT EXISTS idx_students_branch_year ON students(branch_id, academic_year_id);

-- teachers: Find active teachers per branch
CREATE INDEX IF NOT EXISTS idx_teachers_branch_active ON teachers(branch_id, status);

-- ------------------------------------------------------------------------------
-- 3. CREATED_AT INDEXES (Time-series / Dashboards)
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_attendance_created_at ON attendance(created_at);
CREATE INDEX IF NOT EXISTS idx_fee_payments_created_at ON fee_payments(created_at);
CREATE INDEX IF NOT EXISTS idx_marks_created_at ON marks(created_at);

-- ==============================================================================
-- ROLLBACK SCRIPT (Run only if needed)
-- ==============================================================================
/*
DROP INDEX idx_students_classroom_id ON students;
DROP INDEX idx_students_user_id ON students;
DROP INDEX idx_teachers_user_id ON teachers;
DROP INDEX idx_teachers_subject_id ON teachers;
DROP INDEX idx_attendance_student_id ON attendance;
DROP INDEX idx_attendance_classroom_id ON attendance;
DROP INDEX idx_marks_student_id ON marks;
DROP INDEX idx_marks_exam_id ON marks;
DROP INDEX idx_fee_payments_student_id ON fee_payments;
DROP INDEX idx_fee_payments_fee_structure_id ON fee_payments;
DROP INDEX idx_exams_classroom_id ON exams;
DROP INDEX idx_exams_subject_id ON exams;

DROP INDEX idx_fee_payments_student_year ON fee_payments;
DROP INDEX idx_attendance_class_date ON attendance;
DROP INDEX idx_marks_student_exam ON marks;
DROP INDEX idx_students_branch_year ON students;
DROP INDEX idx_teachers_branch_active ON teachers;

DROP INDEX idx_attendance_created_at ON attendance;
DROP INDEX idx_fee_payments_created_at ON fee_payments;
DROP INDEX idx_marks_created_at ON marks;
*/
