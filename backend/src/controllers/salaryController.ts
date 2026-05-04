import { Request, Response } from 'express';
import { salaryService } from '../services/salaryService.js';
import { userService } from '../services/userService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const salaryController = {
    // POST /api/v1/salary/calculate - Calculate salary for a month (manager only)
    async calculateSalary(req: AuthRequest, res: Response) {
        try {
            const { user_id, month, year, bonus = 0, deductions = 0, notes } = req.body;

            if (!user_id || !month || !year) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'user_id, month, and year are required',
                    },
                });
            }

            if (month < 1 || month > 12) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Month must be between 1 and 12',
                    },
                });
            }

            // Get user details
            const user = await userService.getUserById(user_id);
            if (!user) {
                return res.status(404).json({
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found',
                    },
                });
            }

            // Calculate or recalculate salary. The service performs an UPSERT
            // on (user_id, month, year), so repeated calls update the existing row.
            const salary = await salaryService.calculateSalary({
                user_id,
                month,
                year,
                hourly_rate: (user as any).hourly_rate,
                bonus,
                deductions,
                notes,
            });

            return res.status(201).json({
                data: salary,
                message: 'Salary calculated successfully',
            });
        } catch (error: any) {
            console.error(`[CALCULATE SALARY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/salary - Get salary records
    async getSalaries(req: AuthRequest, res: Response) {
        try {
            const { user_id, month, year } = req.query;

            const filters: any = {};

            // Staff can only view their own salary
            if (req.user?.role === 'staff' || req.user?.role === 'pos') {
                filters.user_id = req.user.id;
            } else if (user_id) {
                filters.user_id = parseInt(user_id as string);
            }

            if (month) filters.month = parseInt(month as string);
            if (year) filters.year = parseInt(year as string);

            const salaries = await salaryService.getSalaries(filters);

            return res.json({
                data: salaries,
            });
        } catch (error: any) {
            console.error(`[GET SALARIES ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/salary/:id - Get single salary record
    async getSalaryById(req: AuthRequest, res: Response) {
        try {
            const salaryId = parseInt(req.params.id);

            if (!salaryId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Salary ID is required',
                    },
                });
            }

            const salary = await salaryService.getSalaryById(salaryId);

            if (!salary) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Salary record not found',
                    },
                });
            }

            // Staff can only view their own salary
            if (req.user?.role === 'staff' && (salary as any).user_id !== req.user.id) {
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only view your own salary',
                    },
                });
            }

            return res.json({
                data: salary,
            });
        } catch (error: any) {
            console.error(`[GET SALARY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/salary/:id - Update salary record (manager only)
    async updateSalary(req: AuthRequest, res: Response) {
        try {
            const salaryId = parseInt(req.params.id);
            const { bonus, deductions, notes } = req.body;

            if (!salaryId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Salary ID is required',
                    },
                });
            }

            const salary = await salaryService.getSalaryById(salaryId);

            if (!salary) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Salary record not found',
                    },
                });
            }

            const updatedSalary = await salaryService.updateSalary(salaryId, {
                bonus,
                deductions,
                notes,
            });

            return res.json({
                data: updatedSalary,
                message: 'Salary updated successfully',
            });
        } catch (error: any) {
            console.error(`[UPDATE SALARY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/salary/:id/pay - Mark salary as paid (manager only)
    async paySalary(req: AuthRequest, res: Response) {
        try {
            const salaryId = parseInt(req.params.id);

            if (!salaryId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Salary ID is required',
                    },
                });
            }

            const salary = await salaryService.getSalaryById(salaryId);

            if (!salary) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Salary record not found',
                    },
                });
            }

            if ((salary as any).paid_at) {
                return res.status(400).json({
                    error: {
                        code: 'ALREADY_PAID',
                        message: 'Salary already marked as paid',
                    },
                });
            }

            const paidSalary = await salaryService.markAsPaid(salaryId);

            return res.json({
                data: paidSalary,
                message: 'Salary marked as paid',
            });
        } catch (error: any) {
            console.error(`[PAY SALARY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
