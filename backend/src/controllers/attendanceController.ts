import { Request, Response } from 'express';
import { attendanceService } from '../services/attendanceService.js';
import { scheduleService } from '../services/scheduleService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

const ShiftStartTimes: Record<string, { hour: number; minute: number }> = {
    morning: { hour: 6, minute: 0 },
    lunch: { hour: 12, minute: 0 },
    afternoon: { hour: 16, minute: 0 },
    evening: { hour: 20, minute: 0 },
};

export const attendanceController = {
    // POST /api/v1/attendance/checkin - Check-in
    async checkIn(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const { fingerprint_data } = req.body;

            if (!userId) {
                return res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User not authenticated',
                    },
                });
            }

            // Get today's approved schedule for this user
            const today = new Date().toISOString().split('T')[0];
            const schedules = await scheduleService.getAllSchedules({
                user_id: userId,
                date: today,
                status: 'approved',
            });

            if (schedules.length === 0) {
                return res.status(400).json({
                    error: {
                        code: 'NO_APPROVED_SCHEDULE',
                        message: 'No approved schedule found for today',
                    },
                });
            }

            // Use the first approved schedule for the day
            const schedule = schedules[0];

            // Check if already checked in
            const existingCheckIn = await attendanceService.getTodayCheckIn(userId);
            if (existingCheckIn && !existingCheckIn.check_out) {
                return res.status(400).json({
                    error: {
                        code: 'ALREADY_CHECKED_IN',
                        message: 'Already checked in. Please check out first.',
                    },
                });
            }

            // Calculate if late
            const now = new Date();
            const shiftStart = ShiftStartTimes[schedule.shift_type];
            const shiftStartTime = new Date();
            shiftStartTime.setHours(shiftStart.hour, shiftStart.minute, 0);

            const isLate = now.getTime() > shiftStartTime.getTime() + 15 * 60 * 1000; // 15 minutes late window

            const attendance = await attendanceService.createAttendance({
                user_id: userId,
                schedule_id: schedule.id,
                check_in: new Date(),
                fingerprint_data: fingerprint_data || null,
                is_late: isLate,
            });

            return res.status(201).json({
                data: attendance,
                message: isLate ? 'Checked in successfully (LATE)' : 'Checked in successfully',
            });
        } catch (error: any) {
            console.error(`[CHECKIN ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/attendance/:id/checkout - Check-out
    async checkOut(req: AuthRequest, res: Response) {
        try {
            const attendanceId = parseInt(req.params.id);
            const userId = req.user?.id;

            if (!attendanceId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Attendance ID is required',
                    },
                });
            }

            const attendance = await attendanceService.getAttendanceById(attendanceId);

            if (!attendance) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Attendance record not found',
                    },
                });
            }

            // Staff can only check out their own records
            if (req.user?.role === 'staff' && attendance.user_id !== userId) {
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only check out your own attendance',
                    },
                });
            }

            if (attendance.check_out) {
                return res.status(400).json({
                    error: {
                        code: 'ALREADY_CHECKED_OUT',
                        message: 'Already checked out',
                    },
                });
            }

            const updatedAttendance = await attendanceService.updateCheckOut(attendanceId, new Date());

            return res.json({
                data: updatedAttendance,
                message: 'Checked out successfully',
            });
        } catch (error: any) {
            console.error(`[CHECKOUT ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/attendance - Get attendance records
    async getAttendance(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;

            const filters: any = {};

            // Query parameters
            if (req.query.user_id) filters.user_id = parseInt(req.query.user_id as string);
            if (req.query.date) filters.date = req.query.date as string;
            if (req.query.month) filters.month = parseInt(req.query.month as string);
            if (req.query.year) filters.year = parseInt(req.query.year as string);

            // Staff can only view their own attendance
            if (role === 'staff') {
                filters.user_id = userId;
            } else if (role === 'pos') {
                // POS can only view their own attendance
                filters.user_id = userId;
            }

            const attendance = await attendanceService.getAttendance(filters);

            return res.json({
                data: attendance,
            });
        } catch (error: any) {
            console.error(`[GET ATTENDANCE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/attendance/:id - Get single attendance record
    async getAttendanceById(req: AuthRequest, res: Response) {
        try {
            const attendanceId = parseInt(req.params.id);

            if (!attendanceId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Attendance ID is required',
                    },
                });
            }

            const attendance = await attendanceService.getAttendanceById(attendanceId);

            if (!attendance) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Attendance record not found',
                    },
                });
            }

            // Staff can only view their own records
            if (req.user?.role === 'staff' && attendance.user_id !== req.user.id) {
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only view your own attendance',
                    },
                });
            }

            return res.json({
                data: attendance,
            });
        } catch (error: any) {
            console.error(`[GET ATTENDANCE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/attendance/:id - Update attendance notes (manager only)
    async updateAttendance(req: AuthRequest, res: Response) {
        try {
            const attendanceId = parseInt(req.params.id);
            const { notes } = req.body;

            if (!attendanceId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Attendance ID is required',
                    },
                });
            }

            const attendance = await attendanceService.getAttendanceById(attendanceId);

            if (!attendance) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Attendance record not found',
                    },
                });
            }

            const updatedAttendance = await attendanceService.updateAttendance(attendanceId, { notes });

            return res.json({
                data: updatedAttendance,
                message: 'Attendance updated successfully',
            });
        } catch (error: any) {
            console.error(`[UPDATE ATTENDANCE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
