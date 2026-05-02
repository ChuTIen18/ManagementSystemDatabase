import { Request, Response } from 'express';
import { menuService } from '../services/menuService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const menuController = {
    // GET /api/v1/menu
    async getAllMenuItems(req: Request, res: Response) {
        try {
            const { category, availableOnly } = req.query;

            const items = await menuService.getAllMenuItems({
                category: category as string,
                availableOnly: availableOnly === 'true',
            });

            return res.json({ data: items });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/menu/:id
    async getMenuItemById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const item = await menuService.getMenuItemById(parseInt(id));

            return res.json({ data: item });
        } catch (error: any) {
            if (error.message === 'MENU_ITEM_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'MENU_ITEM_NOT_FOUND',
                        message: 'Menu item not found',
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

    // POST /api/v1/menu
    async createMenuItem(req: AuthRequest, res: Response) {
        try {
            const { name, category, price, cost, description, imageUrl } = req.body;

            if (!name || !category || !price) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'name, category, and price are required',
                    },
                });
            }

            const item = await menuService.createMenuItem({
                name,
                category,
                price,
                cost,
                description,
                imageUrl,
            });

            return res.status(201).json({ data: item });
        } catch (error: any) {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/menu/:id
    async updateMenuItem(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            const item = await menuService.updateMenuItem(parseInt(id), data);

            return res.json({ data: item });
        } catch (error: any) {
            if (error.message === 'MENU_ITEM_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'MENU_ITEM_NOT_FOUND',
                        message: 'Menu item not found',
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

    // PUT /api/v1/menu/:id/availability
    async toggleAvailability(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const item = await menuService.toggleAvailability(parseInt(id));

            return res.json({ data: item });
        } catch (error: any) {
            if (error.message === 'MENU_ITEM_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'MENU_ITEM_NOT_FOUND',
                        message: 'Menu item not found',
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

    // DELETE /api/v1/menu/:id
    async deleteMenuItem(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const result = await menuService.deleteMenuItem(parseInt(id));

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
