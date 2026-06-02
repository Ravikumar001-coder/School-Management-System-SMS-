DROP PROCEDURE IF EXISTS drop_alert_type_if_exists;

DELIMITER $$

CREATE PROCEDURE drop_alert_type_if_exists()
BEGIN
    IF EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'system_alerts' AND COLUMN_NAME = 'alert_type'
    ) THEN
        ALTER TABLE system_alerts DROP COLUMN alert_type;
    END IF;
END $$

DELIMITER ;

CALL drop_alert_type_if_exists();
DROP PROCEDURE drop_alert_type_if_exists;
