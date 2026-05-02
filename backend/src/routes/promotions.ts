import { Router } from 'express';
import { promotionsController } from '../controllers/promotionsController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', promotionsController.getPromotions);
router.get('/:id', promotionsController.getPromotionById);
router.post('/', rbacMiddleware(['manager']), promotionsController.createPromotion);
router.put('/:id', rbacMiddleware(['manager']), promotionsController.updatePromotion);
router.delete('/:id', rbacMiddleware(['manager']), promotionsController.deletePromotion);
router.post('/orders/:orderId/apply', rbacMiddleware(['manager', 'pos']), promotionsController.applyPromotionToOrder);

export default router;
