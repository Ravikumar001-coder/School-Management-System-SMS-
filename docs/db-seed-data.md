# 🗄️ SQL Seed Data Reference

This document provides a complete set of SQL `INSERT` structures to populate every table in your School Management System. 

> [!WARNING]
> **Constraint Logic**: Execute these in the exact order listed below to avoid `Foreign Key Constraint` errors.

---

### Phase 1: Organizational Foundation
Initialize the environment before adding people.

```sql
-- 1. Create Branches
INSERT INTO branches (id, name, code, address, phone, email, active, created_at) 
VALUES (1, 'Main Campus', 'MAIN-01', '123 Education St, New Delhi', '9988776655', 'main@school.com', true, NOW());

-- 2. Create Academic Year
INSERT INTO academic_years (id, label, start_year, end_year, start_date, end_date, active, school_code, created_at)
VALUES (1, '2024-25', 2024, 2025, '2024-04-01', '2025-03-31', true, 'SMS', NOW());

-- 3. Initialize Receipt Sequence
INSERT INTO receipt_sequences (id, school_code, year, last_number, prefix, created_at)
VALUES (1, 'SMS', 2024, 0, 'SMS/2024/', NOW());
```

---

### Phase 2: User Accounts (Identity)
Passwords below are placeholders. In a real system, these must be BCrypt hashes.

```sql
-- 4. Create User Accounts (Admin, Teacher, Student)
-- Note: 'password' here is a placeholder for a BCrypt hash
INSERT INTO users (id, username, password, email, first_name, last_name, role, enabled, first_login, created_at)
VALUES 
(1, 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2CfGU.o.8yL.DBy1fK.T8xV.D8L8Bq.', 'admin@school.com', 'System', 'Admin', 'ADMIN', true, false, NOW()),
(2, 'TCH-2024-001', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2CfGU.o.8yL.DBy1fK.T8xV.D8L8Bq.', 'teacher@school.com', 'Demo', 'Teacher', 'TEACHER', true, true, NOW()),
(3, 'STU-2024-0001', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2CfGU.o.8yL.DBy1fK.T8xV.D8L8Bq.', 'student@school.com', 'Demo', 'Student', 'STUDENT', true, true, NOW());
```

---

### Phase 3: Academic Infrastructure
Linking teachers and classes.

```sql
-- 5. Create Teacher Profile
INSERT INTO teachers (id, user_id, employee_id, first_name, last_name, email, status, created_at)
VALUES (1, 2, 'TCH-2024-001', 'Demo', 'Teacher', 'teacher@school.com', 'ACTIVE', NOW());

-- 6. Create ClassRoom
INSERT INTO class_rooms (id, name, section, academic_year, teacher_id, max_capacity, class_fee, admission_fee)
VALUES (1, 'Grade 10', 'A', '2024-25', 1, 40, 25000.00, 5000.00);

-- 7. Create Subjects
INSERT INTO subjects (id, name, code, description, created_at)
VALUES 
(1, 'Mathematics', 'MATH-10', 'Advanced Algebra & Geometry', NOW()),
(2, 'Physics', 'PHY-10', 'Quantum Mechanics Basics', NOW());
```

---

### Phase 4: Student Records
Linking students to their classes and years.

```sql
-- 8. Create Student Profile
INSERT INTO students (id, user_id, classroom_id, academic_year_id, branch_id, student_id, first_name, last_name, email, status, created_at)
VALUES (1, 3, 1, 1, 1, 'STU-2024-0001', 'Demo', 'Student', 'student@school.com', 'ACTIVE', NOW());
```

---

### Phase 5: Transactions & Events
The high-volume daily operational data.

```sql
-- 9. Mark Attendance
INSERT INTO attendance (id, student_id, class_id, academic_year_id, branch_id, attendance_date, status, marked_by, created_at)
VALUES (1, 1, 1, 1, 1, CURDATE(), 'PRESENT', 1, NOW());

-- 10. Create Exam
INSERT INTO exams (id, name, type, exam_date, start_time, end_time, class_id, subject_id, academic_year_id, max_marks, passing_marks, created_at)
VALUES (1, 'Mid-Term 2024', 'THEORY', '2024-10-15', '09:00:00', '12:00:00', 1, 1, 1, 100, 35, NOW());

-- 11. Post Marks
INSERT INTO marks (id, student_id, exam_id, subject_id, academic_year_id, marks_obtained, total_marks, remarks, created_at)
VALUES (1, 1, 1, 1, 1, 85.5, 100, 'Excellent performance', NOW());

-- 12. Fee Payment
INSERT INTO fee_payments (id, student_id, academic_year_id, branch_id, amount, payment_date, payment_method, status, receipt_number, created_at)
VALUES (1, 1, 1, 1, 5000.00, CURDATE(), 'CASH', 'COMPLETED', 'SMS/2024/001', NOW());
```

---

### Phase 6: System Management
Internal tracking tables.

```sql
-- 13. Audit Logging
INSERT INTO audit_logs (id, action, entity_name, entity_id, user_id, details, ip_address, created_at)
VALUES (1, 'CREATE', 'Student', 1, 1, 'Initial student registration', '127.0.0.1', NOW());

-- 14. System Backups
INSERT INTO system_backups (id, filename, file_size, status, triggered_by, created_at)
VALUES (1, 'backup_2024_05_02.sql', 1048576, 'SUCCESS', 'admin', NOW());
```
