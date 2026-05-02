import pool from '../infrastructure/database.js';

export const menuService = {
    // Get all menu items
    async getAllMenuItems(filters?: { category?: string; availableOnly?: boolean }) {
        try {
            const connection = await pool.getConnection();
            let query = 'SELECT * FROM MENU_ITEMS WHERE 1=1';
            const params: any[] = [];

            if (filters?.category) {
                query += ' AND category = ?';
                params.push(filters.category);
            }

            if (filters?.availableOnly) {
                query += ' AND is_available = TRUE';
            }

            query += ' ORDER BY category, name';

            const [rows] = await connection.query(query, params);
            connection.release();

            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Get menu item by ID
    async getMenuItemById(itemId: number) {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT * FROM MENU_ITEMS WHERE id = ?',
                [itemId]
            );

            connection.release();

            const item = (rows as any[])[0];

            if (!item) {
                throw new Error('MENU_ITEM_NOT_FOUND');
            }

            return item;
        } catch (error) {
            throw error;
        }
    },

    // Create menu item
    async createMenuItem(data: {
        name: string;
        category: string;
        price: number;
        cost?: number;
        description?: string;
        imageUrl?: string;
    }) {
        try {
            const connection = await pool.getConnection();

            const result = await connection.query(
                `INSERT INTO MENU_ITEMS (name, category, price, cost, description, image_url)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.name,
                    data.category,
                    data.price,
                    data.cost || null,
                    data.description || null,
                    data.imageUrl || null,
                ]
            );

            const itemId = (result[0] as any).insertId;
            connection.release();

            return this.getMenuItemById(itemId);
        } catch (error) {
            throw error;
        }
    },

    // Update menu item
    async updateMenuItem(itemId: number, data: Partial<any>) {
        try {
            const connection = await pool.getConnection();

            const updateFields = [];
            const updateValues = [];

            for (const [key, value] of Object.entries(data)) {
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }

            updateValues.push(itemId);

            await connection.query(
                `UPDATE MENU_ITEMS SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                updateValues
            );

            connection.release();

            return this.getMenuItemById(itemId);
        } catch (error) {
            throw error;
        }
    },

    // Toggle availability
    async toggleAvailability(itemId: number) {
        try {
            const connection = await pool.getConnection();

            const item = await this.getMenuItemById(itemId);

            await connection.query(
                'UPDATE MENU_ITEMS SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [!item.is_available, itemId]
            );

            connection.release();

            return this.getMenuItemById(itemId);
        } catch (error) {
            throw error;
        }
    },

    // Delete menu item
    async deleteMenuItem(itemId: number) {
        try {
            const connection = await pool.getConnection();

            await connection.query('DELETE FROM MENU_ITEMS WHERE id = ?', [itemId]);

            connection.release();

            return { success: true };
        } catch (error) {
            throw error;
        }
    },
};
