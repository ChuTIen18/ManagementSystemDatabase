-- Migration: repair_inventory_equipment.sql
-- Purpose: add missing columns and helper tables/views so backend services match schema
-- Run: mysql -u root -p coffee_house < docs/db_migrations/repair_inventory_equipment.sql

START TRANSACTION;

-- 1) Add columns to EQUIPMENT used by backend services
ALTER TABLE EQUIPMENT
    ADD COLUMN equipment_type VARCHAR(100) NULL,
    ADD COLUMN purchase_cost DECIMAL(15,2) NULL,
    ADD COLUMN location VARCHAR(255) NULL,
    ADD COLUMN last_maintained_at TIMESTAMP NULL,
    ADD COLUMN last_maintained_by INT NULL;

-- 2) Create MAINTENANCE_LOGS if not exists (backend inserts into this table)
CREATE TABLE IF NOT EXISTS MAINTENANCE_LOGS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,
    cost DECIMAL(15,2) DEFAULT 0,
    performed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES EQUIPMENT(id)
);

-- 3) Provide INVENTORY view mapped to STOCK so older code using INVENTORY works
DROP VIEW IF EXISTS INVENTORY;
CREATE VIEW INVENTORY AS
SELECT
    id,
    name AS item_name,
    quantity,
    unit,
    min_quantity,
    supplier_id AS supplier,
    cost_per_unit,
    created_at,
    updated_at
FROM STOCK;

-- 4) Create INVENTORY_LOGS used by backend inventory service
CREATE TABLE IF NOT EXISTS INVENTORY_LOGS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventory_id INT NOT NULL,
    transaction_type ENUM('ADD','REMOVE','ADJUST') NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES STOCK(id)
);

COMMIT;

-- End of migration
