-- ============================================================
-- V12__Connect_Departments_to_Subjects.sql
-- Formally connect Subjects to Departments and enforce integrity
-- ============================================================

-- 1. Ensure departments table exists
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Add department_id column to subjects
ALTER TABLE subjects ADD COLUMN department_id BIGINT;

-- 3. Seed departments table from existing subject department strings
INSERT IGNORE INTO departments (name)
SELECT DISTINCT department FROM subjects WHERE department IS NOT NULL AND department <> '';

-- 4. Update subjects.department_id based on the name match
UPDATE subjects s
JOIN departments d ON s.department = d.name
SET s.department_id = d.id;

-- 5. Add Foreign Key constraints
ALTER TABLE teachers 
    ADD CONSTRAINT fk_teachers_department 
    FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE subjects
    ADD CONSTRAINT fk_subjects_department 
    FOREIGN KEY (department_id) REFERENCES departments(id);

-- 6. Add indexes for performance
CREATE INDEX idx_subjects_department ON subjects(department_id);
CREATE INDEX idx_teachers_department ON teachers(department_id);
