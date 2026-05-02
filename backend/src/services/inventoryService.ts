import pool from '../infrastructure/database.js';

export interface InventoryItem {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    min_quantity: number;
    supplier?: string;
    cost_per_unit: number;
    total_value: number;
    last_updated_by?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateInventoryItemInput {
    item_name: string;
    quantity: number;
    unit: string;
    min_quantity: number;
    supplier?: string | null;
    cost_per_unit: number;
    last_updated_by?: number;
}

export interface UpdateInventoryItemInput {
    item_name?: string;
    unit?: string;
    min_quantity?: number;
    supplier?: string;
    cost_per_unit?: number;
    last_updated_by?: number;
}

export const inventoryService = {
    // Create inventory item
    async createInventoryItem(input: CreateInventoryItemInput): Promise<InventoryItem> {
        try {
            const connection = await pool.getConnection();
            const supplierId = input.supplier && !Number.isNaN(Number(input.supplier)) ? Number(input.supplier) : null;

            const [result]: any = await connection.query(
                `INSERT INTO STOCK (name, quantity, unit, min_quantity, supplier_id, cost_per_unit)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    input.item_name,
                    input.quantity,
                    input.unit,
                    input.min_quantity,
                    supplierId,
                    input.cost_per_unit,
                ]
            );

            connection.release();

            const itemId = result.insertId;
            const item = await this.getInventoryItemById(itemId);

            console.log(`[INVENTORY SERVICE] Inventory item created: ID ${itemId}`);
            return item as InventoryItem;
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] createInventoryItem error: ${error.message}`);
            throw error;
        }
    },

    // Get all inventory items
    async getAllInventoryItems(): Promise<InventoryItem[]> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT st.id, st.name AS item_name, st.quantity, st.unit, st.min_quantity,
                    sup.name AS supplier, st.cost_per_unit,
                    (st.quantity * st.cost_per_unit) as total_value,
                    st.created_at, st.updated_at
                 FROM STOCK st
                 LEFT JOIN SUPPLIERS sup ON sup.id = st.supplier_id
                 ORDER BY st.name ASC`
            );

            connection.release();

            return (rows as any[]).map((row) => this.formatInventoryItem(row));
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] getAllInventoryItems error: ${error.message}`);
            throw error;
        }
    },

    // Get inventory item by ID
    async getInventoryItemById(itemId: number): Promise<InventoryItem | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT st.id, st.name AS item_name, st.quantity, st.unit, st.min_quantity,
                        sup.name AS supplier, st.cost_per_unit,
                        (st.quantity * st.cost_per_unit) as total_value,
                        st.created_at, st.updated_at
                 FROM STOCK st
                 LEFT JOIN SUPPLIERS sup ON sup.id = st.supplier_id
                 WHERE st.id = ?`,
                [itemId]
            );

            connection.release();

            const item = (rows as any[])[0];
            return item ? this.formatInventoryItem(item) : null;
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] getInventoryItemById error: ${error.message}`);
            throw error;
        }
    },

    // Update inventory item details (not quantity)
    async updateInventoryItem(
        itemId: number,
        updates: UpdateInventoryItemInput
    ): Promise<InventoryItem> {
        try {
            const connection = await pool.getConnection();
            const supplierId = updates.supplier && !Number.isNaN(Number(updates.supplier)) ? Number(updates.supplier) : null;

            const updateFields: string[] = [];
            const params: any[] = [];

            if (updates.item_name !== undefined) {
                updateFields.push('name = ?');
                params.push(updates.item_name);
            }

            if (updates.unit !== undefined) {
                updateFields.push('unit = ?');
                params.push(updates.unit);
            }

            if (updates.min_quantity !== undefined) {
                updateFields.push('min_quantity = ?');
                params.push(updates.min_quantity);
            }

            if (updates.supplier !== undefined) {
                updateFields.push('supplier_id = ?');
                params.push(supplierId);
            }

            if (updates.cost_per_unit !== undefined) {
                updateFields.push('cost_per_unit = ?');
                params.push(updates.cost_per_unit);
            }

            if (updates.last_updated_by !== undefined) {
                updateFields.push('last_updated_by = ?');
                params.push(updates.last_updated_by);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            params.push(itemId);

            const query = `UPDATE STOCK SET ${updateFields.join(', ')} WHERE id = ?`;
            await connection.query(query, params);

            connection.release();

            const item = await this.getInventoryItemById(itemId);
            console.log(`[INVENTORY SERVICE] Inventory item updated: ID ${itemId}`);
            return item as InventoryItem;
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] updateInventoryItem error: ${error.message}`);
            throw error;
        }
    },

    // Add stock
    async addStock(
        itemId: number,
        quantity: number,
        notes: string | undefined,
        updatedBy: number | undefined
    ): Promise<InventoryItem> {
        try {
            const connection = await pool.getConnection();

            // Update inventory quantity
            await connection.query(
                `UPDATE STOCK SET quantity = quantity + ?, last_restocked = NOW() WHERE id = ?`,
                [quantity, itemId]
            );

            // Log the transaction
            if (updatedBy) {
                const currentItem = await this.getInventoryItemById(itemId);
                await connection.query(
                    `INSERT INTO STOCK_TRANSACTIONS (stock_id, transaction_type, quantity, unit_price, total_cost, reason, performed_by)
                     VALUES (?, ?, ?, ?, ?, ?, ?)` ,
                    [
                        itemId,
                        'in',
                        quantity,
                        currentItem?.cost_per_unit ?? null,
                        currentItem ? quantity * currentItem.cost_per_unit : null,
                        notes || null,
                        updatedBy,
                    ]
                );
            }

            connection.release();

            const item = await this.getInventoryItemById(itemId);
            console.log(`[INVENTORY SERVICE] Stock added: ID ${itemId}, Quantity ${quantity}`);
            return item as InventoryItem;
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] addStock error: ${error.message}`);
            throw error;
        }
    },

    // Remove stock
    async removeStock(
        itemId: number,
        quantity: number,
        notes: string | undefined,
        updatedBy: number | undefined
    ): Promise<InventoryItem> {
        try {
            const connection = await pool.getConnection();

            // Update inventory quantity
            await connection.query(
                `UPDATE STOCK SET quantity = quantity - ? WHERE id = ?`,
                [quantity, itemId]
            );

            // Log the transaction
            if (updatedBy) {
                const currentItem = await this.getInventoryItemById(itemId);
                await connection.query(
                    `INSERT INTO STOCK_TRANSACTIONS (stock_id, transaction_type, quantity, unit_price, total_cost, reason, performed_by)
                     VALUES (?, ?, ?, ?, ?, ?, ?)` ,
                    [
                        itemId,
                        'out',
                        quantity,
                        currentItem?.cost_per_unit ?? null,
                        currentItem ? quantity * currentItem.cost_per_unit : null,
                        notes || null,
                        updatedBy,
                    ]
                );
            }

            connection.release();

            const item = await this.getInventoryItemById(itemId);
            console.log(`[INVENTORY SERVICE] Stock removed: ID ${itemId}, Quantity ${quantity}`);
            return item as InventoryItem;
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] removeStock error: ${error.message}`);
            throw error;
        }
    },

    // Get low stock items
    async getLowStockItems(): Promise<InventoryItem[]> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT st.id, st.name AS item_name, st.quantity, st.unit, st.min_quantity,
                    sup.name AS supplier, st.cost_per_unit,
                    (st.quantity * st.cost_per_unit) as total_value,
                    st.created_at, st.updated_at
                 FROM STOCK st
                 LEFT JOIN SUPPLIERS sup ON sup.id = st.supplier_id
                 WHERE st.quantity <= st.min_quantity ORDER BY st.quantity ASC`
            );

            connection.release();

            return (rows as any[]).map((row) => this.formatInventoryItem(row));
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] getLowStockItems error: ${error.message}`);
            throw error;
        }
    },

    // Delete inventory item
    async deleteInventoryItem(itemId: number): Promise<void> {
        try {
            const connection = await pool.getConnection();

            await connection.query('DELETE FROM STOCK WHERE id = ?', [itemId]);

            connection.release();

            console.log(`[INVENTORY SERVICE] Inventory item deleted: ID ${itemId}`);
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] deleteInventoryItem error: ${error.message}`);
            throw error;
        }
    },

    // Get inventory value
    async getTotalInventoryValue(): Promise<number> {
        try {
            const connection = await pool.getConnection();

            const [rows]: any = await connection.query(
                `SELECT SUM(quantity * cost_per_unit) as total_value FROM STOCK`
            );

            connection.release();

            return rows[0]?.total_value || 0;
        } catch (error: any) {
            console.error(`[INVENTORY SERVICE] getTotalInventoryValue error: ${error.message}`);
            throw error;
        }
    },

    // Format inventory item
    formatInventoryItem(row: any): InventoryItem {
        return {
            id: row.id,
            item_name: row.item_name,
            quantity: row.quantity,
            unit: row.unit,
            min_quantity: row.min_quantity,
            supplier: row.supplier,
            cost_per_unit: row.cost_per_unit,
            total_value: row.total_value || 0,
            last_updated_by: row.last_updated_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
    },
};
