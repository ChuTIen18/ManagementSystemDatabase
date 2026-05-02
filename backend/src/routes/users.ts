import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All user routes require authentication and manager role
router.use(authMiddleware);
router.use(rbacMiddleware(['manager']));

// GET /api/v1/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// POST /api/v1/users - Create new user
router.post('/', userController.createUser);

// PUT /api/v1/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/v1/users/:id - Deactivate user
router.delete('/:id', userController.deleteUser);

export default router;
