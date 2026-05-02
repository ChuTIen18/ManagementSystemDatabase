import pool from '../infrastructure/database.js';

export const reportsService = {
    async getDailyRevenue() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM daily_revenue');
            return (rows as any[])[0] || {
                order_date: new Date().toISOString().slice(0, 10),
                order_count: 0,
                total_revenue: 0,
                total_discount: 0,
                avg_rating: null,
            };
        } finally {
            connection.release();
        }
    },

    async getLowStockAlert() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM low_stock_alert ORDER BY quantity ASC');
            return rows;
        } finally {
            connection.release();
        }
    },

    async getTopSellingItems() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM top_selling_items LIMIT 10');
            return rows;
        } finally {
            connection.release();
        }
    },

    async getCustomerSatisfaction() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM customer_satisfaction');
            return (rows as any[])[0] || {
                avg_overall_rating: 0,
                avg_service_rating: 0,
                avg_quality_rating: 0,
                avg_ambiance_rating: 0,
                total_feedback: 0,
            };
        } finally {
            connection.release();
        }
    },

    async getSummary() {
        const connection = await pool.getConnection();
        try {
            const [orderRows]: any = await connection.query(
                `SELECT COUNT(*) AS total_orders,
                        SUM(CASE WHEN payment_status = 'paid' THEN final_amount ELSE 0 END) AS revenue,
                        SUM(discount_amount) AS total_discount,
                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders
                 FROM ORDERS`
            );

            const [feedbackRows]: any = await connection.query(
                `SELECT COUNT(*) AS total_feedback, ROUND(AVG(overall_rating), 2) AS avg_rating FROM FEEDBACK`
            );

            const [lowStockRows]: any = await connection.query(
                `SELECT COUNT(*) AS low_stock_items FROM STOCK WHERE quantity <= min_quantity`
            );

            return {
                ...orderRows[0],
                ...feedbackRows[0],
                ...lowStockRows[0],
            };
        } finally {
            connection.release();
        }
    },
};
