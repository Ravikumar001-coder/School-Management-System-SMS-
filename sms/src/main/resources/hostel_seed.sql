SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE mess_payments;
TRUNCATE TABLE mess_billing;
TRUNCATE TABLE meal_attendance;
TRUNCATE TABLE hostel_attendance_logs;
TRUNCATE TABLE hostel_attendance;
TRUNCATE TABLE hostel_allocations;
TRUNCATE TABLE mess_plans;
TRUNCATE TABLE hostel_beds;
TRUNCATE TABLE hostel_rooms;
TRUNCATE TABLE hostel_floors;
TRUNCATE TABLE hostel_blocks;

SET FOREIGN_KEY_CHECKS = 1;

-- Get primary branch ID
SET @branch_id = (SELECT id FROM branches WHERE code = 'MAIN' LIMIT 1);
SET @branch_id = IFNULL(@branch_id, 1);

-- Get current academic year
SET @academic_year_id = (SELECT id FROM academic_years WHERE is_current = 1 LIMIT 1);
SET @academic_year_id = IFNULL(@academic_year_id, 1);

-- Get warden user (A teacher)
SET @warden_id = (SELECT id FROM users WHERE role = 'TEACHER' LIMIT 1);
SET @warden_id = IFNULL(@warden_id, 1);

-- Get a student
SET @student_id = (SELECT id FROM students LIMIT 1);
SET @student_id = IFNULL(@student_id, 1);

-- Insert Hostel Blocks
INSERT INTO hostel_blocks (branch_id, academic_year_id, warden_id, block_name, block_code, gender_type, status, building_type, capacity, total_floors, emergency_contact, rfid_enabled, biometric_enabled, mess_attached, created_at, updated_at)
VALUES 
(@branch_id, @academic_year_id, @warden_id, 'A-Wing Boys', 'A-BOYS', 'BOYS', 'ACTIVE', 'OWNED', 50, 2, '9998887776', 1, 1, 1, NOW(), NOW()),
(@branch_id, @academic_year_id, @warden_id, 'B-Wing Girls', 'B-GIRLS', 'GIRLS', 'ACTIVE', 'OWNED', 50, 2, '9998887777', 1, 1, 1, NOW(), NOW());

SET @block_a = (SELECT id FROM hostel_blocks WHERE block_code = 'A-BOYS' LIMIT 1);
SET @block_b = (SELECT id FROM hostel_blocks WHERE block_code = 'B-GIRLS' LIMIT 1);

-- Insert Floors
INSERT INTO hostel_floors (block_id, floor_name, floor_number)
VALUES 
(@block_a, 'Ground Floor', 0),
(@block_a, 'First Floor', 1),
(@block_b, 'Ground Floor', 0),
(@block_b, 'First Floor', 1);

SET @floor_a_g = (SELECT id FROM hostel_floors WHERE block_id = @block_a AND floor_number = 0 LIMIT 1);
SET @floor_a_1 = (SELECT id FROM hostel_floors WHERE block_id = @block_a AND floor_number = 1 LIMIT 1);
SET @floor_b_g = (SELECT id FROM hostel_floors WHERE block_id = @block_b AND floor_number = 0 LIMIT 1);

-- Insert Rooms
INSERT INTO hostel_rooms (floor_id, room_number, room_type, capacity, available_beds, has_attached_bath, has_wifi, status, created_at, updated_at, version)
VALUES
(@floor_a_g, '101', 'AC', 2, 1, 1, 1, 'AVAILABLE', NOW(), NOW(), 0),
(@floor_a_g, '102', 'NON_AC', 3, 3, 1, 1, 'AVAILABLE', NOW(), NOW(), 0),
(@floor_a_1, '201', 'AC', 2, 2, 1, 1, 'AVAILABLE', NOW(), NOW(), 0),
(@floor_b_g, 'G-101', 'AC', 2, 2, 1, 1, 'AVAILABLE', NOW(), NOW(), 0);

SET @room_101 = (SELECT id FROM hostel_rooms WHERE room_number = '101' LIMIT 1);
SET @room_102 = (SELECT id FROM hostel_rooms WHERE room_number = '102' LIMIT 1);
SET @room_201 = (SELECT id FROM hostel_rooms WHERE room_number = '201' LIMIT 1);
SET @room_g101 = (SELECT id FROM hostel_rooms WHERE room_number = 'G-101' LIMIT 1);

-- Insert Beds
INSERT INTO hostel_beds (room_id, bed_number, is_occupied, status, created_at, updated_at, version)
VALUES
(@room_101, 'Bed 1', 1, 'OCCUPIED', NOW(), NOW(), 0),
(@room_101, 'Bed 2', 0, 'AVAILABLE', NOW(), NOW(), 0),
(@room_102, 'Bed 1', 0, 'AVAILABLE', NOW(), NOW(), 0),
(@room_102, 'Bed 2', 0, 'AVAILABLE', NOW(), NOW(), 0),
(@room_102, 'Bed 3', 0, 'AVAILABLE', NOW(), NOW(), 0),
(@room_201, 'Bed 1', 0, 'AVAILABLE', NOW(), NOW(), 0),
(@room_201, 'Bed 2', 0, 'AVAILABLE', NOW(), NOW(), 0),
(@room_g101, 'Bed 1', 0, 'AVAILABLE', NOW(), NOW(), 0),
(@room_g101, 'Bed 2', 0, 'AVAILABLE', NOW(), NOW(), 0);

SET @occupied_bed = (SELECT id FROM hostel_beds WHERE is_occupied = 1 LIMIT 1);

-- Insert Mess Plans
INSERT INTO mess_plans (branch_id, plan_name, plan_type, status, monthly_rate, daily_rate, breakfast_cost, lunch_cost, dinner_cost, created_at, updated_at)
VALUES
(@branch_id, 'Standard Veg', 'VEG', 'ACTIVE', 3000.00, 100.00, 25.00, 40.00, 35.00, NOW(), NOW()),
(@branch_id, 'Premium Non-Veg', 'NON_VEG', 'ACTIVE', 4500.00, 150.00, 35.00, 60.00, 55.00, NOW(), NOW());

SET @mess_plan = (SELECT id FROM mess_plans LIMIT 1);

-- Insert Allocation
INSERT INTO hostel_allocations (student_id, bed_id, academic_year_id, mess_plan_id, allocation_date, expected_checkout_date, allocated_by, status, allocation_type, admin_approval, parent_consent, guardian_approval, locker_assigned, rfid_card_assigned, transport_linked, created_at, updated_at)
VALUES
(@student_id, @occupied_bed, @academic_year_id, @mess_plan, CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 1 YEAR), @warden_id, 'ACTIVE', 'REGULAR', 1, 1, 0, 1, 1, 0, NOW(), NOW());
