import { Router } from 'express';
import { leaveRequestController } from '../controllers/leaveRequestController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All leave request routes require authentication
router.use(authMiddleware);

// POST /api/v1/leave-requests - Create leave request
router.post('/', leaveRequestController.createLeaveRequest);

// GET /api/v1/leave-requests - Get leave requests
router.get('/', leaveRequestController.getLeaveRequests);

// GET /api/v1/leave-requests/:id - Get single leave request
router.get('/:id', leaveRequestController.getLeaveRequestById);

// PUT /api/v1/leave-requests/:id/approve - Approve (manager only)
router.put('/:id/approve', rbacMiddleware(['manager']), leaveRequestController.approveLeaveRequest);

// PUT /api/v1/leave-requests/:id/reject - Reject (manager only)
router.put('/:id/reject', rbacMiddleware(['manager']), leaveRequestController.rejectLeaveRequest);

// DELETE /api/v1/leave-requests/:id - Cancel leave request
router.delete('/:id', leaveRequestController.deleteLeaveRequest);

export default router;
