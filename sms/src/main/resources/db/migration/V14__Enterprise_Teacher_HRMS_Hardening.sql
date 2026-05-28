-- V14__Enterprise_Teacher_HRMS_Hardening.sql
-- Forensic Audit & Production Redesign of Teacher Module (HRMS)

DELIMITER $$

-- 1. IDEMPOTENT HELPERS
DROP PROCEDURE IF EXISTS AddTeacherColumnIfMissing $$
CREATE PROCEDURE AddTeacherColumnIfMissing(
    IN columnName VARCHAR(255),
    IN columnDefinition VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'teachers' 
        AND COLUMN_NAME = columnName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE teachers ADD COLUMN ', columnName, ' ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DROP PROCEDURE IF EXISTS AddTeacherConstraintIfMissing $$
CREATE PROCEDURE AddTeacherConstraintIfMissing(
    IN constraintName VARCHAR(255),
    IN constraintDef VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'teachers' 
        AND CONSTRAINT_NAME = constraintName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE teachers ADD CONSTRAINT ', constraintName, ' ', constraintDef);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DROP PROCEDURE IF EXISTS AddTeacherIndexIfMissing $$
CREATE PROCEDURE AddTeacherIndexIfMissing(
    IN indexName VARCHAR(255),
    IN indexDef VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'teachers' 
        AND INDEX_NAME = indexName
    ) THEN
        SET @sql = CONCAT('CREATE INDEX ', indexName, ' ON teachers (', indexDef, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DELIMITER ;

-- 2. NORMALIZATION
ALTER TABLE teachers 
    MODIFY status ENUM('ACTIVE','INACTIVE','ON_LEAVE','RESIGNED') DEFAULT 'ACTIVE',
    MODIFY created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6);

-- 3. APPLY HRMS FIELDS
CALL AddTeacherColumnIfMissing('employment_type', "ENUM('FULL_TIME','PART_TIME','CONTRACT','VISITING') DEFAULT 'FULL_TIME'");
CALL AddTeacherColumnIfMissing('work_shift', "VARCHAR(50) DEFAULT 'General'");
CALL AddTeacherColumnIfMissing('experience_years', 'INT DEFAULT 0');
CALL AddTeacherColumnIfMissing('leave_balance', 'INT DEFAULT 0');
CALL AddTeacherColumnIfMissing('marital_status', 'VARCHAR(50)');
CALL AddTeacherColumnIfMissing('nationality', "VARCHAR(50) DEFAULT 'Indian'");
CALL AddTeacherColumnIfMissing('bank_account_no', 'VARCHAR(100)');
CALL AddTeacherColumnIfMissing('ifsc_code', 'VARCHAR(20)');
CALL AddTeacherColumnIfMissing('tax_id', 'VARCHAR(50)');
CALL AddTeacherColumnIfMissing('pf_number', 'VARCHAR(50)');
CALL AddTeacherColumnIfMissing('esi_number', 'VARCHAR(50)');
CALL AddTeacherColumnIfMissing('payment_mode', "ENUM('BANK_TRANSFER','CASH','CHEQUE') DEFAULT 'BANK_TRANSFER'");
CALL AddTeacherColumnIfMissing('payroll_status', "ENUM('PENDING','ACTIVE','ON_HOLD') DEFAULT 'ACTIVE'");
CALL AddTeacherColumnIfMissing('contract_start_date', 'DATE');
CALL AddTeacherColumnIfMissing('contract_end_date', 'DATE');
CALL AddTeacherColumnIfMissing('probation_end_date', 'DATE');
CALL AddTeacherColumnIfMissing('resignation_date', 'DATE');
CALL AddTeacherColumnIfMissing('last_working_date', 'DATE');
CALL AddTeacherColumnIfMissing('exit_reason', 'TEXT');
CALL AddTeacherColumnIfMissing('biometric_id', 'VARCHAR(100)');
CALL AddTeacherColumnIfMissing('reporting_manager_id', 'BIGINT');
CALL AddTeacherColumnIfMissing('background_check_status', "ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING'");
CALL AddTeacherColumnIfMissing('document_verification_status', "ENUM('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING'");
CALL AddTeacherColumnIfMissing('created_by', 'VARCHAR(255)');
CALL AddTeacherColumnIfMissing('updated_by', 'VARCHAR(255)');

-- Constraints
CALL AddTeacherConstraintIfMissing('uk_teacher_employee_id', 'UNIQUE (employee_id)');
CALL AddTeacherConstraintIfMissing('uk_teacher_pan', 'UNIQUE (pan_card)');
CALL AddTeacherConstraintIfMissing('uk_teacher_aadhar', 'UNIQUE (aadhar_card)');
CALL AddTeacherConstraintIfMissing('uk_teacher_email', 'UNIQUE (email)');
CALL AddTeacherConstraintIfMissing( 'uk_teacher_biometric', 'UNIQUE (biometric_id)');
CALL AddTeacherConstraintIfMissing('fk_teacher_manager', 'FOREIGN KEY (reporting_manager_id) REFERENCES teachers(id)');

-- Indexes
CALL AddTeacherIndexIfMissing('idx_teacher_employment', 'employment_type');
CALL AddTeacherIndexIfMissing('idx_teacher_payroll', 'payroll_status');
CALL AddTeacherIndexIfMissing('idx_teacher_joining', 'joining_date');
CALL AddTeacherIndexIfMissing('idx_teacher_manager', 'reporting_manager_id');

-- Cleanup
DROP PROCEDURE IF EXISTS AddTeacherColumnIfMissing;
DROP PROCEDURE IF EXISTS AddTeacherConstraintIfMissing;
DROP PROCEDURE IF EXISTS AddTeacherIndexIfMissing;
