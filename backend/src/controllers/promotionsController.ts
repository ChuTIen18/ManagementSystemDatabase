import { Request, Response } from 'express';
import { promotionsService } from '../services/promotionsService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const promotionsController = {
    async createPromotion(req: AuthRequest, res: Response) {
        try {
            const {
                name,
                description,
                discount_type,
                discount_value,
                min_order_amount,
                max_discount_amount,
                applicable_items,
                start_date,
                end_date,
                is_active,
            } = req.body;

            if (!name || !discount_type || discount_value === undefined || !start_date || !end_date) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'name, discount_type, discount_value, start_date, and end_date are required',
                    },
                });
            }

            const promotion = await promotionsService.createPromotion({
                name,
                description: description || null,
                discount_type,
                discount_value: Number(discount_value),
                min_order_amount:
                    min_order_amount !== undefined && min_order_amount !== ''
                        ? Number(min_order_amount)
                        : null,
                max_discount_amount:
                    max_discount_amount !== undefined && max_discount_amount !== ''
                        ? Number(max_discount_amount)
                        : null,
                applicable_items:
                    Array.isArray(applicable_items)
                        ? applicable_items
                        : typeof applicable_items === 'string' && applicable_items
                          ? applicable_items
                                .split(',')
                                .map((item: string) => item.trim())
                                .filter(Boolean)
                          : null,
                start_date,
                end_date,
                is_active: is_active ?? true,
                created_by: req.user?.id || 0,
            });

            return res.status(201).json({
                data: promotion,
                message: 'Promotion created successfully',
            });
        } catch (error: any) {
            console.error(`[CREATE PROMOTION ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async getPromotions(req: AuthRequest, res: Response) {
        try {
            const { active_only } = req.query;
            const promotions =
                active_only === 'true'
                    ? await promotionsService.getActivePromotions()
                    : await promotionsService.getAllPromotions();

            return res.json({ data: promotions });
        } catch (error: any) {
            console.error(`[GET PROMOTIONS ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async getPromotionById(req: AuthRequest, res: Response) {
        try {
            const promotionId = parseInt(req.params.id);
            const promotion = await promotionsService.getPromotionById(promotionId);

            if (!promotion) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Promotion not found',
                    },
                });
            }

            return res.json({ data: promotion });
        } catch (error: any) {
            console.error(`[GET PROMOTION ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async updatePromotion(req: AuthRequest, res: Response) {
        try {
            const promotionId = parseInt(req.params.id);
            const updates = req.body;

            const promotion = await promotionsService.getPromotionById(promotionId);
            if (!promotion) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Promotion not found',
                    },
                });
            }

            const updatedPromotion = await promotionsService.updatePromotion(promotionId, {
                name: updates.name,
                description: updates.description,
                discount_type: updates.discount_type,
                discount_value:
                    updates.discount_value !== undefined ? Number(updates.discount_value) : undefined,
                min_order_amount:
                    updates.min_order_amount !== undefined && updates.min_order_amount !== ''
                        ? Number(updates.min_order_amount)
                        : undefined,
                max_discount_amount:
                    updates.max_discount_amount !== undefined && updates.max_discount_amount !== ''
                        ? Number(updates.max_discount_amount)
                        : undefined,
                applicable_items:
                    Array.isArray(updates.applicable_items)
                        ? updates.applicable_items
                        : typeof updates.applicable_items === 'string' && updates.applicable_items
                          ? updates.applicable_items
                                .split(',')
                                .map((item: string) => item.trim())
                                .filter(Boolean)
                          : undefined,
                start_date: updates.start_date,
                end_date: updates.end_date,
                is_active: updates.is_active,
            });

            return res.json({
                data: updatedPromotion,
                message: 'Promotion updated successfully',
            });
        } catch (error: any) {
            console.error(`[UPDATE PROMOTION ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async deletePromotion(req: AuthRequest, res: Response) {
        try {
            const promotionId = parseInt(req.params.id);

            const promotion = await promotionsService.getPromotionById(promotionId);
            if (!promotion) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Promotion not found',
                    },
                });
            }

            await promotionsService.deletePromotion(promotionId);

            return res.json({
                data: null,
                message: 'Promotion deleted successfully',
            });
        } catch (error: any) {
            console.error(`[DELETE PROMOTION ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async applyPromotionToOrder(req: AuthRequest, res: Response) {
        try {
            const orderId = parseInt(req.params.orderId);
            const { promotionId } = req.body;

            if (!promotionId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'promotionId is required',
                    },
                });
            }

            const order = await promotionsService.applyPromotionToOrder(orderId, parseInt(promotionId));

            return res.json({
                data: order,
                message: 'Promotion applied to order successfully',
            });
        } catch (error: any) {
            const status =
                error.message === 'ORDER_NOT_FOUND' || error.message === 'PROMOTION_NOT_FOUND'
                    ? 404
                    : error.message === 'MIN_ORDER_AMOUNT_NOT_MET'
                      ? 400
                      : 500;

            return res.status(status).json({
                error: {
                    code: error.message,
                    message:
                        error.message === 'MIN_ORDER_AMOUNT_NOT_MET'
                            ? 'Order does not meet minimum amount for this promotion'
                            : 'Unable to apply promotion',
                },
            });
        }
    },
};
