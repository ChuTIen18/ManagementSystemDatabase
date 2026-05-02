import { Router } from 'express';
import { menuController } from '../controllers/menuController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// GET /api/v1/menu - Public (no auth required)
router.get('/', menuController.getAllMenuItems);

// GET /api/v1/menu/:id - Public
router.get('/:id', menuController.getMenuItemById);

// POST /api/v1/menu - Manager and POS only
router.post(
    '/',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    menuController.createMenuItem
);

// PUT /api/v1/menu/:id - Manager and POS only
router.put(
    '/:id',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    menuController.updateMenuItem
);

// PUT /api/v1/menu/:id/availability - Manager and POS only
router.put(
    '/:id/availability',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    menuController.toggleAvailability
);

// DELETE /api/v1/menu/:id - Manager and POS only
router.delete(
    '/:id',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    menuController.deleteMenuItem
);

export default router;
