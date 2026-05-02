-- ============================================================================
-- Coffee House Management System - Setup Test Users
-- Password for all accounts: 123456
-- Hash: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.bzQy5qFm
-- ============================================================================

USE coffee_house;

-- Xóa users cũ
DELETE FROM USERS WHERE email IN (
    'manager@coffee.local',
    'pos@coffee.local',
    'staff@coffee.local',
    'admin@coffee.local',
    'demo@coffee.local'
);

-- Tạo 3 users với password: 123456
INSERT INTO USERS (email, password_hash, full_name, phone, role, position, hourly_rate, is_active, created_at) VALUES
(
    'manager@coffee.local',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.bzQy5qFm',
    'Nguyễn Văn Manager',
    '0912345678',
    'manager',
    'Manager',
    15000,
    TRUE,
    CURRENT_TIMESTAMP
),
(
    'pos@coffee.local',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.bzQy5qFm',
    'Trần Thị POS',
    '0912345679',
    'pos',
    'Cashier',
    10000,
    TRUE,
    CURRENT_TIMESTAMP
),
(
    'staff@coffee.local',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.bzQy5qFm',
    'Lê Văn Staff',
    '0912345680',
    'staff',
    'Barista',
    8000,
    TRUE,
    CURRENT_TIMESTAMP
);

-- Verify
SELECT id, email, role, full_name, is_active FROM USERS;

COMMIT;
