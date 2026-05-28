-- ========================================================
-- V16__Advanced_Admin_Modules.sql
-- ERP Expansion for Admissions, Checklists, ID Cards, Promotions, Shuffling, Migration & Certificates
-- ========================================================

-- PHASE 1: ADMISSION CRM
CREATE TABLE IF NOT EXISTS admission_enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enquiry_no VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    parent_email VARCHAR(100) NULL,
    class_applied_id BIGINT NULL,
    academic_year_id BIGINT NULL,
    source ENUM('WHATSAPP','WALK_IN','WEBSITE','REFERRAL','SOCIAL_MEDIA','CALL') NOT NULL,
    status ENUM('LEAD','FOLLOW_UP','REGISTRATION','ADMISSION','REJECTED') NOT NULL DEFAULT 'LEAD',
    assigned_counselor_id BIGINT NULL,
    next_followup_date DATE NULL,
    notes TEXT NULL,
    rejection_reason TEXT NULL,
    converted_student_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(100) NULL,
    CONSTRAINT fk_enq_class FOREIGN KEY (class_applied_id) REFERENCES class_rooms(id),
    CONSTRAINT fk_enq_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    CONSTRAINT fk_enq_student FOREIGN KEY (converted_student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS enquiry_followups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enquiry_id BIGINT NOT NULL,
    followup_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    followup_type VARCHAR(50) NOT NULL,
    remarks TEXT NULL,
    next_followup_date DATE NULL,
    created_by VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_followup_enq FOREIGN KEY (enquiry_id) REFERENCES admission_enquiries(id) ON DELETE CASCADE
);

-- PHASE 2: DOCUMENT CHECKLIST
CREATE TABLE IF NOT EXISTS document_master (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    board_id VARCHAR(50) NULL,
    class_id BIGINT NULL,
    is_mandatory BOOLEAN DEFAULT FALSE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(100) NULL,
    CONSTRAINT fk_doc_class FOREIGN KEY (class_id) REFERENCES class_rooms(id)
);

CREATE TABLE IF NOT EXISTS student_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    document_id BIGINT NOT NULL,
    status ENUM('PENDING','RECEIVED','WAIVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    uploaded_file VARCHAR(500) NULL,
    remarks TEXT NULL,
    verified_by VARCHAR(100) NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_std_doc_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_std_doc_master FOREIGN KEY (document_id) REFERENCES document_master(id)
);

-- PHASE 3: SMART ID CARDS
CREATE TABLE IF NOT EXISTS id_card_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bg_gradient VARCHAR(255) NULL,
    primary_color VARCHAR(50) NULL,
    secondary_color VARCHAR(50) NULL,
    text_color VARCHAR(50) NULL,
    font_family VARCHAR(50) NULL,
    show_logo BOOLEAN DEFAULT TRUE,
    show_barcode BOOLEAN DEFAULT FALSE,
    show_qr BOOLEAN DEFAULT TRUE,
    emergency_contact_phone VARCHAR(50) NULL,
    school_address TEXT NULL,
    created_by VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(100) NULL
);

CREATE TABLE IF NOT EXISTS generated_id_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    card_no VARCHAR(100) UNIQUE NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by VARCHAR(100) NULL,
    CONSTRAINT fk_idcard_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_idcard_template FOREIGN KEY (template_id) REFERENCES id_card_templates(id)
);

-- PHASE 4: PROMOTION ENGINE
CREATE TABLE IF NOT EXISTS promotion_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    from_academic_year_id BIGINT NOT NULL,
    to_academic_year_id BIGINT NOT NULL,
    from_classroom_id BIGINT NOT NULL,
    to_classroom_id BIGINT NOT NULL,
    promotion_rule VARCHAR(100) NOT NULL,
    promoted_by VARCHAR(100) NOT NULL,
    promoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rollback_status BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_promo_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_promo_from_year FOREIGN KEY (from_academic_year_id) REFERENCES academic_years(id),
    CONSTRAINT fk_promo_to_year FOREIGN KEY (to_academic_year_id) REFERENCES academic_years(id),
    CONSTRAINT fk_promo_from_class FOREIGN KEY (from_classroom_id) REFERENCES class_rooms(id),
    CONSTRAINT fk_promo_to_class FOREIGN KEY (to_classroom_id) REFERENCES class_rooms(id)
);

CREATE TABLE IF NOT EXISTS student_academic_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    classroom_id BIGINT NOT NULL,
    roll_number VARCHAR(50) NULL,
    marks_obtained DOUBLE NULL,
    percentage DOUBLE NULL,
    result_status VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hist_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_hist_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    CONSTRAINT fk_hist_class FOREIGN KEY (classroom_id) REFERENCES class_rooms(id)
);

-- PHASE 5: SECTION RESHUFFLE ENGINE
CREATE TABLE IF NOT EXISTS section_transfer_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    from_classroom_id BIGINT NOT NULL,
    to_classroom_id BIGINT NOT NULL,
    remarks TEXT NULL,
    transferred_by VARCHAR(100) NOT NULL,
    transferred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transfer_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_transfer_from FOREIGN KEY (from_classroom_id) REFERENCES class_rooms(id),
    CONSTRAINT fk_transfer_to FOREIGN KEY (to_classroom_id) REFERENCES class_rooms(id)
);

-- PHASE 7: CUSTOM CERTIFICATES
CREATE TABLE IF NOT EXISTS certificate_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    header_text TEXT NULL,
    body_text TEXT NULL,
    footer_text TEXT NULL,
    background_style VARCHAR(255) NULL,
    show_watermark BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(100) NULL
);

CREATE TABLE IF NOT EXISTS issued_certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    certificate_no VARCHAR(100) UNIQUE NOT NULL,
    verification_token VARCHAR(100) UNIQUE NOT NULL,
    issued_date DATE NOT NULL,
    issued_by VARCHAR(100) NOT NULL,
    digital_signature TEXT NULL,
    pdf_path VARCHAR(500) NULL,
    status VARCHAR(50) DEFAULT 'ISSUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cert_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_cert_template FOREIGN KEY (template_id) REFERENCES certificate_templates(id)
);

-- INDEXES FOR ENTERPRISE ROI & SPEED
CREATE INDEX idx_enq_status ON admission_enquiries(status);
CREATE INDEX idx_enq_phone ON admission_enquiries(parent_phone);
CREATE INDEX idx_enq_email ON admission_enquiries(parent_email);
CREATE INDEX idx_doc_status ON student_documents(status);
CREATE INDEX idx_promo_student ON promotion_history(student_id);
CREATE INDEX idx_transfer_student ON section_transfer_history(student_id);
CREATE INDEX idx_cert_student ON issued_certificates(student_id);
CREATE INDEX idx_cert_token ON issued_certificates(verification_token);
