import pool from '../infrastructure/database.js';

export const tablesService = {
    // Get all tables
    async getAllTables() {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT * FROM TABLES ORDER BY table_number'
            );

            connection.release();

            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Get table by ID
    async getTableById(tableId: number) {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query('SELECT * FROM TABLES WHERE id = ?', [tableId]);

            connection.release();

            const table = (rows as any[])[0];

            if (!table) {
                throw new Error('TABLE_NOT_FOUND');
            }

            return table;
        } catch (error) {
            throw error;
        }
    },

    // Generate QR code for table
    generateQRCode(tableNumber: string): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `COFFEE-T${tableNumber}-${timestamp}-${random}`;
    },

    // Create table
    async createTable(data: { tableNumber: string; capacity: number; qrCode?: string }) {
        try {
            const connection = await pool.getConnection();

            // Auto-generate QR code if not provided
            const qrCode = data.qrCode || this.generateQRCode(data.tableNumber);

            const result = await connection.query(
                `INSERT INTO TABLES (table_number, capacity, qr_code)
                 VALUES (?, ?, ?)`,
                [data.tableNumber, data.capacity, qrCode]
            );

            const tableId = (result[0] as any).insertId;
            connection.release();

            return this.getTableById(tableId);
        } catch (error) {
            throw error;
        }
    },

    // Update table
    async updateTable(tableId: number, data: Partial<any>) {
        try {
            const connection = await pool.getConnection();

            const updateFields = [];
            const updateValues = [];

            for (const [key, value] of Object.entries(data)) {
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }

            updateValues.push(tableId);

            await connection.query(
                `UPDATE TABLES SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                updateValues
            );

            connection.release();

            return this.getTableById(tableId);
        } catch (error) {
            throw error;
        }
    },

    // Get available tables
    async getAvailableTables() {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                "SELECT * FROM TABLES WHERE status = 'available' ORDER BY table_number"
            );

            connection.release();

            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Delete table
    async deleteTable(tableId: number) {
        try {
            const connection = await pool.getConnection();

            await connection.query('DELETE FROM TABLES WHERE id = ?', [tableId]);

            connection.release();

            return { success: true };
        } catch (error) {
            throw error;
        }
    },
};
