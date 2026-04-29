-- Sample data for school management system
-- Keep statements commented initially to avoid startup conflicts before schema tuning.

-- =============================
-- ADMIN FIRST SETUP (manual)
-- =============================
-- 1) Generate BCrypt for ADMIN-001 and replace <BCRYPT_HASH_OF_ADMIN_001>
-- 2) Run insert once
-- INSERT INTO users(
--   first_name, last_name, email, username, password, role, enabled, first_login
-- ) VALUES (
--   'System', 'Admin', 'admin@school.com', 'ADMIN-001',
--   '<BCRYPT_HASH_OF_ADMIN_001>', 'ADMIN', 1, 0
-- );

-- INSERT INTO class_rooms(name, section) VALUES ('Grade 10', 'A');
-- INSERT INTO users(name, email, password, role) VALUES ('Admin User', 'admin@school.com', '$2a$10$7Qj9xA4V6mQJmX6QV6yB7OkA1gqf4KxXQ2l6l3Q8Xz7vWm8J8x8Pa', 'ADMIN');
-- INSERT INTO students(name, email, class_room_id) VALUES ('John Student', 'john@student.com', 1);
-- INSERT INTO teachers(name, email) VALUES ('Mary Teacher', 'mary@teacher.com');
