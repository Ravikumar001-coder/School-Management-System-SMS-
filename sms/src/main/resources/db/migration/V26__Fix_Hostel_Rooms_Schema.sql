-- Fix room_type_id in hostel_rooms to be nullable
-- V19 introduced this column as NOT NULL, but HostelRoom.java doesn't map it, causing data.sql inserts to fail.

ALTER TABLE hostel_rooms MODIFY COLUMN room_type_id BIGINT NULL;
