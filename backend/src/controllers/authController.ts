import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import AuthRequest from '../middlewares/auth.js';

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const authController = {
    // POST /api/v1/auth/login
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            console.log(`[LOGIN] Request received - Email: ${email}`);

            if (!email || !password) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Email and password are required',
                    },
                });
            }

            const result = await authService.login(email, password);

            console.log(`[LOGIN] Success for: ${email}`);
            // Also set refresh token as an httpOnly cookie for browsers (dev: non-secure)
            try {
                const refreshCookie = `refreshToken=${result.refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
                res.setHeader('Set-Cookie', refreshCookie);
            } catch (cookieErr) {
                console.warn('Could not set refresh cookie', cookieErr);
            }

            return res.json({
                data: {
                    accessToken: result.accessToken,
                    user: result.user,
                },
            });
        } catch (error: any) {
            console.error(`[LOGIN ERROR] ${error.message}`);

            if (error.message === 'USER_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found',
                    },
                });
            }

            if (error.message === 'USER_INACTIVE') {
                return res.status(403).json({
                    error: {
                        code: 'USER_INACTIVE',
                        message: 'User account is inactive',
                    },
                });
            }

            if (error.message === 'INVALID_PASSWORD') {
                return res.status(401).json({
                    error: {
                        code: 'INVALID_PASSWORD',
                        message: 'Invalid email or password',
                    },
                });
            }

            if (error.message === 'PASSWORD_COMPARISON_ERROR') {
                return res.status(500).json({
                    error: {
                        code: 'PASSWORD_ERROR',
                        message: 'Password comparison error. Check backend logs.',
                    },
                });
            }

            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Internal server error',
                },
            });
        }
    },

    // POST /api/v1/auth/refresh
    async refreshToken(req: Request, res: Response) {
        try {
            // Read refresh token from body or cookie header (cookie parsing without extra deps)
            let refreshToken = req.body?.refreshToken;

            if (!refreshToken && req.headers && req.headers.cookie) {
                const cookieHeader = req.headers.cookie as string;
                const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('refreshToken='));
                if (match) {
                    refreshToken = match.split('=')[1];
                }
            }

            if (!refreshToken) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Refresh token is required',
                    },
                });
            }

            const result = await authService.verifyRefreshToken(refreshToken);

            // return new access token
            return res.json({ data: result });
        } catch (error: any) {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid refresh token',
                },
            });
        }
    },

    // GET /api/v1/auth/me
    async getMe(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User not authenticated',
                    },
                });
            }

            const user = await authService.getUserById(req.user.id);

            return res.json({
                data: user,
            });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message || 'Internal server error',
                },
            });
        }
    },

    // POST /api/v1/auth/logout
    async logout(req: Request, res: Response) {
        // In a stateless JWT system, logout is typically handled client-side
        // by removing the token from localStorage
        return res.json({
            data: { message: 'Logged out successfully' },
        });
    },
};
