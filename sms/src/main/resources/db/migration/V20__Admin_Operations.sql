-- V20__Admin_Operations.sql
-- Missing modules from the Master Prompt: Admission CRM, Promotion Engine

-- ==========================================
-- PHASE 1: ADMISSION CRM
-- ==========================================

CREATE TABLE IF NOT EXISTS admission_leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    parent_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    target_class_id BIGINT,
    status ENUM('NEW', 'FOLLOW_UP', 'REGISTERED', 'ADMITTED', 'REJECTED') DEFAULT 'NEW',
    source VARCHAR(50), -- e.g., 'WEBSITE', 'WALK_IN', 'REFERRAL'
    assigned_to BIGINT, -- Links to users (Admin/Counselor ID)
    branch_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (target_class_id) REFERENCES class_rooms(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS lead_follow_ups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    follow_up_date TIMESTAMP NOT NULL,
    notes TEXT NOT NULL,
    status VARCHAR(50),
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES admission_leads(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ==========================================
-- PHASE 2: STUDENT PROMOTION ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS promotion_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_academic_year_id BIGINT NOT NULL,
    target_academic_year_id BIGINT NOT NULL,
    source_class_id BIGINT NOT NULL,
    target_class_id BIGINT NOT NULL,
    total_students INT NOT NULL,
    promoted_count INT NOT NULL,
    failed_count INT NOT NULL,
    executed_by BIGINT,
    branch_id BIGINT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (target_academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (source_class_id) REFERENCES class_rooms(id),
    FOREIGN KEY (target_class_id) REFERENCES class_rooms(id),
    FOREIGN KEY (executed_by) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Done!
