import pool from '../infrastructure/database.js';

export interface CustomerFeedback {
    id: number;
    order_id: number;
    overall_rating: number;
    service_rating?: number;
    quality_rating?: number;
    ambiance_rating?: number;
    comment?: string;
    created_at: string;
}

export interface CreateCustomerFeedbackInput {
    order_id: number;
    overall_rating: number;
    service_rating?: number | null;
    quality_rating?: number | null;
    ambiance_rating?: number | null;
    comment?: string | null;
}

export interface PosFeedback {
    id: number;
    feedback_type: 'stock_shortage' | 'equipment_issue' | 'staff_shortage';
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'resolved';
    created_by: number;
    resolved_by?: number;
    created_at: string;
    resolved_at?: string;
}

export interface CreatePosFeedbackInput {
    feedback_type: 'stock_shortage' | 'equipment_issue' | 'staff_shortage';
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    created_by: number;
}

export const feedbackService = {
    async createCustomerFeedback(input: CreateCustomerFeedbackInput): Promise<CustomerFeedback> {
        const connection = await pool.getConnection();
        try {
            const [result]: any = await connection.query(
                `INSERT INTO FEEDBACK (
                    order_id, overall_rating, service_rating, quality_rating, ambiance_rating, comment
                 ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    input.order_id,
                    input.overall_rating,
                    input.service_rating ?? null,
                    input.quality_rating ?? null,
                    input.ambiance_rating ?? null,
                    input.comment ?? null,
                ]
            );

            return (await this.getCustomerFeedbackById(result.insertId)) as CustomerFeedback;
        } finally {
            connection.release();
        }
    },

    async getCustomerFeedbacks(): Promise<CustomerFeedback[]> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, order_id, overall_rating, service_rating, quality_rating, ambiance_rating, comment, created_at
                 FROM FEEDBACK ORDER BY created_at DESC`
            );
            return rows as CustomerFeedback[];
        } finally {
            connection.release();
        }
    },

    async getCustomerFeedbackById(id: number): Promise<CustomerFeedback | null> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, order_id, overall_rating, service_rating, quality_rating, ambiance_rating, comment, created_at
                 FROM FEEDBACK WHERE id = ?`,
                [id]
            );
            return ((rows as CustomerFeedback[])[0] as CustomerFeedback) || null;
        } finally {
            connection.release();
        }
    },

    async getFeedbackByOrderId(orderId: number): Promise<CustomerFeedback | null> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, order_id, overall_rating, service_rating, quality_rating, ambiance_rating, comment, created_at
                 FROM FEEDBACK WHERE order_id = ?`,
                [orderId]
            );
            return ((rows as CustomerFeedback[])[0] as CustomerFeedback) || null;
        } finally {
            connection.release();
        }
    },

    async deleteCustomerFeedback(id: number): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM FEEDBACK WHERE id = ?', [id]);
        } finally {
            connection.release();
        }
    },

    async getCustomerSatisfactionSummary(): Promise<any> {
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

    async createPosFeedback(input: CreatePosFeedbackInput): Promise<PosFeedback> {
        const connection = await pool.getConnection();
        try {
            const [result]: any = await connection.query(
                `INSERT INTO POS_FEEDBACK (feedback_type, description, priority, created_by)
                 VALUES (?, ?, ?, ?)`,
                [input.feedback_type, input.description, input.priority || 'medium', input.created_by]
            );

            const [rows] = await connection.query('SELECT * FROM POS_FEEDBACK WHERE id = ?', [result.insertId]);
            return (rows as PosFeedback[])[0];
        } finally {
            connection.release();
        }
    },

    async getPosFeedbacks(): Promise<PosFeedback[]> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, feedback_type, description, priority, status, created_by, resolved_by, created_at, resolved_at
                 FROM POS_FEEDBACK ORDER BY created_at DESC`
            );
            return rows as PosFeedback[];
        } finally {
            connection.release();
        }
    },

    async getPosFeedbackById(id: number): Promise<PosFeedback | null> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, feedback_type, description, priority, status, created_by, resolved_by, created_at, resolved_at
                 FROM POS_FEEDBACK WHERE id = ?`,
                [id]
            );
            return ((rows as PosFeedback[])[0] as PosFeedback) || null;
        } finally {
            connection.release();
        }
    },

    async updatePosFeedbackStatus(id: number, status: 'pending' | 'in_progress' | 'resolved', resolvedBy?: number) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                `UPDATE POS_FEEDBACK
                 SET status = ?, resolved_by = ?, resolved_at = IF(? = 'resolved', NOW(), resolved_at)
                 WHERE id = ?`,
                [status, resolvedBy ?? null, status, id]
            );
            const [rows] = await connection.query('SELECT * FROM POS_FEEDBACK WHERE id = ?', [id]);
            return (rows as PosFeedback[])[0] || null;
        } finally {
            connection.release();
        }
    },

    async deletePosFeedback(id: number): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM POS_FEEDBACK WHERE id = ?', [id]);
        } finally {
            connection.release();
        }
    },
};
