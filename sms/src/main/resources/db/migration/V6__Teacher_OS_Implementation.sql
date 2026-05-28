-- 1. ATTENDANCE TEMPLATES
CREATE TABLE attendance_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    template_data TEXT, -- JSON mapping student_id to status
    is_system_template BOOLEAN DEFAULT FALSE,
    branch_id BIGINT,
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id)
);

-- 2. CLASS DIARY (Daily Execution Register)
CREATE TABLE class_diary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    period_number INT,
    topics_covered TEXT,
    homework_assigned TEXT,
    behavior_note VARCHAR(255),
    announcements TEXT,
    resources_used VARCHAR(255),
    branch_id BIGINT,
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 3. LESSON PLANS (Strategic Academic Delivery)
CREATE TABLE lesson_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    week_number INT,
    planned_date DATE,
    completion_status VARCHAR(50), -- PLANNED, IN_PROGRESS, COMPLETED
    completion_percentage INT DEFAULT 0,
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id)
);

-- 4. EXAM PAPERS (Secure Asset Vault)
CREATE TABLE exam_papers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    exam_type VARCHAR(50), -- MIDTERM, FINAL, QUIZ
    file_path VARCHAR(255),
    answer_key_path VARCHAR(255),
    unlock_at TIMESTAMP, -- Controlled access
    is_locked BOOLEAN DEFAULT TRUE,
    branch_id BIGINT,
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id)
);

-- 5. TIMETABLES (Navigation OS)
CREATE TABLE timetables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    class_room_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL, -- MONDAY, TUESDAY etc
    period_number INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    is_break BOOLEAN DEFAULT FALSE,
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_room_id) REFERENCES class_rooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 6. SUBSTITUTE ASSIGNMENTS (Operational Continuity)
CREATE TABLE substitute_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_teacher_id BIGINT NOT NULL,
    substitute_teacher_id BIGINT NOT NULL,
    timetable_id BIGINT NOT NULL,
    assignment_date DATE NOT NULL,
    status VARCHAR(50), -- ASSIGNED, COMPLETED, CANCELLED
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (original_teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (substitute_teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (timetable_id) REFERENCES timetables(id)
);

-- 7. TEACHER SYNC QUEUE (Offline-First Architecture)
CREATE TABLE teacher_sync_queue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    module_name VARCHAR(50), -- ATTENDANCE, DIARY, MARKS
    payload TEXT, -- JSON data
    status VARCHAR(50), -- PENDING, SYNCED, FAILED
    retry_count INT DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
