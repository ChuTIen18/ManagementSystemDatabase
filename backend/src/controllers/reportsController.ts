import { Request, Response } from 'express';
import { reportsService } from '../services/reportsService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const reportsController = {
    async getSummary(req: AuthRequest, res: Response) {
        try {
            const summary = await reportsService.getSummary();
            return res.json({ data: summary });
        } catch (error: any) {
            return res.status(500).json({
                error: { code: 'INTERNAL_ERROR', message: error.message },
            });
        }
    },

    async getDailyRevenue(req: AuthRequest, res: Response) {
        try {
            const data = await reportsService.getDailyRevenue();
            return res.json({ data });
        } catch (error: any) {
            return res.status(500).json({
                error: { code: 'INTERNAL_ERROR', message: error.message },
            });
        }
    },

    async getLowStock(req: AuthRequest, res: Response) {
        try {
            const data = await reportsService.getLowStockAlert();
            return res.json({ data });
        } catch (error: any) {
            return res.status(500).json({
                error: { code: 'INTERNAL_ERROR', message: error.message },
            });
        }
    },

    async getTopItems(req: AuthRequest, res: Response) {
        try {
            const data = await reportsService.getTopSellingItems();
            return res.json({ data });
        } catch (error: any) {
            return res.status(500).json({
                error: { code: 'INTERNAL_ERROR', message: error.message },
            });
        }
    },

    async getCustomerSatisfaction(req: AuthRequest, res: Response) {
        try {
            const data = await reportsService.getCustomerSatisfaction();
            return res.json({ data });
        } catch (error: any) {
            return res.status(500).json({
                error: { code: 'INTERNAL_ERROR', message: error.message },
            });
        }
    },
};
