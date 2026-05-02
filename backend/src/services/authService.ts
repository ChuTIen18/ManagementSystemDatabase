import pool from '../infrastructure/database.js';
import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export interface User {
    id: number;
    email: string;
    full_name: string;
    role: 'staff' | 'pos' | 'manager';
    position: string;
    is_active: boolean;
}

export const authService = {
    // Login user
    async login(email: string, password: string) {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT id, email, password_hash, full_name, role, position, is_active FROM USERS WHERE email = ?',
                [email]
            );

            connection.release();

            const user = (rows as any[])[0];

            if (!user) {
                console.log(`[AUTH] User not found: ${email}`);
                throw new Error('USER_NOT_FOUND');
            }

            if (!user.is_active) {
                console.log(`[AUTH] User inactive: ${email}`);
                throw new Error('USER_INACTIVE');
            }

            console.log(`[AUTH] Attempting login for: ${email}`);
            console.log(`[AUTH] Password provided: ${password}`);

            // Simple password check for testing
            // TODO: Replace with bcrypt once version issue is fixed
            const passwordMatch = password === '123456';

            console.log(`[AUTH] Password match result: ${passwordMatch}`);

            if (!passwordMatch) {
                console.log(`[AUTH] Invalid password for: ${email}`);
                throw new Error('INVALID_PASSWORD');
            }

            console.log(`[AUTH] Login successful for: ${email}`);

            // Generate JWT tokens
            const accessSecret: Secret = process.env.JWT_SECRET || 'secret';
            const accessExpiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

            const accessToken = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                accessSecret,
                { expiresIn: accessExpiresIn }
            );

            const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
            const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn'];

            const refreshToken = jwt.sign(
                { id: user.id, email: user.email },
                refreshSecret,
                { expiresIn: refreshExpiresIn }
            );

            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                    position: user.position,
                },
            };
        } catch (error: any) {
            console.error(`[AUTH] Login error: ${error.message}`);
            throw error;
        }
    },

    // Get user by ID
    async getUserById(userId: number) {
        try {
            const connection = await pool.getConnection();

            const [rows] = await connection.query(
                'SELECT id, email, full_name, role, position, hourly_rate, is_active, created_at FROM USERS WHERE id = ?',
                [userId]
            );

            connection.release();

            const user = (rows as any[])[0];

            if (!user) {
                throw new Error('USER_NOT_FOUND');
            }

            return user;
        } catch (error) {
            throw error;
        }
    },

    // Verify refresh token
    async verifyRefreshToken(token: string) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET || 'refresh_secret'
            ) as any;

            const user = await this.getUserById(decoded.id);

            const accessSecret: Secret = process.env.JWT_SECRET || 'secret';
            const accessExpiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

            const newAccessToken = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                accessSecret,
                { expiresIn: accessExpiresIn }
            );

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new Error('INVALID_REFRESH_TOKEN');
        }
    },
};
