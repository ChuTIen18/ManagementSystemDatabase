-- ============================================================================
-- Coffee House Management System - Database Schema
-- Database: coffee_house
-- MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS coffee_house;
USE coffee_house;

-- ============================================================================
-- MODULE 1: USER MANAGEMENT (5 tables)
-- ============================================================================

-- USERS Table
CREATE TABLE USERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('staff', 'pos', 'manager') NOT NULL,
    position VARCHAR(100),
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- SCHEDULES Table
CREATE TABLE SCHEDULES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    shift_type ENUM('morning', 'lunch', 'afternoon', 'evening') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    UNIQUE KEY unique_schedule (user_id, date, shift_type),
    INDEX idx_user_date (user_id, date)
);

-- ATTENDANCE Table
CREATE TABLE ATTENDANCE (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    schedule_id INT,
    check_in TIMESTAMP NOT NULL,
    check_out TIMESTAMP NULL,
    fingerprint_data TEXT,
    is_late BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (schedule_id) REFERENCES SCHEDULES(id),
    INDEX idx_user_date (user_id, DATE(check_in)),
    INDEX idx_check_in (check_in)
);

-- LEAVE_REQUESTS Table
CREATE TABLE LEAVE_REQUESTS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (approved_by) REFERENCES USERS(id),
    INDEX idx_user_date (user_id, start_date)
);

-- SALARY Table
CREATE TABLE SALARY (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    total_hours DECIMAL(10, 2) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    bonus DECIMAL(15, 2) DEFAULT 0,
    deductions DECIMAL(15, 2) DEFAULT 0,
    net_salary DECIMAL(15, 2) NOT NULL,
    paid_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    UNIQUE KEY unique_salary (user_id, month, year),
    INDEX idx_user_month (user_id, month, year),
    INDEX idx_paid_at (paid_at)
);

-- ============================================================================
-- MODULE 2: ORDERS (3 tables)
-- ============================================================================

-- TABLES Table
CREATE TABLE TABLES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INT NOT NULL,
    status ENUM('available', 'occupied', 'reserved') DEFAULT 'available',
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- ORDERS Table
CREATE TABLE ORDERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    table_id INT,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    order_type ENUM('dine_in', 'takeaway', 'delivery') NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'transfer'),
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    total_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    final_amount DECIMAL(15, 2) DEFAULT 0,
    promotion_id INT,
    created_by INT NOT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES TABLES(id),
    FOREIGN KEY (created_by) REFERENCES USERS(id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_table_id (table_id)
);

-- ORDER_ITEMS Table
CREATE TABLE ORDER_ITEMS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'served') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES ORDERS(id),
    INDEX idx_order_id (order_id)
);

-- ============================================================================
-- MODULE 3: MENU (1 table)
-- ============================================================================

CREATE TABLE MENU_ITEMS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    category ENUM('coffee', 'tea', 'smoothie', 'food', 'other') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    description TEXT,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_available (is_available)
);

-- ============================================================================
-- MODULE 4: INVENTORY (3 tables)
-- ============================================================================

CREATE TABLE SUPPLIERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    tax_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
);

CREATE TABLE STOCK (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 3) DEFAULT 0,
    min_quantity DECIMAL(10, 3) DEFAULT 0,
    supplier_id INT,
    cost_per_unit DECIMAL(10, 2),
    last_restocked TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES SUPPLIERS(id),
    INDEX idx_quantity (quantity),
    INDEX idx_min_quantity (min_quantity)
);

CREATE TABLE STOCK_TRANSACTIONS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stock_id INT NOT NULL,
    transaction_type ENUM('in', 'out', 'adjustment') NOT NULL,
    quantity DECIMAL(10, 3) NOT NULL,
    unit_price DECIMAL(10, 2),
    total_cost DECIMAL(15, 2),
    reason TEXT,
    performed_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES STOCK(id),
    FOREIGN KEY (performed_by) REFERENCES USERS(id),
    INDEX idx_stock_id (stock_id),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- MODULE 5: EQUIPMENT (1 table)
-- ============================================================================

CREATE TABLE EQUIPMENT (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    purchase_date DATE,
    warranty_expiry DATE,
    last_maintenance DATE,
    status ENUM('working', 'maintenance', 'broken') DEFAULT 'working',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- ============================================================================
-- MODULE 6: FEEDBACK (2 tables)
-- ============================================================================

CREATE TABLE POS_FEEDBACK (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feedback_type ENUM('stock_shortage', 'equipment_issue', 'staff_shortage') NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
    created_by INT NOT NULL,
    resolved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES USERS(id),
    FOREIGN KEY (resolved_by) REFERENCES USERS(id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE FEEDBACK (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL UNIQUE,
    overall_rating INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    service_rating INT CHECK (service_rating >= 1 AND service_rating <= 5),
    quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
    ambiance_rating INT CHECK (ambiance_rating >= 1 AND ambiance_rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES ORDERS(id),
    INDEX idx_overall_rating (overall_rating),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- MODULE 7: PROMOTIONS (1 table)
-- ============================================================================

CREATE TABLE PROMOTIONS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(15, 2),
    max_discount_amount DECIMAL(15, 2),
    applicable_items JSON,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES USERS(id),
    INDEX idx_is_active (is_active),
    INDEX idx_start_end_date (start_date, end_date)
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update STOCK.quantity after STOCK_TRANSACTIONS insert
DELIMITER //
CREATE TRIGGER update_stock_after_transaction AFTER INSERT ON STOCK_TRANSACTIONS
FOR EACH ROW
BEGIN
    IF NEW.transaction_type = 'in' THEN
        UPDATE STOCK SET quantity = quantity + NEW.quantity WHERE id = NEW.stock_id;
    ELSEIF NEW.transaction_type = 'out' THEN
        UPDATE STOCK SET quantity = quantity - NEW.quantity WHERE id = NEW.stock_id;
    ELSEIF NEW.transaction_type = 'adjustment' THEN
        UPDATE STOCK SET quantity = quantity + NEW.quantity WHERE id = NEW.stock_id;
    END IF;
END //
DELIMITER ;

-- Trigger: Set ORDERS.completed_at when status = 'completed'
DELIMITER //
CREATE TRIGGER set_order_completed_at BEFORE UPDATE ON ORDERS
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        SET NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
END //
DELIMITER ;

-- Trigger: Update TABLE status when new ORDER created
DELIMITER //
CREATE TRIGGER update_table_status_on_order AFTER INSERT ON ORDERS
FOR EACH ROW
BEGIN
    IF NEW.table_id IS NOT NULL THEN
        UPDATE TABLES SET status = 'occupied' WHERE id = NEW.table_id AND status != 'occupied';
    END IF;
END //
DELIMITER ;

-- Trigger: Free TABLE when ORDER completed
DELIMITER //
CREATE TRIGGER free_table_on_order_complete AFTER UPDATE ON ORDERS
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.table_id IS NOT NULL THEN
        UPDATE TABLES SET status = 'available' WHERE id = NEW.table_id;
    END IF;
END //
DELIMITER ;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Daily Revenue
CREATE VIEW daily_revenue AS
SELECT
    CURDATE() AS order_date,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(CASE WHEN o.payment_status = 'paid' THEN o.final_amount ELSE 0 END) AS total_revenue,
    SUM(o.discount_amount) AS total_discount,
    AVG(f.overall_rating) AS avg_rating
FROM ORDERS o
LEFT JOIN FEEDBACK f ON o.id = f.order_id
WHERE DATE(o.created_at) = CURDATE() AND o.status = 'completed'
GROUP BY DATE(o.created_at);

-- View: Low Stock Alert
CREATE VIEW low_stock_alert AS
SELECT
    s.id,
    s.name,
    s.quantity,
    s.min_quantity,
    s.unit,
    sup.name AS supplier_name,
    sup.phone AS supplier_phone
FROM STOCK s
LEFT JOIN SUPPLIERS sup ON s.supplier_id = sup.id
WHERE s.quantity <= s.min_quantity AND s.min_quantity > 0;

-- View: Top Selling Items
CREATE VIEW top_selling_items AS
SELECT
    m.id,
    m.name,
    m.category,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.subtotal) AS total_revenue,
    ROUND(AVG(m.price), 2) AS avg_price
FROM MENU_ITEMS m
JOIN ORDER_ITEMS oi ON m.id = oi.menu_item_id
JOIN ORDERS o ON oi.order_id = o.id
WHERE DATE(o.created_at) = CURDATE() AND o.status = 'completed'
GROUP BY m.id, m.name, m.category
ORDER BY total_quantity_sold DESC;

-- View: Customer Satisfaction
CREATE VIEW customer_satisfaction AS
SELECT
    ROUND(AVG(overall_rating), 2) AS avg_overall_rating,
    ROUND(AVG(service_rating), 2) AS avg_service_rating,
    ROUND(AVG(quality_rating), 2) AS avg_quality_rating,
    ROUND(AVG(ambiance_rating), 2) AS avg_ambiance_rating,
    COUNT(*) AS total_feedback
FROM FEEDBACK
WHERE DATE(created_at) = CURDATE();

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

-- Procedure: Create New Order (with order_number generation)
DELIMITER //
CREATE PROCEDURE create_new_order(
    IN p_table_id INT,
    IN p_customer_name VARCHAR(255),
    IN p_customer_phone VARCHAR(20),
    IN p_order_type VARCHAR(50),
    IN p_created_by INT,
    OUT p_order_id INT,
    OUT p_order_number VARCHAR(20)
)
BEGIN
    DECLARE next_seq INT;

    -- Get next sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, 4) AS UNSIGNED)), 0) + 1
    INTO next_seq FROM ORDERS;

    SET p_order_number = CONCAT('INV', LPAD(next_seq, 6, '0'));

    INSERT INTO ORDERS (
        order_number, table_id, customer_name, customer_phone,
        order_type, created_by
    ) VALUES (
        p_order_number, p_table_id, p_customer_name, p_customer_phone,
        p_order_type, p_created_by
    );

    SET p_order_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- Procedure: Calculate Monthly Salary
DELIMITER //
CREATE PROCEDURE calculate_monthly_salary(
    IN p_user_id INT,
    IN p_month INT,
    IN p_year INT
)
BEGIN
    DECLARE total_hrs DECIMAL(10, 2);
    DECLARE base_sal DECIMAL(15, 2);

    -- Calculate total hours worked
    SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, a.check_in, a.check_out)), 0)
    INTO total_hrs
    FROM ATTENDANCE a
    JOIN SCHEDULES s ON a.schedule_id = s.id
    WHERE a.user_id = p_user_id
    AND MONTH(s.date) = p_month
    AND YEAR(s.date) = p_year;

    -- Get hourly rate
    SELECT hourly_rate INTO base_sal FROM USERS WHERE id = p_user_id;
    SET base_sal = total_hrs * base_sal;

    -- Insert or update salary record
    INSERT INTO SALARY (user_id, month, year, total_hours, base_salary, net_salary)
    VALUES (p_user_id, p_month, p_year, total_hrs, base_sal, base_sal)
    ON DUPLICATE KEY UPDATE
    total_hours = total_hrs,
    base_salary = base_sal,
    net_salary = base_sal;
END //
DELIMITER ;

-- ============================================================================
-- SEED DATA (Optional)
-- ============================================================================

-- Insert sample users
INSERT INTO USERS (email, password_hash, full_name, phone, role, position, hourly_rate) VALUES
('manager@coffee.local', '$2b$10$YourHashedPasswordHere', 'Nguyễn Văn A', '0912345678', 'manager', 'Manager', 15000),
('pos@coffee.local', '$2b$10$YourHashedPasswordHere', 'Trần Thị B', '0912345679', 'pos', 'Cashier', 10000),
('staff@coffee.local', '$2b$10$YourHashedPasswordHere', 'Lê Văn C', '0912345680', 'staff', 'Barista', 8000);

-- Insert sample tables
INSERT INTO TABLES (table_number, capacity) VALUES
('B01', 2), ('B02', 2), ('B03', 4), ('B04', 4), ('B05', 6);

-- Insert sample menu items
INSERT INTO MENU_ITEMS (name, category, price, cost, description) VALUES
('Espresso', 'coffee', 25000, 10000, 'Single shot espresso'),
('Cappuccino', 'coffee', 35000, 15000, 'Espresso with steamed milk'),
('Iced Coffee', 'coffee', 30000, 12000, 'Cold brewed coffee'),
('Green Tea', 'tea', 20000, 8000, 'Fresh green tea'),
('Mango Smoothie', 'smoothie', 40000, 18000, 'Fresh mango smoothie'),
('Croissant', 'food', 35000, 12000, 'Butter croissant'),
('Sandwich', 'food', 50000, 20000, 'Grilled cheese sandwich');

-- Insert sample suppliers
INSERT INTO SUPPLIERS (name, contact_person, phone, email) VALUES
('Coffee Supplier A', 'John Doe', '0987654321', 'supplier@coffee.local'),
('Food Supplier B', 'Jane Smith', '0987654322', 'food@supplier.local');

-- Insert sample stock
INSERT INTO STOCK (name, unit, quantity, min_quantity, supplier_id, cost_per_unit) VALUES
('Coffee Beans', 'kg', 50, 10, 1, 250000),
('Milk', 'liter', 30, 5, 1, 35000),
('Sugar', 'kg', 20, 5, 2, 15000),
('Bread', 'piece', 100, 20, 2, 5000);

COMMIT;
