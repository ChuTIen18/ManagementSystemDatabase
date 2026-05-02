import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

// JWT Verification Middleware
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'No token provided',
            },
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid token',
            },
        });
    }
};

// RBAC Middleware
export const rbacMiddleware = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                },
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
                },
            });
        }

        next();
    };
};

export default AuthRequest;
