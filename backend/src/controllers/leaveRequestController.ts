import { Request, Response } from 'express';
import { leaveRequestService } from '../services/leaveRequestService.js';
import { userService } from '../services/userService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const leaveRequestController = {
    // POST /api/v1/leave-requests - Create leave request
    async createLeaveRequest(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const { start_date, end_date, reason } = req.body;

            if (!userId) {
                return res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User not authenticated',
                    },
                });
            }

            if (!start_date || !end_date) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'start_date and end_date are required',
                    },
                });
            }

            // Validate dates
            const start = new Date(start_date);
            const end = new Date(end_date);

            if (start > end) {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_DATES',
                        message: 'start_date must be before end_date',
                    },
                });
            }

            if (start < new Date()) {
                return res.status(400).json({
                    error: {
                        code: 'PAST_DATE',
                        message: 'Cannot request leave for past dates',
                    },
                });
            }

            const leaveRequest = await leaveRequestService.createLeaveRequest({
                user_id: userId,
                start_date,
                end_date,
                reason: reason || null,
                status: 'pending',
            });

            return res.status(201).json({
                data: leaveRequest,
                message: 'Leave request created successfully',
            });
        } catch (error: any) {
            console.error(`[CREATE LEAVE REQUEST ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/leave-requests - Get leave requests
    async getLeaveRequests(req: AuthRequest, res: Response) {
        try {
            const { user_id, status, start_date, end_date } = req.query;

            const filters: any = {};

            // Staff can only view their own requests
            if (req.user?.role === 'staff' || req.user?.role === 'pos') {
                filters.user_id = req.user.id;
            } else if (user_id) {
                filters.user_id = parseInt(user_id as string);
            }

            if (status) filters.status = status as string;
            if (start_date) filters.start_date = start_date as string;
            if (end_date) filters.end_date = end_date as string;

            const leaveRequests = await leaveRequestService.getLeaveRequests(filters);

            return res.json({
                data: leaveRequests,
            });
        } catch (error: any) {
            console.error(`[GET LEAVE REQUESTS ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/leave-requests/:id - Get single leave request
    async getLeaveRequestById(req: AuthRequest, res: Response) {
        try {
            const leaveRequestId = parseInt(req.params.id);

            if (!leaveRequestId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Leave request ID is required',
                    },
                });
            }

            const leaveRequest = await leaveRequestService.getLeaveRequestById(leaveRequestId);

            if (!leaveRequest) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Leave request not found',
                    },
                });
            }

            // Staff can only view their own requests
            if (req.user?.role === 'staff' && (leaveRequest as any).user_id !== req.user.id) {
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only view your own leave requests',
                    },
                });
            }

            return res.json({
                data: leaveRequest,
            });
        } catch (error: any) {
            console.error(`[GET LEAVE REQUEST ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/leave-requests/:id/approve - Approve leave request (manager only)
    async approveLeaveRequest(req: AuthRequest, res: Response) {
        try {
            const leaveRequestId = parseInt(req.params.id);

            if (!leaveRequestId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Leave request ID is required',
                    },
                });
            }

            const leaveRequest = await leaveRequestService.getLeaveRequestById(leaveRequestId);

            if (!leaveRequest) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Leave request not found',
                    },
                });
            }

            if ((leaveRequest as any).status !== 'pending') {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_STATUS',
                        message: 'Only pending requests can be approved',
                    },
                });
            }

            const approvedRequest = await leaveRequestService.updateLeaveRequestStatus(
                leaveRequestId,
                'approved',
                req.user?.id
            );

            return res.json({
                data: approvedRequest,
                message: 'Leave request approved',
            });
        } catch (error: any) {
            console.error(`[APPROVE LEAVE REQUEST ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/leave-requests/:id/reject - Reject leave request (manager only)
    async rejectLeaveRequest(req: AuthRequest, res: Response) {
        try {
            const leaveRequestId = parseInt(req.params.id);

            if (!leaveRequestId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Leave request ID is required',
                    },
                });
            }

            const leaveRequest = await leaveRequestService.getLeaveRequestById(leaveRequestId);

            if (!leaveRequest) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Leave request not found',
                    },
                });
            }

            if ((leaveRequest as any).status !== 'pending') {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_STATUS',
                        message: 'Only pending requests can be rejected',
                    },
                });
            }

            const rejectedRequest = await leaveRequestService.updateLeaveRequestStatus(
                leaveRequestId,
                'rejected',
                req.user?.id
            );

            return res.json({
                data: rejectedRequest,
                message: 'Leave request rejected',
            });
        } catch (error: any) {
            console.error(`[REJECT LEAVE REQUEST ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // DELETE /api/v1/leave-requests/:id - Cancel leave request (staff only own, manager any)
    async deleteLeaveRequest(req: AuthRequest, res: Response) {
        try {
            const leaveRequestId = parseInt(req.params.id);

            if (!leaveRequestId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Leave request ID is required',
                    },
                });
            }

            const leaveRequest = await leaveRequestService.getLeaveRequestById(leaveRequestId);

            if (!leaveRequest) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Leave request not found',
                    },
                });
            }

            // Staff can only delete their own pending requests
            if (
                req.user?.role === 'staff' &&
                ((leaveRequest as any).user_id !== req.user.id || (leaveRequest as any).status !== 'pending')
            ) {
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only cancel your own pending leave requests',
                    },
                });
            }

            await leaveRequestService.deleteLeaveRequest(leaveRequestId);

            return res.json({
                data: null,
                message: 'Leave request cancelled',
            });
        } catch (error: any) {
            console.error(`[DELETE LEAVE REQUEST ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
