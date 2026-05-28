-- ============================================================
-- V22__Transport_Management_Module.sql
-- Complete Transport & Smart Bus Management Schema
-- Indexes omitted to prevent conflicts with Hibernate ddl-auto=update
-- ============================================================

-- ─── Transport Routes ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transport_routes (
    id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_code                  VARCHAR(20)  NOT NULL UNIQUE,
    route_name                  VARCHAR(100) NOT NULL,
    route_type                  ENUM('MORNING','AFTERNOON','BOTH') NOT NULL,
    branch_id                   BIGINT,
    start_location              VARCHAR(200),
    end_location                VARCHAR(200),
    estimated_distance_km       DOUBLE,
    estimated_duration_minutes  INT,
    active_days                 VARCHAR(20),
    status                      ENUM('ACTIVE','INACTIVE','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    created_by                  BIGINT,
    notes                       TEXT,
    created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at                  DATETIME NULL,
    CONSTRAINT fk_tr_branch FOREIGN KEY (branch_id) REFERENCES branches(id),
    CONSTRAINT fk_tr_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ─── Route Stops ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS route_stops (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id            BIGINT NOT NULL,
    stop_name           VARCHAR(100) NOT NULL,
    stop_code           VARCHAR(20),
    stop_sequence       INT NOT NULL,
    latitude            DOUBLE,
    longitude           DOUBLE,
    pickup_time         TIME,
    drop_time           TIME,
    stop_radius_meters  INT DEFAULT 200,
    landmark            VARCHAR(200),
    student_capacity    INT DEFAULT 50,
    status              ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_rs_route FOREIGN KEY (route_id) REFERENCES transport_routes(id) ON DELETE CASCADE
);

-- ─── Vehicles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
    id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number              VARCHAR(20)  NOT NULL UNIQUE,
    registration_number         VARCHAR(30)  UNIQUE,
    vehicle_type                ENUM('BUS','VAN','MINI_BUS','EV_BUS') NOT NULL,
    brand                       VARCHAR(50),
    model                       VARCHAR(50),
    manufacture_year            INT,
    seating_capacity            INT,
    standing_capacity           INT DEFAULT 0,
    fuel_type                   VARCHAR(20),
    chassis_number              VARCHAR(50),
    engine_number               VARCHAR(50),
    gps_device_id               VARCHAR(50),
    insurance_number            VARCHAR(50),
    insurance_expiry_date       DATE,
    fitness_certificate_number  VARCHAR(50),
    fitness_expiry_date         DATE,
    pollution_certificate_expiry DATE,
    permit_expiry_date          DATE,
    rc_document_url             VARCHAR(500),
    insurance_document_url      VARCHAR(500),
    vehicle_photo               VARCHAR(500),
    branch_id                   BIGINT,
    current_status              ENUM('ACTIVE','MAINTENANCE','INACTIVE','SCRAPPED') NOT NULL DEFAULT 'ACTIVE',
    notes                       TEXT,
    created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_v_branch FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- ─── Drivers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS drivers (
    id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id                 VARCHAR(30) UNIQUE,
    first_name                  VARCHAR(50) NOT NULL,
    last_name                   VARCHAR(50) NOT NULL,
    phone                       VARCHAR(15) NOT NULL,
    alternate_phone             VARCHAR(15),
    email                       VARCHAR(100),
    address                     TEXT,
    blood_group                 VARCHAR(5),
    emergency_contact           VARCHAR(15),
    license_number              VARCHAR(30) NOT NULL UNIQUE,
    license_type                VARCHAR(20),
    license_issue_date          DATE,
    license_expiry_date         DATE,
    experience_years            INT,
    police_verification_status  VARCHAR(20) DEFAULT 'PENDING',
    medical_certificate_expiry  DATE,
    profile_photo               VARCHAR(500),
    aadhaar_number              VARCHAR(20),
    branch_id                   BIGINT,
    status                      ENUM('ACTIVE','INACTIVE','SUSPENDED','BLACKLISTED') NOT NULL DEFAULT 'ACTIVE',
    remarks                     TEXT,
    created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_d_branch FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- ─── Conductors ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conductors (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id     VARCHAR(30) UNIQUE,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    phone           VARCHAR(15) NOT NULL,
    address         TEXT,
    aadhaar_number  VARCHAR(20),
    profile_photo   VARCHAR(500),
    branch_id       BIGINT,
    status          ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_c_branch FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- ─── Vehicle Assignments ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicle_assignments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      BIGINT NOT NULL,
    route_id        BIGINT NOT NULL,
    driver_id       BIGINT,
    conductor_id    BIGINT,
    assignment_date DATE NOT NULL,
    shift_type      VARCHAR(20),
    status          ENUM('ACTIVE','INACTIVE','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_va_vehicle   FOREIGN KEY (vehicle_id)   REFERENCES vehicles(id),
    CONSTRAINT fk_va_route     FOREIGN KEY (route_id)     REFERENCES transport_routes(id),
    CONSTRAINT fk_va_driver    FOREIGN KEY (driver_id)    REFERENCES drivers(id),
    CONSTRAINT fk_va_conductor FOREIGN KEY (conductor_id) REFERENCES conductors(id)
);

-- ─── Vehicle Maintenance Logs ────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicle_maintenance_logs (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id        BIGINT NOT NULL,
    maintenance_type  VARCHAR(50) NOT NULL,
    service_date      DATE NOT NULL,
    next_service_date DATE,
    vendor_name       VARCHAR(100),
    cost              DECIMAL(10,2),
    invoice_url       VARCHAR(500),
    odometer_reading  BIGINT,
    remarks           TEXT,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vml_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- ─── Driver Route History ────────────────────────────────────
CREATE TABLE IF NOT EXISTS driver_route_history (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id     BIGINT NOT NULL,
    route_id      BIGINT NOT NULL,
    vehicle_id    BIGINT,
    assigned_from DATE NOT NULL,
    assigned_to   DATE,
    remarks       TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_drh_driver  FOREIGN KEY (driver_id)  REFERENCES drivers(id),
    CONSTRAINT fk_drh_route   FOREIGN KEY (route_id)   REFERENCES transport_routes(id),
    CONSTRAINT fk_drh_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- ─── GPS Devices ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gps_devices (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_uid       VARCHAR(50) NOT NULL UNIQUE,
    imei_number      VARCHAR(20) NOT NULL UNIQUE,
    provider_name    VARCHAR(30),
    api_key          VARCHAR(200),
    vehicle_id       BIGINT UNIQUE,
    device_status    ENUM('ACTIVE','INACTIVE','OFFLINE','FAULTY') NOT NULL DEFAULT 'ACTIVE',
    last_ping_at     DATETIME,
    battery_status   INT,
    signal_strength  INT,
    firmware_version VARCHAR(20),
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gd_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- ─── Vehicle Live Locations ───────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicle_live_locations (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      BIGINT NOT NULL,
    latitude        DOUBLE NOT NULL,
    longitude       DOUBLE NOT NULL,
    speed           DOUBLE,
    heading         DOUBLE,
    ignition_status TINYINT(1),
    recorded_at     DATETIME NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vll_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- ─── GPS Events ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gps_events (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id    BIGINT NOT NULL,
    event_type    ENUM('ROUTE_DEVIATION','OVERSPEED','IDLE','ENGINE_OFF','SOS',
                       'GEOFENCE_EXIT','GEOFENCE_ENTRY','ROUTE_STARTED','ROUTE_COMPLETED','BREAKDOWN') NOT NULL,
    latitude      DOUBLE,
    longitude     DOUBLE,
    event_time    DATETIME NOT NULL,
    severity      VARCHAR(10) DEFAULT 'INFO',
    metadata_json TEXT,
    acknowledged  TINYINT(1) DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ge_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- ─── Student Transport Assignments ───────────────────────────
CREATE TABLE IF NOT EXISTS student_transport_assignments (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id            BIGINT NOT NULL,
    route_id              BIGINT NOT NULL,
    pickup_stop_id        BIGINT,
    drop_stop_id          BIGINT,
    pickup_shift          VARCHAR(20),
    drop_shift            VARCHAR(20),
    transport_fee_plan_id BIGINT,
    assigned_date         DATE,
    status                ENUM('ACTIVE','INACTIVE','TRANSFERRED','CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    notes                 TEXT,
    created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sta_student    FOREIGN KEY (student_id)     REFERENCES students(id),
    CONSTRAINT fk_sta_route      FOREIGN KEY (route_id)       REFERENCES transport_routes(id),
    CONSTRAINT fk_sta_pickup     FOREIGN KEY (pickup_stop_id) REFERENCES route_stops(id),
    CONSTRAINT fk_sta_drop       FOREIGN KEY (drop_stop_id)   REFERENCES route_stops(id)
);

-- ─── Transport Notifications ──────────────────────────────────
CREATE TABLE IF NOT EXISTS transport_notifications (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id          BIGINT NOT NULL,
    route_id            BIGINT,
    vehicle_id          BIGINT,
    notification_type   ENUM('BOARDED','DROPPED','DELAYED','MISSED_BUS','ROUTE_CHANGED',
                             'EMERGENCY','BUS_APPROACHING','BUS_ARRIVED') NOT NULL,
    message             TEXT,
    sent_via            VARCHAR(30),
    delivery_status     VARCHAR(20) DEFAULT 'PENDING',
    sent_at             DATETIME,
    parent_acknowledged TINYINT(1) DEFAULT 0,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tn_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_tn_route   FOREIGN KEY (route_id)   REFERENCES transport_routes(id),
    CONSTRAINT fk_tn_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- ─── RFID Cards ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rfid_cards (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_uid    VARCHAR(50) NOT NULL UNIQUE,
    student_id  BIGINT UNIQUE,
    issue_date  DATE,
    expiry_date DATE,
    status      ENUM('ACTIVE','INACTIVE','EXPIRED','LOST','REPLACED') NOT NULL DEFAULT 'ACTIVE',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rc_student FOREIGN KEY (student_id) REFERENCES students(id)
);

-- ─── Bus Attendance Logs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS bus_attendance_logs (
    id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id                  BIGINT NOT NULL,
    vehicle_id                  BIGINT NOT NULL,
    route_id                    BIGINT,
    stop_id                     BIGINT,
    attendance_type             ENUM('BOARDED','ALIGHTED') NOT NULL,
    scanned_at                  DATETIME NOT NULL,
    scan_method                 ENUM('RFID','NFC','QR','MANUAL') NOT NULL,
    operator_id                 BIGINT,
    synced_to_main_attendance   TINYINT(1) DEFAULT 0,
    latitude                    DOUBLE,
    longitude                   DOUBLE,
    created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bal_student  FOREIGN KEY (student_id)  REFERENCES students(id),
    CONSTRAINT fk_bal_vehicle  FOREIGN KEY (vehicle_id)  REFERENCES vehicles(id),
    CONSTRAINT fk_bal_route    FOREIGN KEY (route_id)    REFERENCES transport_routes(id),
    CONSTRAINT fk_bal_stop     FOREIGN KEY (stop_id)     REFERENCES route_stops(id),
    CONSTRAINT fk_bal_operator FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- ─── Transport Fee Slabs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS transport_fee_slabs (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id              BIGINT NOT NULL,
    stop_id               BIGINT,
    distance_from_school  DOUBLE,
    one_way_fee           DECIMAL(10,2) NOT NULL,
    two_way_fee           DECIMAL(10,2) NOT NULL,
    academic_year_id      BIGINT NOT NULL,
    status                ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tfs_route  FOREIGN KEY (route_id)         REFERENCES transport_routes(id),
    CONSTRAINT fk_tfs_stop   FOREIGN KEY (stop_id)          REFERENCES route_stops(id),
    CONSTRAINT fk_tfs_year   FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);
