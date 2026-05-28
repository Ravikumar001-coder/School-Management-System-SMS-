-- V19__Finance_ERP_Foundation.sql
-- Massive Enterprise Finance & Fees ERP Implementation

-- ==========================================
-- PHASE 1: FEE STRUCTURE ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS fee_heads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., TUITION, HOSTEL, TRANSPORT, EXAM
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    taxable BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    branch_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Note: We already have fee_structures. We will alter it to add new fields safely if missing.
-- We will use the existing fee_structures table but link it to fee_heads for better granularity.
-- Wait, the requirement says fee_structures has: academic_year_id, class_id, fee_head_id, amount, billing_frequency, due_day, applicable_from, applicable_to.
-- We will rename the old fee_structures to legacy_fee_structures, and create a new robust one, or we can just alter it. 
-- Since we want accounting-grade accuracy without breaking, let's create `erp_fee_structures` to avoid conflict with the legacy one `fee_structures`.

CREATE TABLE IF NOT EXISTS erp_fee_structures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    academic_year_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    fee_head_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    billing_frequency ENUM('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL DEFAULT 'MONTHLY',
    due_day INT DEFAULT 5, -- 5th of the billing period
    applicable_from DATE,
    applicable_to DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (class_id) REFERENCES class_rooms(id),
    FOREIGN KEY (fee_head_id) REFERENCES fee_heads(id)
);

CREATE TABLE IF NOT EXISTS student_fee_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    custom_plan_name VARCHAR(100),
    effective_date DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

CREATE TABLE IF NOT EXISTS student_fee_plan_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_fee_plan_id BIGINT NOT NULL,
    fee_head_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    billing_frequency ENUM('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_fee_plan_id) REFERENCES student_fee_plans(id),
    FOREIGN KEY (fee_head_id) REFERENCES fee_heads(id)
);


-- ==========================================
-- PHASE 2: ACCOUNTING & LEDGER SYSTEM
-- ==========================================

CREATE TABLE IF NOT EXISTS student_ledgers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    total_due DECIMAL(10,2) DEFAULT 0.00,
    total_paid DECIMAL(10,2) DEFAULT 0.00,
    total_concession DECIMAL(10,2) DEFAULT 0.00,
    balance DECIMAL(10,2) DEFAULT 0.00, -- (total_due - total_paid - total_concession)
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_ledger_id BIGINT NOT NULL,
    transaction_date DATE NOT NULL,
    entry_type ENUM('INVOICE', 'PAYMENT', 'REFUND', 'DISCOUNT', 'FINE', 'LATE_FEE') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    debit_credit ENUM('DEBIT', 'CREDIT') NOT NULL, -- Debit = School gets money (Invoice), Credit = Student pays (Payment/Discount)
    reference_id BIGINT, -- Links to invoice_id, payment_id, fine_id depending on entry_type
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_ledger_id) REFERENCES student_ledgers(id)
);

-- ==========================================
-- PHASE 3: PAYMENT GATEWAY (Razorpay)
-- ==========================================

CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_no VARCHAR(100) UNIQUE NOT NULL,
    student_id BIGINT NOT NULL,
    ledger_entry_id BIGINT, -- Nullable until reconciled
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50), -- UPI, CARD, NETBANKING
    gateway_status VARCHAR(50),
    internal_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIAL_REFUND') DEFAULT 'PENDING',
    paid_at TIMESTAMP NULL,
    gateway_response TEXT,
    remarks TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (ledger_entry_id) REFERENCES ledger_entries(id)
);

CREATE TABLE IF NOT EXISTS payment_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    reference_id BIGINT, -- E.g., Invoice ID
    payment_url TEXT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    sent_via ENUM('WHATSAPP', 'SMS', 'EMAIL'),
    status ENUM('ACTIVE', 'PAID', 'EXPIRED', 'CANCELLED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS upi_qr_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    reference_id BIGINT,
    qr_payload TEXT NOT NULL,
    qr_image TEXT,
    amount DECIMAL(10,2) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'EXPIRED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);


-- ==========================================
-- PHASE 4: DISCOUNT & SCHOLARSHIP ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS discount_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('SIBLING', 'MERIT', 'STAFF_WARD', 'RTE', 'CUSTOM') NOT NULL,
    default_value DECIMAL(10,2) DEFAULT 0.00,
    calculation_method ENUM('PERCENTAGE', 'FIXED') NOT NULL,
    branch_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS student_discounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    discount_type_id BIGINT NOT NULL,
    fee_head_id BIGINT NULL, -- If null, applies to overall invoice
    amount DECIMAL(10,2) NOT NULL,
    approval_required BOOLEAN DEFAULT FALSE,
    approved_by BIGINT,
    approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
    valid_from DATE NOT NULL,
    valid_to DATE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (discount_type_id) REFERENCES discount_types(id),
    FOREIGN KEY (fee_head_id) REFERENCES fee_heads(id)
);

-- ==========================================
-- PHASE 5: AUTO LATE FEE ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS late_fee_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fee_structure_id BIGINT NOT NULL,
    grace_days INT DEFAULT 0,
    calculation_type ENUM('FLAT', 'PERCENTAGE') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    compound_enabled BOOLEAN DEFAULT FALSE,
    max_limit DECIMAL(10,2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fee_structure_id) REFERENCES erp_fee_structures(id)
);

CREATE TABLE IF NOT EXISTS late_fee_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ledger_entry_id BIGINT NOT NULL, -- Links to the Invoice entry
    rule_id BIGINT NOT NULL,
    calculated_amount DECIMAL(10,2) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    waived BOOLEAN DEFAULT FALSE,
    waived_reason TEXT,
    waived_by BIGINT,
    FOREIGN KEY (ledger_entry_id) REFERENCES ledger_entries(id),
    FOREIGN KEY (rule_id) REFERENCES late_fee_rules(id)
);

-- ==========================================
-- PHASE 6: SIBLING DETECTION ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS family_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_phone VARCHAR(20),
    parent_email VARCHAR(100),
    guardian_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_group_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    family_group_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL UNIQUE,
    relationship VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_group_id) REFERENCES family_groups(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- ==========================================
-- PHASE 7: GST SUPPORT SYSTEM
-- ==========================================

CREATE TABLE IF NOT EXISTS gst_configurations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    school_gstin VARCHAR(50) NOT NULL,
    cgst_percent DECIMAL(5,2) DEFAULT 0.00,
    sgst_percent DECIMAL(5,2) DEFAULT 0.00,
    igst_percent DECIMAL(5,2) DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS invoice_taxes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ledger_entry_id BIGINT NOT NULL, -- Link to the Invoice
    tax_type ENUM('CGST', 'SGST', 'IGST') NOT NULL,
    tax_percentage DECIMAL(5,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ledger_entry_id) REFERENCES ledger_entries(id)
);

-- ==========================================
-- PHASE 8: TRANSPORT FEE MODULE
-- ==========================================

CREATE TABLE IF NOT EXISTS transport_routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    vehicle_id VARCHAR(50),
    driver_name VARCHAR(100),
    branch_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS transport_stops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    distance_km DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES transport_routes(id)
);

CREATE TABLE IF NOT EXISTS transport_fee_slabs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    min_distance DECIMAL(5,2) NOT NULL,
    max_distance DECIMAL(5,2) NOT NULL,
    one_way_fee DECIMAL(10,2) NOT NULL,
    two_way_fee DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS student_transport_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    stop_id BIGINT NOT NULL,
    transport_type ENUM('ONE_WAY', 'TWO_WAY') NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (route_id) REFERENCES transport_routes(id),
    FOREIGN KEY (stop_id) REFERENCES transport_stops(id)
);

-- ==========================================
-- PHASE 9: HOSTEL FEE MODULE
-- ==========================================

CREATE TABLE IF NOT EXISTS hostel_room_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_type VARCHAR(50) NOT NULL, -- e.g., AC, Non-AC, 2-Bed, 4-Bed
    monthly_fee DECIMAL(10,2) NOT NULL,
    branch_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS hostel_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    room_type_id BIGINT NOT NULL,
    capacity INT NOT NULL,
    building_name VARCHAR(50),
    branch_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_type_id) REFERENCES hostel_room_types(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS hostel_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    assigned_date DATE NOT NULL,
    vacated_date DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (room_id) REFERENCES hostel_rooms(id)
);

CREATE TABLE IF NOT EXISTS mess_charges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    billing_month DATE NOT NULL, -- e.g., '2024-05-01'
    daily_rate DECIMAL(10,2) NOT NULL,
    active_days INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    ledger_entry_id BIGINT, -- Linked to the invoice
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (ledger_entry_id) REFERENCES ledger_entries(id)
);

CREATE TABLE IF NOT EXISTS security_deposits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    refundable BOOLEAN DEFAULT TRUE,
    refunded_at TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);


-- ==========================================
-- PHASE 10: FINE ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS fine_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- LIBRARY, DISCIPLINE, DAMAGE
    branch_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS student_fines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    fine_type_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    issued_by BIGINT,
    issued_date DATE NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'WAIVED') DEFAULT 'PENDING',
    ledger_entry_id BIGINT, -- The debit entry
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (fine_type_id) REFERENCES fine_types(id),
    FOREIGN KEY (ledger_entry_id) REFERENCES ledger_entries(id)
);


-- ==========================================
-- PHASE 11: AUTOMATED REMINDER ENGINE
-- ==========================================

CREATE TABLE IF NOT EXISTS reminder_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trigger_day INT NOT NULL, -- 0 (due date), 3 (3 days late), etc.
    channel ENUM('SMS', 'EMAIL', 'WHATSAPP') NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    escalation_level INT DEFAULT 1,
    branch_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS reminder_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    ledger_entry_id BIGINT, -- Linked invoice
    rule_id BIGINT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    channel ENUM('SMS', 'EMAIL', 'WHATSAPP') NOT NULL,
    delivery_status VARCHAR(50) DEFAULT 'SENT',
    error_message TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (ledger_entry_id) REFERENCES ledger_entries(id),
    FOREIGN KEY (rule_id) REFERENCES reminder_rules(id)
);

-- Done!
