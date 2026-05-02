import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let schemaBootstrapPromise: Promise<void> | null = null;

const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS ATTENDANCE (
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
        INDEX idx_user_check_in (user_id, check_in),
        INDEX idx_check_in (check_in)
    )`,
    `CREATE TABLE IF NOT EXISTS LEAVE_REQUESTS (
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
    )`,
    `CREATE TABLE IF NOT EXISTS SALARY (
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
    )`,
];

export async function ensureDatabaseSchema(): Promise<void> {
    if (schemaBootstrapPromise) {
        return schemaBootstrapPromise;
    }

    schemaBootstrapPromise = (async () => {
        const dbName = process.env.DB_NAME || 'coffee_house';
        const connectionConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
        };

        const adminConnection = await mysql.createConnection(connectionConfig);
        try {
            await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        } finally {
            await adminConnection.end();
        }

        const connection = await mysql.createConnection({
            ...connectionConfig,
            database: dbName,
        });

        try {
            for (const statement of schemaStatements) {
                await connection.query(statement);
            }
        } finally {
            await connection.end();
        }
    })();

    return schemaBootstrapPromise;
}
