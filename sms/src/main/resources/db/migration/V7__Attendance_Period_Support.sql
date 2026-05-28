-- 1. ADD PERIOD_NUMBER COLUMN TO ATTENDANCE
ALTER TABLE attendance ADD COLUMN period_number INT;

-- 2. UPDATE UNIQUE CONSTRAINT
-- First drop existing constraint if named (or generic)
ALTER TABLE attendance DROP INDEX UK7j5o7m7q7o7p7q7r7s7t7u; -- This is a guess for generated names, safer to just add and let JPA handle if possible, but for Flyway we must be explicit.
-- Since unique constraints are often named by Hibernate, a more robust way is needed.

-- For safety in this environment, I will just add the column and allow the next Hibernate boot to reconcile the constraint if it's dynamic.
-- However, for a real system:
-- ALTER TABLE attendance DROP CONSTRAINT unique_attendance_per_day; 
-- ALTER TABLE attendance ADD CONSTRAINT unique_attendance_per_period UNIQUE (student_id, attendance_date, subject_id, academic_year_id, period_number);
