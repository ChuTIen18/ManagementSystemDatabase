import { Request, Response } from 'express';
import { userService } from '../services/userService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const userController = {
    // GET /api/v1/users - Get all users (Manager only)
    async getAllUsers(req: AuthRequest, res: Response) {
        try {
            const filters = {
                role: req.query.role as string,
                is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
            };

            const users = await userService.getAllUsers(filters);

            return res.json({
                data: users,
            });
        } catch (error: any) {
            console.error(`[GET USERS ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Internal server error',
                },
            });
        }
    },

    // GET /api/v1/users/:id - Get user by ID (Manager only)
    async getUserById(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);

            if (!userId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'User ID is required',
                    },
                });
            }

            const user = await userService.getUserById(userId);

            if (!user) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    },
                });
            }

            return res.json({
                data: user,
            });
        } catch (error: any) {
            console.error(`[GET USER ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // POST /api/v1/users - Create new user (Manager only)
    async createUser(req: AuthRequest, res: Response) {
        try {
            const { email, password, full_name, phone, role, position, hourly_rate } = req.body;

            // Validation
            if (!email || !password || !full_name || !role) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Email, password, full name, and role are required',
                    },
                });
            }

            if (!['staff', 'pos', 'manager'].includes(role)) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid role. Must be staff, pos, or manager',
                    },
                });
            }

            // Check if email exists
            const existingUser = await userService.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    error: {
                        code: 'EMAIL_EXISTS',
                        message: 'Email already exists',
                    },
                });
            }

            const newUser = await userService.createUser({
                email,
                password,
                full_name,
                phone: phone || null,
                role,
                position: position || null,
                hourly_rate: hourly_rate || 0,
            });

            return res.status(201).json({
                data: newUser,
                message: 'User created successfully',
            });
        } catch (error: any) {
            console.error(`[CREATE USER ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/users/:id - Update user (Manager only)
    async updateUser(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const { email, full_name, phone, role, position, hourly_rate, is_active } = req.body;

            if (!userId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'User ID is required',
                    },
                });
            }

            // Check if user exists
            const existingUser = await userService.getUserById(userId);
            if (!existingUser) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    },
                });
            }

            // If email is being updated, check if it's unique
            if (email && email !== existingUser.email) {
                const emailExists = await userService.getUserByEmail(email);
                if (emailExists) {
                    return res.status(400).json({
                        error: {
                            code: 'EMAIL_EXISTS',
                            message: 'Email already in use',
                        },
                    });
                }
            }

            const updateData: any = {};
            if (email !== undefined) updateData.email = email;
            if (full_name !== undefined) updateData.full_name = full_name;
            if (phone !== undefined) updateData.phone = phone;
            if (role !== undefined) updateData.role = role;
            if (position !== undefined) updateData.position = position;
            if (hourly_rate !== undefined) updateData.hourly_rate = hourly_rate;
            if (is_active !== undefined) updateData.is_active = is_active;

            const updatedUser = await userService.updateUser(userId, updateData);

            return res.json({
                data: updatedUser,
                message: 'User updated successfully',
            });
        } catch (error: any) {
            console.error(`[UPDATE USER ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // DELETE /api/v1/users/:id - Deactivate user (Manager only)
    async deleteUser(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);

            if (!userId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'User ID is required',
                    },
                });
            }

            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    },
                });
            }

            // Deactivate user instead of deleting
            await userService.updateUser(userId, { is_active: false });

            return res.json({
                message: 'User deactivated successfully',
            });
        } catch (error: any) {
            console.error(`[DELETE USER ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
