-- =============================================================
-- Migration: Phase A Token Architecture Refactor
-- Purpose : Alter refresh_tokens and user_sessions tables to
--           support hashed token storage, token families,
--           replay detection, and enriched session tracking.
-- Target  : MySQL (school_db)
-- Date    : 2026-05-01
-- Note    : Hibernate ddl-auto=update will handle new columns,
--           but these statements handle the renaming/dropping of
--           old columns safely in production where ddl-auto is off.
-- =============================================================

START TRANSACTION;

-- =============================================================
-- TABLE: refresh_tokens
-- Old schema: token (raw), user_id (OneToOne unique)
-- New schema: token_hash (SHA-256), token_family (UUID),
--             revoked_at (replay detection), user_id (ManyToOne)
-- =============================================================

-- Step 1: Add new columns (safe to run if column already exists via IF NOT EXISTS)
ALTER TABLE refresh_tokens
    ADD COLUMN IF NOT EXISTS token_hash  VARCHAR(255) NOT NULL DEFAULT '' AFTER id,
    ADD COLUMN IF NOT EXISTS token_family VARCHAR(255) NOT NULL DEFAULT '' AFTER token_hash,
    ADD COLUMN IF NOT EXISTS revoked_at  DATETIME(6)               AFTER expiry_date;

-- Step 2: Drop old unique index on `token` column if it exists
SET @idx_exists := (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'refresh_tokens'
      AND INDEX_NAME = 'UK_token'
);
SET @idx_sql := IF(@idx_exists > 0,
    'ALTER TABLE refresh_tokens DROP INDEX UK_token',
    'SELECT ''Index UK_token does not exist on refresh_tokens'''
);
PREPARE stmt FROM @idx_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Step 3: Drop old `token` column (raw token storage)
SET @col_exists := (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'refresh_tokens'
      AND COLUMN_NAME  = 'token'
);
SET @col_sql := IF(@col_exists > 0,
    'ALTER TABLE refresh_tokens DROP COLUMN token',
    'SELECT ''Column token does not exist on refresh_tokens'''
);
PREPARE stmt FROM @col_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Step 4: Add unique index on token_hash
SET @idx2_exists := (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'refresh_tokens'
      AND INDEX_NAME = 'UK_token_hash'
);
SET @idx2_sql := IF(@idx2_exists = 0,
    'ALTER TABLE refresh_tokens ADD UNIQUE INDEX UK_token_hash (token_hash)',
    'SELECT ''UK_token_hash already exists'''
);
PREPARE stmt FROM @idx2_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Step 5: Add index on token_family for fast family revocation
SET @idx3_exists := (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'refresh_tokens'
      AND INDEX_NAME = 'IDX_token_family'
);
SET @idx3_sql := IF(@idx3_exists = 0,
    'ALTER TABLE refresh_tokens ADD INDEX IDX_token_family (token_family)',
    'SELECT ''IDX_token_family already exists'''
);
PREPARE stmt FROM @idx3_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

COMMIT;

-- =============================================================
-- TABLE: user_sessions
-- Old schema: device_id, browser, ip_address, refresh_token (raw)
-- New schema: session_id (UUID, public API identifier),
--             refresh_token_hash, device_name, device_type,
--             browser, user_agent, ip_address, location,
--             device_fingerprint, revoked_at
-- =============================================================

START TRANSACTION;

ALTER TABLE user_sessions
    ADD COLUMN IF NOT EXISTS session_id          VARCHAR(255) NOT NULL DEFAULT ''    AFTER id,
    ADD COLUMN IF NOT EXISTS refresh_token_hash  VARCHAR(255) NOT NULL DEFAULT ''    AFTER session_id,
    ADD COLUMN IF NOT EXISTS device_name         VARCHAR(255)                        AFTER device_type,
    ADD COLUMN IF NOT EXISTS user_agent          TEXT                                AFTER browser,
    ADD COLUMN IF NOT EXISTS device_fingerprint  VARCHAR(255)                        AFTER location,
    ADD COLUMN IF NOT EXISTS revoked_at          DATETIME(6)                         AFTER last_active_at;

-- Drop old raw refresh_token column
SET @col2_exists := (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'user_sessions'
      AND COLUMN_NAME  = 'refresh_token'
);
SET @col2_sql := IF(@col2_exists > 0,
    'ALTER TABLE user_sessions DROP COLUMN refresh_token',
    'SELECT ''Column refresh_token does not exist on user_sessions'''
);
PREPARE stmt FROM @col2_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Drop old device_id column (replaced by session_id + device_name)
SET @col3_exists := (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'user_sessions'
      AND COLUMN_NAME  = 'device_id'
);
SET @col3_sql := IF(@col3_exists > 0,
    'ALTER TABLE user_sessions DROP COLUMN device_id',
    'SELECT ''Column device_id does not exist on user_sessions'''
);
PREPARE stmt FROM @col3_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Populate session_id for any existing rows (one-time migration)
UPDATE user_sessions SET session_id = UUID() WHERE session_id = '' OR session_id IS NULL;

-- Add unique index on session_id
SET @idx4_exists := (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'user_sessions'
      AND INDEX_NAME = 'UK_session_id'
);
SET @idx4_sql := IF(@idx4_exists = 0,
    'ALTER TABLE user_sessions ADD UNIQUE INDEX UK_session_id (session_id)',
    'SELECT ''UK_session_id already exists'''
);
PREPARE stmt FROM @idx4_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add index on refresh_token_hash for fast session lookup on rotation
SET @idx5_exists := (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'user_sessions'
      AND INDEX_NAME = 'IDX_refresh_token_hash'
);
SET @idx5_sql := IF(@idx5_exists = 0,
    'ALTER TABLE user_sessions ADD INDEX IDX_refresh_token_hash (refresh_token_hash)',
    'SELECT ''IDX_refresh_token_hash already exists'''
);
PREPARE stmt FROM @idx5_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

COMMIT;

-- =============================================================
-- Verification
-- =============================================================
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('refresh_tokens', 'user_sessions')
ORDER BY TABLE_NAME, ORDINAL_POSITION;
