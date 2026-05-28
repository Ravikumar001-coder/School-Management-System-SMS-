-- Forensic Sequence Sync (V11)
-- MISSION: Synchronize receipt_sequences with existing users to prevent duplicate ID generation.
-- This script calculates the max sequence number from legacy data and updates the registry.

-- 1. Sync STUDENT_ID sequences
INSERT INTO receipt_sequences (school_code, academic_year_id, sequence_type, last_sequence, updated_at)
SELECT 
    ay.school_code,
    ay.id as academic_year_id,
    'STUDENT_ID' as sequence_type,
    COALESCE((
        -- Calculate max numeric suffix after 'STU-YYYY-' (length 9)
        SELECT MAX(CAST(SUBSTRING(username, 10) AS UNSIGNED))
        FROM users 
        WHERE username LIKE CONCAT('STU-', ay.start_year, '-%')
    ), 0) as last_sequence,
    NOW()
FROM academic_years ay
ON DUPLICATE KEY UPDATE 
last_sequence = GREATEST(receipt_sequences.last_sequence, VALUES(last_sequence)),
updated_at = NOW();

-- 2. Sync TEACHER_ID sequences
INSERT INTO receipt_sequences (school_code, academic_year_id, sequence_type, last_sequence, updated_at)
SELECT 
    ay.school_code,
    ay.id as academic_year_id,
    'TEACHER_ID' as sequence_type,
    COALESCE((
        -- Calculate max numeric suffix after 'TCH-YYYY-' (length 9)
        SELECT MAX(CAST(SUBSTRING(username, 10) AS UNSIGNED))
        FROM users 
        WHERE username LIKE CONCAT('TCH-', ay.start_year, '-%')
    ), 0) as last_sequence,
    NOW()
FROM academic_years ay
ON DUPLICATE KEY UPDATE 
last_sequence = GREATEST(receipt_sequences.last_sequence, VALUES(last_sequence)),
updated_at = NOW();
