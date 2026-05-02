import { Router } from 'express';
import { reportsController } from '../controllers/reportsController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/summary', rbacMiddleware(['manager']), reportsController.getSummary);
router.get('/daily-revenue', rbacMiddleware(['manager']), reportsController.getDailyRevenue);
router.get('/low-stock', rbacMiddleware(['manager']), reportsController.getLowStock);
router.get('/top-items', rbacMiddleware(['manager']), reportsController.getTopItems);
router.get('/customer-satisfaction', rbacMiddleware(['manager']), reportsController.getCustomerSatisfaction);

export default router;
