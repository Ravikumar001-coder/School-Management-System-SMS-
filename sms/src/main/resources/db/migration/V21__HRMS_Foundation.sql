-- V21__HRMS_Foundation.sql
-- Enterprise HRMS & Staff Management Database Foundation

-- ====================================================
-- SECTION 1: STAFF ONBOARDING & CORE RECORDS
-- ====================================================

-- 1. Designations
CREATE TABLE IF NOT EXISTS designations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    level INT DEFAULT 1,
    department_id BIGINT,
    reporting_role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 2. Work Shifts
CREATE TABLE IF NOT EXISTS work_shifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    grace_minutes INT DEFAULT 15,
    weekly_off_pattern VARCHAR(100), -- e.g., 'SUNDAY,SATURDAY_2_4'
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Core Staff Record (Universal Employee Table)
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(20),
    date_of_birth DATE,
    marital_status VARCHAR(20),
    blood_group VARCHAR(10),
    
    -- Contact Info
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    personal_email VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(20),
    country VARCHAR(50),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(100),
    emergency_contact_relation VARCHAR(50),
    emergency_contact_phone VARCHAR(20),
    
    -- Lifecycle
    joining_date DATE NOT NULL,
    confirmation_date DATE,
    resignation_date DATE,
    relieving_date DATE,
    
    -- Job Assignment
    department_id BIGINT,
    designation_id BIGINT,
    role_id BIGINT,
    branch_id BIGINT,
    reporting_manager_id BIGINT,
    biometric_id VARCHAR(50) UNIQUE,
    employment_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'VISITING', 'INTERN') DEFAULT 'FULL_TIME',
    work_shift_id BIGINT,
    
    -- Professional Background
    qualification VARCHAR(100),
    specialization VARCHAR(100),
    experience_years INT DEFAULT 0,
    profile_photo VARCHAR(255),
    
    -- Statutory & Banking
    aadhaar_number VARCHAR(20) UNIQUE,
    pan_number VARCHAR(20) UNIQUE,
    uan_number VARCHAR(20),
    esi_number VARCHAR(20),
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    
    -- Setup Linkages
    salary_structure_id BIGINT,
    status ENUM('ACTIVE', 'PROBATION', 'INACTIVE', 'RESIGNED', 'TERMINATED') DEFAULT 'PROBATION',
    notes TEXT,
    user_id BIGINT UNIQUE, -- Links to system login
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (designation_id) REFERENCES designations(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (reporting_manager_id) REFERENCES staff(id),
    FOREIGN KEY (work_shift_id) REFERENCES work_shifts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Staff Documents
CREATE TABLE IF NOT EXISTS staff_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- Aadhaar, PAN, Resume, Degree
    document_number VARCHAR(100),
    file_url TEXT NOT NULL,
    expiry_date DATE,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    uploaded_by BIGINT,
    verified_by BIGINT,
    verified_at TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- 5. Onboarding Checklist
CREATE TABLE IF NOT EXISTS staff_onboarding_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_type VARCHAR(50), -- IT_SETUP, HR_DOCS, INDUCTION
    assigned_to BIGINT, -- User ID responsible
    due_date DATE,
    completed_at TIMESTAMP NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- ====================================================
-- SECTION 2: PAYROLL ENGINE
-- ====================================================

-- 6. Salary Structures
CREATE TABLE IF NOT EXISTS salary_structures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    structure_name VARCHAR(100) NOT NULL,
    branch_id BIGINT,
    pay_frequency ENUM('MONTHLY', 'WEEKLY') DEFAULT 'MONTHLY',
    basic_percentage DECIMAL(5,2) DEFAULT 0.00,
    hra_percentage DECIMAL(5,2) DEFAULT 0.00,
    da_percentage DECIMAL(5,2) DEFAULT 0.00,
    ta_percentage DECIMAL(5,2) DEFAULT 0.00,
    medical_allowance DECIMAL(10,2) DEFAULT 0.00,
    special_allowance DECIMAL(10,2) DEFAULT 0.00,
    pf_enabled BOOLEAN DEFAULT TRUE,
    esi_enabled BOOLEAN DEFAULT TRUE,
    pt_enabled BOOLEAN DEFAULT TRUE,
    tds_enabled BOOLEAN DEFAULT TRUE,
    overtime_enabled BOOLEAN DEFAULT FALSE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

ALTER TABLE staff ADD CONSTRAINT fk_salary_struct FOREIGN KEY (salary_structure_id) REFERENCES salary_structures(id);

-- 7. Salary Components
CREATE TABLE IF NOT EXISTS salary_components (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    structure_id BIGINT NOT NULL,
    component_name VARCHAR(100) NOT NULL,
    component_type ENUM('EARNING', 'DEDUCTION') NOT NULL,
    calculation_type ENUM('FIXED', 'PERCENTAGE', 'FORMULA') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    taxable BOOLEAN DEFAULT TRUE,
    affects_pf BOOLEAN DEFAULT FALSE,
    affects_esi BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (structure_id) REFERENCES salary_structures(id)
);

-- 8. Payroll Runs
CREATE TABLE IF NOT EXISTS payroll_runs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_month INT NOT NULL,
    payroll_year INT NOT NULL,
    branch_id BIGINT,
    processed_by BIGINT,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_staff INT DEFAULT 0,
    total_gross DECIMAL(15,2) DEFAULT 0.00,
    total_deductions DECIMAL(15,2) DEFAULT 0.00,
    total_net DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('DRAFT', 'LOCKED', 'PAID') DEFAULT 'DRAFT',
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- 9. Payroll Entries (Payslips)
CREATE TABLE IF NOT EXISTS payroll_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_run_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    gross_salary DECIMAL(10,2) NOT NULL,
    total_earnings DECIMAL(10,2) NOT NULL,
    total_deductions DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL,
    overtime_amount DECIMAL(10,2) DEFAULT 0.00,
    late_deduction DECIMAL(10,2) DEFAULT 0.00,
    leave_deduction DECIMAL(10,2) DEFAULT 0.00,
    pf_amount DECIMAL(10,2) DEFAULT 0.00,
    esi_amount DECIMAL(10,2) DEFAULT 0.00,
    pt_amount DECIMAL(10,2) DEFAULT 0.00,
    tds_amount DECIMAL(10,2) DEFAULT 0.00,
    bonus_amount DECIMAL(10,2) DEFAULT 0.00,
    incentive_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('PENDING', 'PROCESSED', 'PAID') DEFAULT 'PENDING',
    payslip_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- 10. Salary Advances
CREATE TABLE IF NOT EXISTS salary_advances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    issued_date DATE NOT NULL,
    recovery_start_month INT NOT NULL,
    installment_count INT DEFAULT 1,
    monthly_recovery_amount DECIMAL(10,2) NOT NULL,
    status ENUM('ACTIVE', 'RECOVERED', 'CANCELLED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- ====================================================
-- SECTION 3: LEAVE MANAGEMENT
-- ====================================================

-- 11. Leave Types
CREATE TABLE IF NOT EXISTS leave_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    leave_code VARCHAR(10) UNIQUE NOT NULL, -- CL, SL, PL
    leave_name VARCHAR(100) NOT NULL,
    yearly_quota INT DEFAULT 0,
    carry_forward_enabled BOOLEAN DEFAULT FALSE,
    carry_forward_limit INT DEFAULT 0,
    encashment_enabled BOOLEAN DEFAULT FALSE,
    paid_leave BOOLEAN DEFAULT TRUE,
    gender_restriction VARCHAR(10), -- MALE, FEMALE
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Leave Balances
CREATE TABLE IF NOT EXISTS leave_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    year INT NOT NULL,
    allocated DECIMAL(5,1) DEFAULT 0.0,
    used DECIMAL(5,1) DEFAULT 0.0,
    remaining DECIMAL(5,1) DEFAULT 0.0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    UNIQUE (staff_id, leave_type_id, year)
);

-- 13. Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,1) NOT NULL,
    reason TEXT,
    attachment_url TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 14. Leave Approval Workflows
CREATE TABLE IF NOT EXISTS leave_approval_workflows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT,
    level INT DEFAULT 1,
    approver_role_id BIGINT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (approver_role_id) REFERENCES roles(id)
);

-- ====================================================
-- SECTION 4: BIOMETRIC INTEGRATION
-- ====================================================

-- 15. Biometric Devices
CREATE TABLE IF NOT EXISTS biometric_devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- ZKTeco, ESSL
    ip_address VARCHAR(50),
    api_key VARCHAR(255),
    branch_id BIGINT,
    sync_frequency VARCHAR(50) DEFAULT 'HOURLY',
    last_sync_at TIMESTAMP NULL,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 16. Biometric Logs (Raw)
CREATE TABLE IF NOT EXISTS biometric_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id BIGINT,
    biometric_user_id VARCHAR(50) NOT NULL,
    punch_time TIMESTAMP NOT NULL,
    punch_type ENUM('IN', 'OUT', 'UNKNOWN') DEFAULT 'UNKNOWN',
    raw_payload TEXT,
    processed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (device_id) REFERENCES biometric_devices(id)
);

-- 17. Processed Staff Attendance
CREATE TABLE IF NOT EXISTS staff_attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    total_hours DECIMAL(5,2) DEFAULT 0.0,
    overtime_hours DECIMAL(5,2) DEFAULT 0.0,
    late_minutes INT DEFAULT 0,
    early_exit_minutes INT DEFAULT 0,
    attendance_status ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'WEEKOFF') DEFAULT 'ABSENT',
    salary_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- ====================================================
-- SECTION 5: PERFORMANCE REVIEW SYSTEM
-- ====================================================

-- 18. Appraisal Cycles
CREATE TABLE IF NOT EXISTS appraisal_cycles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cycle_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('UPCOMING', 'ACTIVE', 'COMPLETED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Appraisal Templates
CREATE TABLE IF NOT EXISTS appraisal_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    department_id BIGINT,
    role_id BIGINT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 20. Appraisal Parameters
CREATE TABLE IF NOT EXISTS appraisal_parameters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    template_id BIGINT NOT NULL,
    parameter_name VARCHAR(255) NOT NULL,
    weightage INT DEFAULT 10,
    max_score INT DEFAULT 5,
    FOREIGN KEY (template_id) REFERENCES appraisal_templates(id)
);

-- 21. Appraisal Reviews
CREATE TABLE IF NOT EXISTS appraisal_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cycle_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    reviewer_id BIGINT,
    self_review TEXT,
    manager_review TEXT,
    final_score DECIMAL(5,2),
    increment_percentage DECIMAL(5,2),
    promotion_recommendation BOOLEAN DEFAULT FALSE,
    status ENUM('PENDING_SELF', 'PENDING_MANAGER', 'COMPLETED') DEFAULT 'PENDING_SELF',
    FOREIGN KEY (cycle_id) REFERENCES appraisal_cycles(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (reviewer_id) REFERENCES staff(id)
);

-- Done!
