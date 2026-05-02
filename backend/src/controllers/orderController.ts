import { Request, Response } from 'express';
import { orderService } from '../services/orderService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const orderController = {
    // GET /api/v1/orders
    async getAllOrders(req: AuthRequest, res: Response) {
        try {
            const { status, date, page = 1, limit = 20 } = req.query;

            const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

            const orders = await orderService.getAllOrders({
                status: status as string,
                date: date as string,
                limit: parseInt(limit as string),
                offset,
            });

            return res.json({ data: orders });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/orders/:id
    async getOrderById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const order = await orderService.getOrderById(parseInt(id));

            return res.json({ data: order });
        } catch (error: any) {
            if (error.message === 'ORDER_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'ORDER_NOT_FOUND',
                        message: 'Order not found',
                    },
                });
            }

            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // POST /api/v1/orders
    async createOrder(req: AuthRequest, res: Response) {
        try {
            const { tableId, customerName, customerPhone, orderType } = req.body;

            if (!orderType) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'orderType is required',
                    },
                });
            }

            const result = await orderService.createOrder(
                tableId || null,
                customerName || null,
                customerPhone || null,
                orderType,
                req.user?.id || 0
            );

            return res.status(201).json({ data: result });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/orders/:id/status
    async updateOrderStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'status is required',
                    },
                });
            }

            const order = await orderService.updateOrderStatus(parseInt(id), status);

            return res.json({ data: order });
        } catch (error: any) {
            if (error.message === 'ORDER_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'ORDER_NOT_FOUND',
                        message: 'Order not found',
                    },
                });
            }

            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // POST /api/v1/orders/:id/items
    async addOrderItem(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { menuItemId, quantity, unitPrice, notes } = req.body;

            if (!menuItemId || !quantity || !unitPrice) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'menuItemId, quantity, and unitPrice are required',
                    },
                });
            }

            const result = await orderService.addOrderItem(
                parseInt(id),
                menuItemId,
                quantity,
                unitPrice,
                notes
            );

            return res.status(201).json({ data: result });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // DELETE /api/v1/orders/:id/items/:itemId
    async removeOrderItem(req: AuthRequest, res: Response) {
        try {
            const { id, itemId } = req.params;

            const result = await orderService.removeOrderItem(parseInt(id), parseInt(itemId));

            return res.json({ data: result });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/orders/:id/payment
    async updatePayment(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { paymentMethod, paymentStatus } = req.body;

            if (!paymentMethod || !paymentStatus) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'paymentMethod and paymentStatus are required',
                    },
                });
            }

            const order = await orderService.updatePayment(
                parseInt(id),
                paymentMethod,
                paymentStatus
            );

            return res.json({ data: order });
        } catch (error: any) {
            if (error.message === 'ORDER_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'ORDER_NOT_FOUND',
                        message: 'Order not found',
                    },
                });
            }

            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // DELETE /api/v1/orders/:id
    async cancelOrder(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const result = await orderService.cancelOrder(parseInt(id));

            return res.json({ data: result });
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
