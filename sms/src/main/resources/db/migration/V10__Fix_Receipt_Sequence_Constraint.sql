-- Mission Critical: Fix Receipt Sequence Constraints (V10)
-- This migration ensures the composite unique index exists and is correctly named.
-- It uses a stored procedure for maximum compatibility with all MySQL 8.x versions.

DROP PROCEDURE IF EXISTS repair_receipt_sequence_indexes_v10;

DELIMITER //

CREATE PROCEDURE repair_receipt_sequence_indexes_v10()
BEGIN
    DECLARE bad_idx_count INT;
    DECLARE good_idx_count INT;

    -- 1. Check for Hibernate-generated bad index
    SELECT COUNT(*) INTO bad_idx_count 
    FROM information_schema.statistics 
    WHERE table_schema = DATABASE() 
    AND table_name = 'receipt_sequences' 
    AND index_name = 'UKg7eeu5hs0b53axwt7ec01r20x';

    IF bad_idx_count > 0 THEN
        ALTER TABLE receipt_sequences DROP INDEX UKg7eeu5hs0b53axwt7ec01r20x;
    END IF;

    -- 2. Check if the good index already exists
    SELECT COUNT(*) INTO good_idx_count 
    FROM information_schema.statistics 
    WHERE table_schema = DATABASE() 
    AND table_name = 'receipt_sequences' 
    AND index_name = 'UK_school_year_type';

    IF good_idx_count > 0 THEN
        ALTER TABLE receipt_sequences DROP INDEX UK_school_year_type;
    END IF;

    -- 3. Create the correct composite unique index
    ALTER TABLE receipt_sequences ADD UNIQUE INDEX UK_school_year_type (school_code, academic_year_id, sequence_type);
    
END //

DELIMITER ;

CALL repair_receipt_sequence_indexes_v10();

DROP PROCEDURE repair_receipt_sequence_indexes_v10;
