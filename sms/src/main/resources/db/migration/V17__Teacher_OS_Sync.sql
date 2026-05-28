-- V17__Teacher_OS_Sync.sql
-- Drop mismatched tables if they exist
DROP TABLE IF EXISTS substitute_assignments;
DROP TABLE IF EXISTS teacher_sync_queue;

-- 1. Re-create substitute_assignments matching JPA
CREATE TABLE substitute_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_teacher_id BIGINT NOT NULL,
    substitute_teacher_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    assignment_date DATE NOT NULL,
    period_number INT NOT NULL,
    status VARCHAR(50),
    notes TEXT,
    branch_id BIGINT,
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (original_teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (substitute_teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 2. Re-create teacher_sync_queue matching JPA
CREATE TABLE teacher_sync_queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    payload_type VARCHAR(50) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(50),
    retry_count INT DEFAULT 0,
    last_attempt_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. Create attendance_sessions table
CREATE TABLE attendance_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    session_date DATE NOT NULL,
    period_number INT,
    subject_id BIGINT,
    is_locked BOOLEAN DEFAULT FALSE,
    locked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 4. Create attendance_draft table
CREATE TABLE attendance_draft (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    period_number INT,
    subject_id BIGINT,
    draft_data TEXT, -- JSON mapping student_id to status/remarks
    is_locked BOOLEAN DEFAULT FALSE,
    academic_year_id BIGINT,
    branch_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
