-- V15__Add_Branch_To_Timetable.sql
-- Forensic IDEMPOTENT Migration to ensure branch_id exists in timetables

DELIMITER $$

DROP PROCEDURE IF EXISTS AddTimetableBranchColumn $$
CREATE PROCEDURE AddTimetableBranchColumn()
BEGIN
    -- 1. Add column if missing
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'timetables' 
        AND COLUMN_NAME = 'branch_id'
    ) THEN
        ALTER TABLE timetables ADD COLUMN branch_id BIGINT;
    END IF;

    -- 2. Add constraint if missing
    IF NOT EXISTS (
        SELECT * FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'timetables' 
        AND CONSTRAINT_NAME = 'fk_timetable_branch'
    ) THEN
        ALTER TABLE timetables ADD CONSTRAINT fk_timetable_branch FOREIGN KEY (branch_id) REFERENCES branches(id);
    END IF;

    -- 3. Add index if missing
    IF NOT EXISTS (
        SELECT * FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'timetables' 
        AND INDEX_NAME = 'idx_timetable_branch'
    ) THEN
        CREATE INDEX idx_timetable_branch ON timetables(branch_id);
    END IF;
END $$

DELIMITER ;

CALL AddTimetableBranchColumn();
DROP PROCEDURE IF EXISTS AddTimetableBranchColumn;
