-- V4__Parent_Ecosystem.sql
-- Phase 1.1: Parent Ecosystem Implementation

-- 1. Parent Entity
CREATE TABLE parents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_uuid VARCHAR(36) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    alternate_mobile VARCHAR(15),
    email VARCHAR(255),
    gender VARCHAR(20),
    relationship_default VARCHAR(50), -- father, mother, guardian
    photo_url VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    occupation VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    pin_hash VARCHAR(255), -- For 4-digit PIN
    last_login_at DATETIME,
    created_by_admin_id BIGINT,
    academic_year_id BIGINT,
    branch_id BIGINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    INDEX idx_parent_mobile (mobile_number),
    INDEX idx_parent_uuid (parent_uuid),
    INDEX idx_parent_active (is_active),
    INDEX idx_parent_branch (branch_id),
    INDEX idx_parent_year (academic_year_id)
);

-- 2. Parent-Student Relationship (Many-to-Many)
CREATE TABLE parent_student_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- FATHER, MOTHER, GUARDIAN, EMERGENCY
    is_primary_contact BOOLEAN DEFAULT FALSE,
    pickup_authorized BOOLEAN DEFAULT TRUE,
    fee_responsible BOOLEAN DEFAULT FALSE,
    lives_with_student BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY uk_parent_student (parent_id, student_id),
    INDEX idx_ps_parent (parent_id),
    INDEX idx_ps_student (student_id)
);

-- 3. OTP Sessions
CREATE TABLE parent_otp_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    otp_code_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL, -- LOGIN, VERIFY, RESET_PIN
    expires_at DATETIME NOT NULL,
    verified_at DATETIME,
    attempts_count INT DEFAULT 0,
    ip_address VARCHAR(45),
    device_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    INDEX idx_otp_parent (parent_id),
    INDEX idx_otp_mobile (mobile_number)
);

-- 4. Parent Login Sessions (Device tracking)
CREATE TABLE parent_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_type VARCHAR(50),
    device_name VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME,
    FOREIGN KEY (parent_id) REFERENCES parents(id),
    INDEX idx_session_parent (parent_id),
    INDEX idx_session_token (refresh_token_hash)
);

-- 5. Audit Log Update
-- Add Parent as an entity type if using enums or just support it via string.
-- (Assuming AuditLog system supports string entity types).
