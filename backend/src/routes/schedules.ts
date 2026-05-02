import { Router } from 'express';
import { scheduleController } from '../controllers/scheduleController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All schedule routes require authentication
router.use(authMiddleware);

// GET /api/v1/schedules - Get all schedules (staff: own, manager: all)
router.get('/', scheduleController.getAllSchedules);

// GET /api/v1/schedules/:id - Get schedule by ID
router.get('/:id', scheduleController.getScheduleById);

// POST /api/v1/schedules - Create schedule (staff can create their own)
router.post('/', scheduleController.createSchedule);

// PUT /api/v1/schedules/:id/approve - Approve schedule (manager only)
router.put('/:id/approve', rbacMiddleware(['manager']), scheduleController.approveSchedule);

// PUT /api/v1/schedules/:id/reject - Reject schedule (manager only)
router.put('/:id/reject', rbacMiddleware(['manager']), scheduleController.rejectSchedule);

// DELETE /api/v1/schedules/:id - Delete schedule (cancel)
router.delete('/:id', scheduleController.deleteSchedule);

export default router;
