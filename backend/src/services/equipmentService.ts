import pool from '../infrastructure/database.js';

export interface Equipment {
    id: number;
    equipment_name: string;
    equipment_type: string;
    purchase_date: string;
    purchase_cost: number;
    warranty_expiry?: string;
    location?: string;
    status: 'working' | 'maintenance' | 'broken';
    last_maintained_at?: string;
    last_maintained_by?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateEquipmentInput {
    equipment_name: string;
    equipment_type: string;
    purchase_date: string;
    purchase_cost: number;
    warranty_expiry?: string | null;
    location?: string | null;
    status: 'working' | 'maintenance' | 'broken';
    last_maintained_by?: number;
}

export interface UpdateEquipmentInput {
    equipment_name?: string;
    equipment_type?: string;
    purchase_date?: string;
    purchase_cost?: number;
    warranty_expiry?: string;
    location?: string;
    status?: string;
    last_maintained_by?: number;
}

export interface MaintenanceInput {
    maintenance_type: string;
    description?: string | null;
    cost: number;
}

export const equipmentService = {
    // Create equipment
    async createEquipment(input: CreateEquipmentInput): Promise<Equipment> {
        try {
            const connection = await pool.getConnection();

            const [result]: any = await connection.query(
                `INSERT INTO EQUIPMENT (name, purchase_date, warranty_expiry, status, notes)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    input.equipment_name,
                    input.purchase_date,
                    input.warranty_expiry || null,
                    input.status,
                    input.equipment_type || null,
                ]
            );

            connection.release();

            const equipmentId = result.insertId;
            const equipment = await this.getEquipmentById(equipmentId);

            console.log(`[EQUIPMENT SERVICE] Equipment created: ID ${equipmentId}`);
            return equipment as Equipment;
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] createEquipment error: ${error.message}`);
            throw error;
        }
    },

    // Get all equipment
    async getAllEquipment(): Promise<Equipment[]> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id,
                        name AS equipment_name,
                        COALESCE(notes, '') AS equipment_type,
                        purchase_date,
                        0 AS purchase_cost,
                        warranty_expiry,
                        NULL AS location,
                        status,
                        last_maintenance AS last_maintained_at,
                        NULL AS last_maintained_by,
                        created_at,
                        updated_at
                 FROM EQUIPMENT ORDER BY name ASC`
            );

            connection.release();

            return (rows as any[]).map((row) => this.formatEquipment(row));
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] getAllEquipment error: ${error.message}`);
            throw error;
        }
    },

    // Get equipment by ID
    async getEquipmentById(equipmentId: number): Promise<Equipment | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id,
                        name AS equipment_name,
                        COALESCE(notes, '') AS equipment_type,
                        purchase_date,
                        0 AS purchase_cost,
                        warranty_expiry,
                        NULL AS location,
                        status,
                        last_maintenance AS last_maintained_at,
                        NULL AS last_maintained_by,
                        created_at,
                        updated_at
                 FROM EQUIPMENT WHERE id = ?`,
                [equipmentId]
            );

            connection.release();

            const equipment = (rows as any[])[0];
            return equipment ? this.formatEquipment(equipment) : null;
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] getEquipmentById error: ${error.message}`);
            throw error;
        }
    },

    // Update equipment
    async updateEquipment(equipmentId: number, updates: UpdateEquipmentInput): Promise<Equipment> {
        try {
            const connection = await pool.getConnection();

            const updateFields: string[] = [];
            const params: any[] = [];

            if (updates.equipment_name !== undefined) {
                updateFields.push('name = ?');
                params.push(updates.equipment_name);
            }

            if (updates.equipment_type !== undefined) {
                updateFields.push('notes = ?');
                params.push(updates.equipment_type);
            }

            if (updates.purchase_date !== undefined) {
                updateFields.push('purchase_date = ?');
                params.push(updates.purchase_date);
            }

            if (updates.warranty_expiry !== undefined) {
                updateFields.push('warranty_expiry = ?');
                params.push(updates.warranty_expiry || null);
            }

            if (updates.status !== undefined) {
                updateFields.push('status = ?');
                params.push(updates.status);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            params.push(equipmentId);

            const query = `UPDATE EQUIPMENT SET ${updateFields.join(', ')} WHERE id = ?`;
            await connection.query(query, params);

            connection.release();

            const equipment = await this.getEquipmentById(equipmentId);
            console.log(`[EQUIPMENT SERVICE] Equipment updated: ID ${equipmentId}`);
            return equipment as Equipment;
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] updateEquipment error: ${error.message}`);
            throw error;
        }
    },

    // Record maintenance
    async recordMaintenance(
        equipmentId: number,
        maintenance: MaintenanceInput,
        maintainedBy: number | undefined
    ): Promise<Equipment> {
        try {
            const connection = await pool.getConnection();

            // Update equipment last maintained timestamp
            await connection.query(
                `UPDATE EQUIPMENT SET last_maintenance = CURDATE(), status = 'working' WHERE id = ?`,
                [equipmentId]
            );

            // Log maintenance
            await connection.query(
                `INSERT INTO MAINTENANCE_LOGS (equipment_id, maintenance_type, description, cost, performed_by)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    equipmentId,
                    maintenance.maintenance_type,
                    maintenance.description || null,
                    maintenance.cost,
                    maintainedBy || null,
                ]
            );

            connection.release();

            const equipment = await this.getEquipmentById(equipmentId);
            console.log(`[EQUIPMENT SERVICE] Maintenance recorded: ID ${equipmentId}`);
            return equipment as Equipment;
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] recordMaintenance error: ${error.message}`);
            throw error;
        }
    },

    // Get equipment needing maintenance
    async getEquipmentNeedingMaintenance(): Promise<Equipment[]> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                `SELECT id,
                        name AS equipment_name,
                        COALESCE(notes, '') AS equipment_type,
                        purchase_date,
                        0 AS purchase_cost,
                        warranty_expiry,
                        NULL AS location,
                        status,
                        last_maintenance AS last_maintained_at,
                        NULL AS last_maintained_by,
                        created_at,
                        updated_at
                 FROM EQUIPMENT 
                 WHERE status IN ('broken', 'maintenance') OR 
                     (last_maintenance IS NULL AND DATEDIFF(CURDATE(), purchase_date) > 365) OR
                     (last_maintenance IS NOT NULL AND DATEDIFF(CURDATE(), last_maintenance) > 180)
                 ORDER BY status DESC`
            );

            connection.release();

            return (rows as any[]).map((row) => this.formatEquipment(row));
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] getEquipmentNeedingMaintenance error: ${error.message}`);
            throw error;
        }
    },

    // Delete equipment
    async deleteEquipment(equipmentId: number): Promise<void> {
        try {
            const connection = await pool.getConnection();

            await connection.query('DELETE FROM EQUIPMENT WHERE id = ?', [equipmentId]);

            connection.release();

            console.log(`[EQUIPMENT SERVICE] Equipment deleted: ID ${equipmentId}`);
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] deleteEquipment error: ${error.message}`);
            throw error;
        }
    },

    // Get total equipment value
    async getTotalEquipmentValue(): Promise<number> {
        try {
            const connection = await pool.getConnection();

            const [rows]: any = await connection.query(
                `SELECT 0 as total_value FROM EQUIPMENT`
            );

            connection.release();

            return rows[0]?.total_value || 0;
        } catch (error: any) {
            console.error(`[EQUIPMENT SERVICE] getTotalEquipmentValue error: ${error.message}`);
            throw error;
        }
    },

    // Format equipment
    formatEquipment(row: any): Equipment {
        return {
            id: row.id,
            equipment_name: row.equipment_name,
            equipment_type: row.equipment_type,
            purchase_date: row.purchase_date,
            purchase_cost: row.purchase_cost,
            warranty_expiry: row.warranty_expiry,
            location: row.location,
            status: row.status,
            last_maintained_at: row.last_maintained_at,
            last_maintained_by: row.last_maintained_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
    },
};
