import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All attendance routes require authentication
router.use(authMiddleware);

// POST /api/v1/attendance/checkin - Check-in
router.post('/checkin', attendanceController.checkIn);

// PUT /api/v1/attendance/:id/checkout - Check-out
router.put('/:id/checkout', attendanceController.checkOut);

// GET /api/v1/attendance - Get attendance records
router.get('/', attendanceController.getAttendance);

// GET /api/v1/attendance/:id - Get single attendance record
router.get('/:id', attendanceController.getAttendanceById);

// PUT /api/v1/attendance/:id - Update attendance (manager only)
router.put('/:id', rbacMiddleware(['manager']), attendanceController.updateAttendance);

export default router;
