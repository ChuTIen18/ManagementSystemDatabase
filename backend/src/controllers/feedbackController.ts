import { Request, Response } from 'express';
import { feedbackService } from '../services/feedbackService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const feedbackController = {
    async createCustomerFeedback(req: AuthRequest, res: Response) {
        try {
            const {
                order_id,
                overall_rating,
                service_rating,
                quality_rating,
                ambiance_rating,
                comment,
            } = req.body;

            if (!order_id || !overall_rating) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'order_id and overall_rating are required',
                    },
                });
            }

            const existing = await feedbackService.getFeedbackByOrderId(Number(order_id));
            if (existing) {
                return res.status(409).json({
                    error: {
                        code: 'DUPLICATE_FEEDBACK',
                        message: 'Feedback already exists for this order',
                    },
                });
            }

            const feedback = await feedbackService.createCustomerFeedback({
                order_id: Number(order_id),
                overall_rating: Number(overall_rating),
                service_rating:
                    service_rating !== undefined && service_rating !== ''
                        ? Number(service_rating)
                        : null,
                quality_rating:
                    quality_rating !== undefined && quality_rating !== ''
                        ? Number(quality_rating)
                        : null,
                ambiance_rating:
                    ambiance_rating !== undefined && ambiance_rating !== ''
                        ? Number(ambiance_rating)
                        : null,
                comment: comment || null,
            });

            return res.status(201).json({ data: feedback, message: 'Feedback submitted successfully' });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async getCustomerFeedbacks(req: AuthRequest, res: Response) {
        try {
            const feedbacks = await feedbackService.getCustomerFeedbacks();
            return res.json({ data: feedbacks });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async getCustomerFeedbackById(req: AuthRequest, res: Response) {
        try {
            const feedback = await feedbackService.getCustomerFeedbackById(Number(req.params.id));
            if (!feedback) {
                return res.status(404).json({
                    error: { code: 'NOT_FOUND', message: 'Feedback not found' },
                });
            }
            return res.json({ data: feedback });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async getCustomerSatisfactionSummary(req: AuthRequest, res: Response) {
        try {
            const summary = await feedbackService.getCustomerSatisfactionSummary();
            return res.json({ data: summary });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async deleteCustomerFeedback(req: AuthRequest, res: Response) {
        try {
            const feedback = await feedbackService.getCustomerFeedbackById(Number(req.params.id));
            if (!feedback) {
                return res.status(404).json({
                    error: { code: 'NOT_FOUND', message: 'Feedback not found' },
                });
            }

            await feedbackService.deleteCustomerFeedback(Number(req.params.id));
            return res.json({ data: null, message: 'Feedback deleted successfully' });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async createPosFeedback(req: AuthRequest, res: Response) {
        try {
            const { feedback_type, description, priority } = req.body;
            if (!feedback_type || !description) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'feedback_type and description are required',
                    },
                });
            }

            const feedback = await feedbackService.createPosFeedback({
                feedback_type,
                description,
                priority,
                created_by: req.user?.id || 0,
            });

            return res.status(201).json({ data: feedback, message: 'POS feedback created successfully' });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async getPosFeedbacks(req: AuthRequest, res: Response) {
        try {
            const feedbacks = await feedbackService.getPosFeedbacks();
            return res.json({ data: feedbacks });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async updatePosFeedbackStatus(req: AuthRequest, res: Response) {
        try {
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'status is required',
                    },
                });
            }

            const updated = await feedbackService.updatePosFeedbackStatus(
                Number(req.params.id),
                status,
                req.user?.id
            );

            if (!updated) {
                return res.status(404).json({
                    error: { code: 'NOT_FOUND', message: 'Feedback not found' },
                });
            }

            return res.json({ data: updated, message: 'POS feedback status updated successfully' });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async deletePosFeedback(req: AuthRequest, res: Response) {
        try {
            const feedback = await feedbackService.getPosFeedbackById(Number(req.params.id));
            if (!feedback) {
                return res.status(404).json({
                    error: { code: 'NOT_FOUND', message: 'Feedback not found' },
                });
            }

            await feedbackService.deletePosFeedback(Number(req.params.id));
            return res.json({ data: null, message: 'POS feedback deleted successfully' });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
