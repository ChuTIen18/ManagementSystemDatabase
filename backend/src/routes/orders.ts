import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/v1/orders
router.get('/', orderController.getAllOrders);

// GET /api/v1/orders/:id
router.get('/:id', orderController.getOrderById);

// POST /api/v1/orders - Manager and POS only
router.post('/', rbacMiddleware(['manager', 'pos']), orderController.createOrder);

// PUT /api/v1/orders/:id/status - Manager and POS only
router.put('/:id/status', rbacMiddleware(['manager', 'pos']), orderController.updateOrderStatus);

// POST /api/v1/orders/:id/items - Manager and POS only
router.post('/:id/items', rbacMiddleware(['manager', 'pos']), orderController.addOrderItem);

// DELETE /api/v1/orders/:id/items/:itemId - Manager and POS only
router.delete(
    '/:id/items/:itemId',
    rbacMiddleware(['manager', 'pos']),
    orderController.removeOrderItem
);

// PUT /api/v1/orders/:id/payment
router.put('/:id/payment', orderController.updatePayment);

// DELETE /api/v1/orders/:id - Manager and POS only
router.delete('/:id', rbacMiddleware(['manager', 'pos']), orderController.cancelOrder);

export default router;
