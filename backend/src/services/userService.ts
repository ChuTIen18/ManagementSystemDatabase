import pool from '../infrastructure/database.js';
import bcrypt from 'bcryptjs';

export interface User {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    role: 'staff' | 'pos' | 'manager';
    position?: string;
    hourly_rate: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateUserInput {
    email: string;
    password: string;
    full_name: string;
    phone?: string | null;
    role: 'staff' | 'pos' | 'manager';
    position?: string | null;
    hourly_rate?: number;
}

export interface UpdateUserInput {
    email?: string;
    full_name?: string;
    phone?: string;
    role?: string;
    position?: string;
    hourly_rate?: number;
    is_active?: boolean;
}

export const userService = {
    // Get all users with optional filters
    async getAllUsers(filters: { role?: string; is_active?: boolean }) {
        try {
            const connection = await pool.getConnection();

            let query = 'SELECT id, email, full_name, phone, role, position, hourly_rate, is_active, created_at FROM USERS WHERE 1=1';
            const params: any[] = [];

            if (filters.role) {
                query += ' AND role = ?';
                params.push(filters.role);
            }

            if (filters.is_active !== undefined) {
                query += ' AND is_active = ?';
                params.push(filters.is_active);
            }

            query += ' ORDER BY created_at DESC';

            const [rows] = await connection.query(query, params);
            connection.release();

            return rows;
        } catch (error: any) {
            console.error(`[USER SERVICE] getAllUsers error: ${error.message}`);
            throw error;
        }
    },

    // Get user by ID
    async getUserById(userId: number): Promise<User | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT id, email, full_name, phone, role, position, hourly_rate, is_active, created_at FROM USERS WHERE id = ?',
                [userId]
            );

            connection.release();

            const user = (rows as any[])[0];
            return user || null;
        } catch (error: any) {
            console.error(`[USER SERVICE] getUserById error: ${error.message}`);
            throw error;
        }
    },

    // Get user by email
    async getUserByEmail(email: string): Promise<User | null> {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT id, email, full_name, phone, role, position, hourly_rate, is_active, created_at FROM USERS WHERE email = ?',
                [email]
            );

            connection.release();

            const user = (rows as any[])[0];
            return user || null;
        } catch (error: any) {
            console.error(`[USER SERVICE] getUserByEmail error: ${error.message}`);
            throw error;
        }
    },

    // Create new user
    async createUser(input: CreateUserInput): Promise<User> {
        try {
            const connection = await pool.getConnection();

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(input.password, salt);

            const [result]: any = await connection.query(
                `INSERT INTO USERS (email, password_hash, full_name, phone, role, position, hourly_rate, is_active) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
                [
                    input.email,
                    passwordHash,
                    input.full_name,
                    input.phone || null,
                    input.role,
                    input.position || null,
                    input.hourly_rate || 0,
                ]
            );

            const userId = result.insertId;

            // Fetch the created user
            const user = await this.getUserById(userId);

            connection.release();

            console.log(`[USER SERVICE] User created: ${input.email}`);
            return user as User;
        } catch (error: any) {
            console.error(`[USER SERVICE] createUser error: ${error.message}`);
            throw error;
        }
    },

    // Update user
    async updateUser(userId: number, updates: UpdateUserInput): Promise<User> {
        try {
            const connection = await pool.getConnection();

            const updateFields: string[] = [];
            const params: any[] = [];

            if (updates.email !== undefined) {
                updateFields.push('email = ?');
                params.push(updates.email);
            }
            if (updates.full_name !== undefined) {
                updateFields.push('full_name = ?');
                params.push(updates.full_name);
            }
            if (updates.phone !== undefined) {
                updateFields.push('phone = ?');
                params.push(updates.phone);
            }
            if (updates.role !== undefined) {
                updateFields.push('role = ?');
                params.push(updates.role);
            }
            if (updates.position !== undefined) {
                updateFields.push('position = ?');
                params.push(updates.position);
            }
            if (updates.hourly_rate !== undefined) {
                updateFields.push('hourly_rate = ?');
                params.push(updates.hourly_rate);
            }
            if (updates.is_active !== undefined) {
                updateFields.push('is_active = ?');
                params.push(updates.is_active);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            params.push(userId);

            const query = `UPDATE USERS SET ${updateFields.join(', ')} WHERE id = ?`;
            await connection.query(query, params);

            connection.release();

            const user = await this.getUserById(userId);
            console.log(`[USER SERVICE] User updated: ID ${userId}`);
            return user as User;
        } catch (error: any) {
            console.error(`[USER SERVICE] updateUser error: ${error.message}`);
            throw error;
        }
    },

    // Deactivate user
    async deactivateUser(userId: number): Promise<void> {
        try {
            await this.updateUser(userId, { is_active: false });
            console.log(`[USER SERVICE] User deactivated: ID ${userId}`);
        } catch (error: any) {
            console.error(`[USER SERVICE] deactivateUser error: ${error.message}`);
            throw error;
        }
    },
};
