CREATE TABLE scheduled_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(100) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    recipients VARCHAR(255) NOT NULL,
    export_format VARCHAR(10) NOT NULL,
    branch_id BIGINT,
    created_by BIGINT,
    next_run_at DATETIME,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
