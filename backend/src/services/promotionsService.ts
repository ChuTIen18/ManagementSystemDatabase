import pool from '../infrastructure/database.js';

export interface Promotion {
    id: number;
    name: string;
    description?: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    applicable_items?: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_by: number;
    created_at: string;
}

export interface CreatePromotionInput {
    name: string;
    description?: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount?: number | null;
    max_discount_amount?: number | null;
    applicable_items?: string[] | null;
    start_date: string;
    end_date: string;
    is_active?: boolean;
    created_by: number;
}

export interface UpdatePromotionInput {
    name?: string;
    description?: string | null;
    discount_type?: 'percentage' | 'fixed';
    discount_value?: number;
    min_order_amount?: number | null;
    max_discount_amount?: number | null;
    applicable_items?: string[] | null;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
}

export const promotionsService = {
    async createPromotion(input: CreatePromotionInput): Promise<Promotion> {
        const connection = await pool.getConnection();
        try {
            const [result]: any = await connection.query(
                `INSERT INTO PROMOTIONS (
                    name, description, discount_type, discount_value,
                    min_order_amount, max_discount_amount, applicable_items,
                    start_date, end_date, is_active, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    input.name,
                    input.description || null,
                    input.discount_type,
                    input.discount_value,
                    input.min_order_amount ?? null,
                    input.max_discount_amount ?? null,
                    input.applicable_items ? JSON.stringify(input.applicable_items) : null,
                    input.start_date,
                    input.end_date,
                    input.is_active ?? true,
                    input.created_by,
                ]
            );

            return (await this.getPromotionById(result.insertId)) as Promotion;
        } finally {
            connection.release();
        }
    },

    async getAllPromotions(): Promise<Promotion[]> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, name, description, discount_type, discount_value, min_order_amount,
                        max_discount_amount, applicable_items, start_date, end_date, is_active,
                        created_by, created_at
                 FROM PROMOTIONS
                 ORDER BY created_at DESC`
            );

            return (rows as any[]).map((row) => this.formatPromotion(row));
        } finally {
            connection.release();
        }
    },

    async getActivePromotions(): Promise<Promotion[]> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, name, description, discount_type, discount_value, min_order_amount,
                        max_discount_amount, applicable_items, start_date, end_date, is_active,
                        created_by, created_at
                 FROM PROMOTIONS
                 WHERE is_active = TRUE AND CURDATE() BETWEEN start_date AND end_date
                 ORDER BY created_at DESC`
            );

            return (rows as any[]).map((row) => this.formatPromotion(row));
        } finally {
            connection.release();
        }
    },

    async getPromotionById(id: number): Promise<Promotion | null> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, name, description, discount_type, discount_value, min_order_amount,
                        max_discount_amount, applicable_items, start_date, end_date, is_active,
                        created_by, created_at
                 FROM PROMOTIONS WHERE id = ?`,
                [id]
            );

            const promotion = (rows as any[])[0];
            return promotion ? this.formatPromotion(promotion) : null;
        } finally {
            connection.release();
        }
    },

    async updatePromotion(id: number, updates: UpdatePromotionInput): Promise<Promotion> {
        const connection = await pool.getConnection();
        try {
            const fields: string[] = [];
            const values: any[] = [];

            if (updates.name !== undefined) {
                fields.push('name = ?');
                values.push(updates.name);
            }
            if (updates.description !== undefined) {
                fields.push('description = ?');
                values.push(updates.description);
            }
            if (updates.discount_type !== undefined) {
                fields.push('discount_type = ?');
                values.push(updates.discount_type);
            }
            if (updates.discount_value !== undefined) {
                fields.push('discount_value = ?');
                values.push(updates.discount_value);
            }
            if (updates.min_order_amount !== undefined) {
                fields.push('min_order_amount = ?');
                values.push(updates.min_order_amount);
            }
            if (updates.max_discount_amount !== undefined) {
                fields.push('max_discount_amount = ?');
                values.push(updates.max_discount_amount);
            }
            if (updates.applicable_items !== undefined) {
                fields.push('applicable_items = ?');
                values.push(updates.applicable_items ? JSON.stringify(updates.applicable_items) : null);
            }
            if (updates.start_date !== undefined) {
                fields.push('start_date = ?');
                values.push(updates.start_date);
            }
            if (updates.end_date !== undefined) {
                fields.push('end_date = ?');
                values.push(updates.end_date);
            }
            if (updates.is_active !== undefined) {
                fields.push('is_active = ?');
                values.push(updates.is_active);
            }

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);
            await connection.query(`UPDATE PROMOTIONS SET ${fields.join(', ')} WHERE id = ?`, values);
            return (await this.getPromotionById(id)) as Promotion;
        } finally {
            connection.release();
        }
    },

    async deletePromotion(id: number): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM PROMOTIONS WHERE id = ?', [id]);
        } finally {
            connection.release();
        }
    },

    async togglePromotionStatus(id: number, isActive: boolean): Promise<Promotion> {
        return this.updatePromotion(id, { is_active: isActive });
    },

    async applyPromotionToOrder(orderId: number, promotionId: number): Promise<any> {
        const connection = await pool.getConnection();
        try {
            const promotion = await this.getPromotionById(promotionId);
            if (!promotion) {
                throw new Error('PROMOTION_NOT_FOUND');
            }

            const [orderRows] = await connection.query('SELECT * FROM ORDERS WHERE id = ?', [orderId]);
            const order = (orderRows as any[])[0];
            if (!order) {
                throw new Error('ORDER_NOT_FOUND');
            }

            const subtotal = Number(order.total_amount || 0);
            let discount = 0;

            if (promotion.discount_type === 'percentage') {
                discount = (subtotal * Number(promotion.discount_value)) / 100;
                if (promotion.max_discount_amount != null) {
                    discount = Math.min(discount, Number(promotion.max_discount_amount));
                }
            } else {
                discount = Number(promotion.discount_value);
            }

            if (promotion.min_order_amount != null && subtotal < Number(promotion.min_order_amount)) {
                throw new Error('MIN_ORDER_AMOUNT_NOT_MET');
            }

            discount = Math.min(discount, subtotal);
            const finalAmount = subtotal - discount;

            await connection.query(
                `UPDATE ORDERS
                 SET promotion_id = ?, discount_amount = ?, final_amount = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [promotionId, discount, finalAmount, orderId]
            );

            const [updatedRows] = await connection.query('SELECT * FROM ORDERS WHERE id = ?', [orderId]);
            return (updatedRows as any[])[0];
        } finally {
            connection.release();
        }
    },

    formatPromotion(row: any): Promotion {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            discount_type: row.discount_type,
            discount_value: Number(row.discount_value),
            min_order_amount: row.min_order_amount != null ? Number(row.min_order_amount) : undefined,
            max_discount_amount: row.max_discount_amount != null ? Number(row.max_discount_amount) : undefined,
            applicable_items: row.applicable_items,
            start_date: row.start_date,
            end_date: row.end_date,
            is_active: Boolean(row.is_active),
            created_by: row.created_by,
            created_at: row.created_at,
        };
    },
};
