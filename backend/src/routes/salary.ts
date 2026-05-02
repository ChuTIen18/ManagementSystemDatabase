import { Router } from 'express';
import { salaryController } from '../controllers/salaryController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All salary routes require authentication
router.use(authMiddleware);

// POST /api/v1/salary/calculate - Calculate salary (manager only)
router.post('/calculate', rbacMiddleware(['manager']), salaryController.calculateSalary);

// GET /api/v1/salary - Get salary records
router.get('/', salaryController.getSalaries);

// GET /api/v1/salary/:id - Get single salary record
router.get('/:id', salaryController.getSalaryById);

// PUT /api/v1/salary/:id - Update salary (manager only)
router.put('/:id', rbacMiddleware(['manager']), salaryController.updateSalary);

// PUT /api/v1/salary/:id/pay - Mark salary as paid (manager only)
router.put('/:id/pay', rbacMiddleware(['manager']), salaryController.paySalary);

export default router;
