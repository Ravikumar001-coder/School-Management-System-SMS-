-- V13__Enterprise_Student_Schema_Hardening.sql
-- Forensic Audit & Production Redesign of Student Module

DELIMITER $$

-- 1. IDEMPOTENT HELPERS
DROP PROCEDURE IF EXISTS AddColumnIfMissing $$
CREATE PROCEDURE AddColumnIfMissing(
    IN tableName VARCHAR(255),
    IN columnName VARCHAR(255),
    IN columnDefinition VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = tableName 
        AND COLUMN_NAME = columnName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', columnName, ' ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DROP PROCEDURE IF EXISTS RenameColumnIfExists $$
CREATE PROCEDURE RenameColumnIfExists(
    IN tableName VARCHAR(255),
    IN oldColumnName VARCHAR(255),
    IN newColumnName VARCHAR(255),
    IN columnDefinition VARCHAR(255)
)
BEGIN
    IF EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = tableName 
        AND COLUMN_NAME = oldColumnName
    ) AND NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = tableName 
        AND COLUMN_NAME = newColumnName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', tableName, ' CHANGE COLUMN ', oldColumnName, ' ', newColumnName, ' ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DROP PROCEDURE IF EXISTS AddConstraintIfMissing $$
CREATE PROCEDURE AddConstraintIfMissing(
    IN tableName VARCHAR(255),
    IN constraintName VARCHAR(255),
    IN constraintDef VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = tableName 
        AND CONSTRAINT_NAME = constraintName
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', tableName, ' ADD CONSTRAINT ', constraintName, ' ', constraintDef);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DROP PROCEDURE IF EXISTS AddIndexIfMissing $$
CREATE PROCEDURE AddIndexIfMissing(
    IN tableName VARCHAR(255),
    IN indexName VARCHAR(255),
    IN indexDef VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = tableName 
        AND INDEX_NAME = indexName
    ) THEN
        SET @sql = CONCAT('CREATE INDEX ', indexName, ' ON ', tableName, ' (', indexDef, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DROP PROCEDURE IF EXISTS StandardizeLinkTable $$
CREATE PROCEDURE StandardizeLinkTable()
BEGIN
    IF EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'parent_student_links')
       AND NOT EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'parent_student_link')
    THEN
        RENAME TABLE parent_student_links TO parent_student_link;
    END IF;
    
    -- If neither exists, create it
    IF NOT EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'parent_student_link')
    THEN
        CREATE TABLE parent_student_link (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            parent_id BIGINT NOT NULL,
            student_id BIGINT NOT NULL,
            relationship VARCHAR(50) NOT NULL,
            is_primary_guardian BOOLEAN DEFAULT FALSE,
            created_by VARCHAR(255),
            created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
        ) ENGINE=InnoDB;
    END IF;
END $$

DELIMITER ;

-- 2. APPLY STUDENT TABLE NORMALIZATION
ALTER TABLE students 
    MODIFY admission_date DATE,
    MODIFY date_of_birth DATE,
    MODIFY status ENUM('ACTIVE','GRADUATED','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
    MODIFY created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6);

-- 3. APPLY FIELD UPDATES
CALL AddColumnIfMissing('students', 'roll_number', 'VARCHAR(50)');
CALL AddColumnIfMissing('students', 'section', 'VARCHAR(20)');
CALL AddColumnIfMissing('students', 'religion', 'VARCHAR(50)');
CALL AddColumnIfMissing('students', 'nationality', "VARCHAR(50) DEFAULT 'Indian'");
CALL AddColumnIfMissing('students', 'category', 'VARCHAR(50)');
CALL AddColumnIfMissing('students', 'emergency_contact', 'VARCHAR(20)');
CALL AddColumnIfMissing('students', 'previous_school', 'VARCHAR(255)');
CALL AddColumnIfMissing('students', 'medical_conditions', 'TEXT');
CALL AddColumnIfMissing('students', 'is_new_admission', 'BOOLEAN DEFAULT TRUE');
CALL AddColumnIfMissing('students', 'graduation_date', 'DATE');
CALL AddColumnIfMissing('students', 'promoted_from_classroom_id', 'BIGINT');
CALL AddColumnIfMissing('students', 'previous_student_id', 'VARCHAR(50)');
CALL AddColumnIfMissing('students', 'transfer_certificate_no', 'VARCHAR(50)');
CALL AddColumnIfMissing('students', 'aadhar_card', 'VARCHAR(20)');
CALL AddColumnIfMissing('students', 'department_id', 'BIGINT');
CALL AddColumnIfMissing('students', 'created_by', 'VARCHAR(255)');
CALL AddColumnIfMissing('students', 'updated_by', 'VARCHAR(255)');

CALL AddConstraintIfMissing('students', 'uk_student_id', 'UNIQUE (student_id)');
CALL AddConstraintIfMissing('students', 'uk_student_email', 'UNIQUE (email)');
CALL AddConstraintIfMissing('students', 'uk_branch_year_student', 'UNIQUE (branch_id, academic_year_id, id)');

CALL AddIndexIfMissing('students', 'idx_student_classroom', 'classroom_id');
CALL AddIndexIfMissing('students', 'idx_student_academic_year', 'academic_year_id');
CALL AddIndexIfMissing('students', 'idx_student_status', 'status');
CALL AddIndexIfMissing('students', 'idx_student_branch', 'branch_id');

-- 4. HARDEN PARENTS TABLE
CALL RenameColumnIfExists('parents', 'mobile_number', 'phone', 'VARCHAR(20) NOT NULL');
CALL AddColumnIfMissing('parents', 'first_name', 'VARCHAR(255)');
CALL AddColumnIfMissing('parents', 'last_name', 'VARCHAR(255)');
CALL AddColumnIfMissing('parents', 'user_id', 'BIGINT UNIQUE');
CALL AddColumnIfMissing('parents', 'is_mobile_verified', 'BOOLEAN DEFAULT FALSE');
CALL AddColumnIfMissing('parents', 'last_login_at', 'DATETIME(6)');
CALL AddColumnIfMissing('parents', 'pin_hash', 'VARCHAR(255)');

-- Migrate legacy data
UPDATE parents SET first_name = SUBSTRING_INDEX(full_name, ' ', 1), 
                   last_name = SUBSTRING(full_name, LOCATE(' ', full_name) + 1)
WHERE (first_name IS NULL OR first_name = '') AND full_name IS NOT NULL;

-- 5. STANDARDIZE LINK TABLE
CALL StandardizeLinkTable();
CALL AddColumnIfMissing('parent_student_link', 'relationship', 'VARCHAR(50)');
CALL AddColumnIfMissing('parent_student_link', 'is_primary_guardian', 'BOOLEAN DEFAULT FALSE');
CALL AddColumnIfMissing('parent_student_link', 'created_by', 'VARCHAR(255)');

-- Legacy data sync for links
-- Using a temporary procedure for complex data sync if needed, but simple update for now
UPDATE parent_student_link SET relationship = 'GUARDIAN' WHERE relationship IS NULL;

-- 6. CLEANUP
DROP PROCEDURE IF EXISTS AddColumnIfMissing;
DROP PROCEDURE IF EXISTS RenameColumnIfExists;
DROP PROCEDURE IF EXISTS AddConstraintIfMissing;
DROP PROCEDURE IF EXISTS AddIndexIfMissing;
DROP PROCEDURE IF EXISTS StandardizeLinkTable;
