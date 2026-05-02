import { Router, Request, Response } from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', authController.login);

// POST /api/v1/auth/refresh
router.post('/refresh', authController.refreshToken);

// GET /api/v1/auth/me
router.get('/me', authMiddleware, authController.getMe);

// POST /api/v1/auth/logout
router.post('/logout', authMiddleware, authController.logout);

export default router;
