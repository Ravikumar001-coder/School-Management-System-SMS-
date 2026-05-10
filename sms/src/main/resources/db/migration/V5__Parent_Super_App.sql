-- V5__Parent_Super_App.sql
-- Phase 1.2: Parent Super App Master Schema
-- Adds all tables for attendance, fees, homework, circulars, leave, complaints, PTM, downloads, consent, notifications.

-- 1. Parent Notifications
CREATE TABLE parent_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NOT NULL,
    student_id BIGINT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- ATTENDANCE, FEE, HOMEWORK, CIRCULAR, LEAVE, COMPLAINT, PTM, RESULT, CONSENT
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_pn_parent (parent_id),
    INDEX idx_pn_unread (parent_id, is_read)
);

-- 2. Leave Requests
CREATE TABLE leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    attachment_url VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, PENDING, APPROVED, REJECTED, CANCELLED
    teacher_remarks TEXT,
    academic_year_id BIGINT,
    branch_id BIGINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    INDEX idx_lr_student (student_id),
    INDEX idx_lr_status (status)
);

-- 3. Complaints
CREATE TABLE complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL, -- ACADEMIC, TEACHER_BEHAVIOR, TRANSPORT, HYGIENE, BULLYING, FEES, OTHER
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    description TEXT NOT NULL,
    attachment_url VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, WAITING_PARENT, RESOLVED, CLOSED
    resolution_remarks TEXT,
    academic_year_id BIGINT,
    branch_id BIGINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    INDEX idx_cp_ticket (ticket_id),
    INDEX idx_cp_student (student_id),
    INDEX idx_cp_status (status)
);

-- 4. Homework
CREATE TABLE homework (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_room_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachment_url VARCHAR(255),
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    academic_year_id BIGINT,
    branch_id BIGINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_room_id) REFERENCES classrooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    INDEX idx_hw_class (class_room_id),
    INDEX idx_hw_due (due_date)
);

-- 5. Homework Submissions
CREATE TABLE homework_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    homework_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submission_text TEXT,
    attachment_url VARCHAR(255),
    submitted_at DATETIME,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SUBMITTED, LATE, MISSING
    teacher_remarks TEXT,
    grade VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (homework_id) REFERENCES homework(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY uk_hw_sub (homework_id, student_id),
    INDEX idx_hws_student (student_id)
);

-- 6. PTM Slots
CREATE TABLE ptm_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    academic_year_id BIGINT,
    branch_id BIGINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    UNIQUE KEY uk_ptm_slot (teacher_id, slot_date, start_time),
    INDEX idx_ptms_teacher_date (teacher_id, slot_date)
);

-- 7. PTM Bookings
CREATE TABLE ptm_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'BOOKED', -- BOOKED, CANCELLED, COMPLETED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (slot_id) REFERENCES ptm_slots(id),
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY uk_ptmb_slot (slot_id), -- One booking per slot
    INDEX idx_ptmb_parent (parent_id),
    INDEX idx_ptmb_student (student_id)
);

-- 8. Circular Reads (assuming announcements table is used for circulars)
CREATE TABLE circular_reads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    announcement_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id),
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    UNIQUE KEY uk_cr_announcement_parent (announcement_id, parent_id),
    INDEX idx_cr_parent (parent_id)
);

-- 9. Downloadable Documents
CREATE TABLE downloadable_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- TC, CHARACTER_CERTIFICATE, BONAFIDE, REPORT_CARD, ID_CARD, FEE_RECEIPT, ADMIT_CARD
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    expiry_date DATETIME,
    academic_year_id BIGINT,
    branch_id BIGINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_dd_student (student_id)
);

-- 10. Consent Forms
CREATE TABLE consent_forms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachment_url VARCHAR(255),
    due_date DATE NOT NULL,
    target_audience VARCHAR(50) NOT NULL, -- GLOBAL, CLASS, SPECIFIC
    class_room_id BIGINT,
    academic_year_id BIGINT,
    branch_id BIGINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_room_id) REFERENCES classrooms(id)
);

-- 11. Consent Responses
CREATE TABLE consent_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consent_form_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, -- APPROVED, REJECTED
    signature_text VARCHAR(255),
    ip_address VARCHAR(45),
    device_info TEXT,
    responded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consent_form_id) REFERENCES consent_forms(id),
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY uk_cr_form_student (consent_form_id, student_id),
    INDEX idx_cr_parent (parent_id),
    INDEX idx_cr_student (student_id)
);
