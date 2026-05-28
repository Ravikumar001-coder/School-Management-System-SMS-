-- V23__HRMS_Schema_Fixes.sql
-- Fix schema collisions and add missing HRMS tables

-- 1. Create staff_leave_requests (V21's leave_requests failed due to V5's leave_requests)
CREATE TABLE IF NOT EXISTS staff_leave_requests (
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

-- 2. PF & ESI Reports
CREATE TABLE IF NOT EXISTS pf_esi_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    report_month INT NOT NULL,
    report_year INT NOT NULL,
    total_pf_employee DECIMAL(15,2) DEFAULT 0.00,
    total_pf_employer DECIMAL(15,2) DEFAULT 0.00,
    total_esi_employee DECIMAL(15,2) DEFAULT 0.00,
    total_esi_employer DECIMAL(15,2) DEFAULT 0.00,
    challan_url TEXT,
    status ENUM('DRAFT', 'SUBMITTED') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 3. Salary Increment History
CREATE TABLE IF NOT EXISTS salary_increment_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    previous_salary_structure_id BIGINT,
    new_salary_structure_id BIGINT NOT NULL,
    effective_date DATE NOT NULL,
    increment_percentage DECIMAL(5,2),
    approved_by BIGINT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (previous_salary_structure_id) REFERENCES salary_structures(id),
    FOREIGN KEY (new_salary_structure_id) REFERENCES salary_structures(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
