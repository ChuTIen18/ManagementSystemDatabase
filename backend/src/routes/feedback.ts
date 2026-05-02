import { Router } from 'express';
import { feedbackController } from '../controllers/feedbackController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/customer/summary', feedbackController.getCustomerSatisfactionSummary);
router.get('/customer', feedbackController.getCustomerFeedbacks);
router.get('/customer/:id', feedbackController.getCustomerFeedbackById);
router.post('/customer', feedbackController.createCustomerFeedback);
router.delete('/customer/:id', rbacMiddleware(['manager']), feedbackController.deleteCustomerFeedback);

router.get('/pos', rbacMiddleware(['manager', 'pos']), feedbackController.getPosFeedbacks);
router.post('/pos', rbacMiddleware(['manager', 'pos']), feedbackController.createPosFeedback);
router.put('/pos/:id/status', rbacMiddleware(['manager']), feedbackController.updatePosFeedbackStatus);
router.delete('/pos/:id', rbacMiddleware(['manager']), feedbackController.deletePosFeedback);

export default router;
