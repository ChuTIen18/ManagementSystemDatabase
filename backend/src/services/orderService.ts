import pool from '../infrastructure/database.js';

export const orderService = {
    // Get all orders
    async getAllOrders(filters?: {
        status?: string;
        date?: string;
        limit?: number;
        offset?: number;
    }) {
        try {
            const connection = await pool.getConnection();
            let query = 'SELECT * FROM ORDERS WHERE 1=1';
            const params: any[] = [];

            if (filters?.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }

            if (filters?.date) {
                query += ' AND DATE(created_at) = ?';
                params.push(filters.date);
            }

            query += ' ORDER BY created_at DESC';

            if (filters?.limit) {
                query += ' LIMIT ? OFFSET ?';
                params.push(filters.limit, filters.offset || 0);
            }

            const [rows] = await connection.query(query, params);
            connection.release();

            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Get order by ID
    async getOrderById(orderId: number) {
        try {
            const connection = await pool.getConnection();

            const [orderRows] = await connection.query(
                'SELECT * FROM ORDERS WHERE id = ?',
                [orderId]
            );

            const order = (orderRows as any[])[0];

            if (!order) {
                connection.release();
                throw new Error('ORDER_NOT_FOUND');
            }

            // Get order items
            const [itemsRows] = await connection.query(
                `SELECT oi.*, mi.name, mi.category FROM ORDER_ITEMS oi
                 JOIN MENU_ITEMS mi ON oi.menu_item_id = mi.id
                 WHERE oi.order_id = ?`,
                [orderId]
            );

            connection.release();

            return {
                ...order,
                items: itemsRows,
            };
        } catch (error) {
            throw error;
        }
    },

    // Create order using stored procedure
    async createOrder(
        tableId: number | null,
        customerName: string | null,
        customerPhone: string | null,
        orderType: string,
        createdBy: number
    ) {
        try {
            const connection = await pool.getConnection();

            const [result] = await connection.query(
                `CALL create_new_order(?, ?, ?, ?, ?, @order_id, @order_number)`,
                [tableId, customerName, customerPhone, orderType, createdBy]
            );

            // Get the generated order_id and order_number
            const [vars] = await connection.query(
                'SELECT @order_id as order_id, @order_number as order_number'
            );

            connection.release();

            return (vars as any[])[0];
        } catch (error) {
            throw error;
        }
    },

    // Update order status
    async updateOrderStatus(orderId: number, status: string) {
        try {
            const connection = await pool.getConnection();

            await connection.query(
                'UPDATE ORDERS SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [status, orderId]
            );

            connection.release();

            return this.getOrderById(orderId);
        } catch (error) {
            throw error;
        }
    },

    // Add item to order
    async addOrderItem(
        orderId: number,
        menuItemId: number,
        quantity: number,
        unitPrice: number,
        notes?: string
    ) {
        try {
            const connection = await pool.getConnection();

            const subtotal = quantity * unitPrice;

            await connection.query(
                `INSERT INTO ORDER_ITEMS (order_id, menu_item_id, quantity, unit_price, subtotal, notes)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, menuItemId, quantity, unitPrice, subtotal, notes]
            );

            // Update order total
            const [totals] = await connection.query(
                'SELECT SUM(subtotal) as total FROM ORDER_ITEMS WHERE order_id = ?',
                [orderId]
            );

            const total = (totals as any[])[0].total || 0;

            await connection.query(
                'UPDATE ORDERS SET total_amount = ? WHERE id = ?',
                [total, orderId]
            );

            connection.release();

            return { success: true, orderId };
        } catch (error) {
            throw error;
        }
    },

    // Remove item from order
    async removeOrderItem(orderId: number, itemId: number) {
        try {
            const connection = await pool.getConnection();

            await connection.query(
                'DELETE FROM ORDER_ITEMS WHERE id = ? AND order_id = ?',
                [itemId, orderId]
            );

            // Update order total
            const [totals] = await connection.query(
                'SELECT SUM(subtotal) as total FROM ORDER_ITEMS WHERE order_id = ?',
                [orderId]
            );

            const total = (totals as any[])[0].total || 0;

            await connection.query(
                'UPDATE ORDERS SET total_amount = ? WHERE id = ?',
                [total, orderId]
            );

            connection.release();

            return { success: true };
        } catch (error) {
            throw error;
        }
    },

    // Update payment
    async updatePayment(
        orderId: number,
        paymentMethod: string,
        paymentStatus: string
    ) {
        try {
            const connection = await pool.getConnection();

            await connection.query(
                `UPDATE ORDERS
                 SET payment_method = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [paymentMethod, paymentStatus, orderId]
            );

            connection.release();

            return this.getOrderById(orderId);
        } catch (error) {
            throw error;
        }
    },

    // Cancel order
    async cancelOrder(orderId: number) {
        try {
            const connection = await pool.getConnection();

            await connection.query(
                'UPDATE ORDERS SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                ['cancelled', orderId]
            );

            connection.release();

            return { success: true };
        } catch (error) {
            throw error;
        }
    },
};
