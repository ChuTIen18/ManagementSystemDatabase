import { Request, Response } from 'express';
import { scheduleService } from '../services/scheduleService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const scheduleController = {
    // GET /api/v1/schedules - Get all schedules
    async getAllSchedules(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            const filters: any = {};

            // Query parameters for filtering
            if (req.query.date) filters.date = req.query.date as string;
            if (req.query.user_id) filters.user_id = parseInt(req.query.user_id as string);
            if (req.query.status) filters.status = req.query.status as string;

            // Staff can only see their own schedules
            if (role === 'staff') {
                filters.user_id = userId;
            }

            const schedules = await scheduleService.getAllSchedules(filters);

            return res.json({
                data: schedules,
            });
        } catch (error: any) {
            console.error(`[GET SCHEDULES ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/schedules/:id - Get schedule by ID
    async getScheduleById(req: AuthRequest, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);

            if (!scheduleId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Schedule ID is required',
                    },
                });
            }

            const schedule = await scheduleService.getScheduleById(scheduleId);

            if (!schedule) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Schedule not found',
                    },
                });
            }

            // Staff can only view their own schedules
            if (req.user?.role === 'staff' && schedule.user_id !== req.user.id) {
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only view your own schedules',
                    },
                });
            }

            return res.json({
                data: schedule,
            });
        } catch (error: any) {
            console.error(`[GET SCHEDULE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // POST /api/v1/schedules - Create schedule (staff requests shift)
    async createSchedule(req: AuthRequest, res: Response) {
        try {
            const { date, shift_type } = req.body;
            const userId = req.user?.id;

            // Validation
            if (!date || !shift_type) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Date and shift_type are required',
                    },
                });
            }

            const validShifts = ['morning', 'lunch', 'afternoon', 'evening'];
            if (!validShifts.includes(shift_type)) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid shift_type. Must be: morning, lunch, afternoon, or evening',
                    },
                });
            }

            // Check if user already has a schedule for this date/shift
            const existingSchedule = await scheduleService.getScheduleByUserDateShift(
                userId!,
                date,
                shift_type
            );

            if (existingSchedule) {
                return res.status(400).json({
                    error: {
                        code: 'DUPLICATE_SCHEDULE',
                        message: 'You already have a schedule for this date and shift',
                    },
                });
            }

            const newSchedule = await scheduleService.createSchedule({
                user_id: userId!,
                date,
                shift_type,
                status: 'pending',
            });

            return res.status(201).json({
                data: newSchedule,
                message: 'Schedule created successfully',
            });
        } catch (error: any) {
            console.error(`[CREATE SCHEDULE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/schedules/:id/approve - Approve schedule (Manager only)
    async approveSchedule(req: AuthRequest, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);

            if (!scheduleId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Schedule ID is required',
                    },
                });
            }

            const schedule = await scheduleService.getScheduleById(scheduleId);

            if (!schedule) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Schedule not found',
                    },
                });
            }

            if (schedule.status !== 'pending') {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_STATUS',
                        message: 'Only pending schedules can be approved',
                    },
                });
            }

            const updatedSchedule = await scheduleService.updateScheduleStatus(scheduleId, 'approved');

            return res.json({
                data: updatedSchedule,
                message: 'Schedule approved successfully',
            });
        } catch (error: any) {
            console.error(`[APPROVE SCHEDULE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/schedules/:id/reject - Reject schedule (Manager only)
    async rejectSchedule(req: AuthRequest, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);
            const { reason } = req.body;

            if (!scheduleId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Schedule ID is required',
                    },
                });
            }

            const schedule = await scheduleService.getScheduleById(scheduleId);

            if (!schedule) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Schedule not found',
                    },
                });
            }

            if (schedule.status !== 'pending') {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_STATUS',
                        message: 'Only pending schedules can be rejected',
                    },
                });
            }

            const updatedSchedule = await scheduleService.updateScheduleStatus(scheduleId, 'rejected');

            return res.json({
                data: updatedSchedule,
                message: 'Schedule rejected successfully',
            });
        } catch (error: any) {
            console.error(`[REJECT SCHEDULE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // DELETE /api/v1/schedules/:id - Delete schedule (cancel request)
    async deleteSchedule(req: AuthRequest, res: Response) {
        try {
            const scheduleId = parseInt(req.params.id);

            if (!scheduleId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Schedule ID is required',
                    },
                });
            }

            const schedule = await scheduleService.getScheduleById(scheduleId);

            if (!schedule) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Schedule not found',
                    },
                });
            }

            // Staff can only delete their own pending schedules
            if (req.user?.role === 'staff' && schedule.user_id !== req.user.id) {
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only delete your own schedules',
                    },
                });
            }

            if (req.user?.role === 'staff' && schedule.status !== 'pending') {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_STATUS',
                        message: 'You can only delete pending schedules',
                    },
                });
            }

            await scheduleService.deleteSchedule(scheduleId);

            return res.json({
                message: 'Schedule deleted successfully',
            });
        } catch (error: any) {
            console.error(`[DELETE SCHEDULE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
