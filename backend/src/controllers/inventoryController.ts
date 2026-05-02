import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const inventoryController = {
    // POST /api/v1/inventory - Create inventory item (manager only)
    async createInventoryItem(req: AuthRequest, res: Response) {
        try {
            const { item_name, quantity, unit, min_quantity, supplier, cost_per_unit } = req.body;

            if (!item_name || quantity === undefined || !unit) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'item_name, quantity, and unit are required',
                    },
                });
            }

            const inventoryItem = await inventoryService.createInventoryItem({
                item_name,
                quantity,
                unit,
                min_quantity: min_quantity || 0,
                supplier: supplier || null,
                cost_per_unit: cost_per_unit || 0,
                last_updated_by: req.user?.id,
            });

            return res.status(201).json({
                data: inventoryItem,
                message: 'Inventory item created successfully',
            });
        } catch (error: any) {
            console.error(`[CREATE INVENTORY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/inventory - Get all inventory items
    async getInventoryItems(req: AuthRequest, res: Response) {
        try {
            const { low_stock = false } = req.query;

            let items = await inventoryService.getAllInventoryItems();

            // Filter low stock if requested
            if (low_stock === 'true') {
                items = items.filter(
                    (item: any) => item.quantity <= item.min_quantity
                );
            }

            return res.json({
                data: items,
            });
        } catch (error: any) {
            console.error(`[GET INVENTORY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/inventory/:id - Get single inventory item
    async getInventoryItemById(req: AuthRequest, res: Response) {
        try {
            const itemId = parseInt(req.params.id);

            if (!itemId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Inventory item ID is required',
                    },
                });
            }

            const item = await inventoryService.getInventoryItemById(itemId);

            if (!item) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Inventory item not found',
                    },
                });
            }

            return res.json({
                data: item,
            });
        } catch (error: any) {
            console.error(`[GET INVENTORY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/inventory/:id - Update inventory item (manager only)
    async updateInventoryItem(req: AuthRequest, res: Response) {
        try {
            const itemId = parseInt(req.params.id);
            const { item_name, unit, min_quantity, supplier, cost_per_unit } = req.body;

            if (!itemId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Inventory item ID is required',
                    },
                });
            }

            const item = await inventoryService.getInventoryItemById(itemId);

            if (!item) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Inventory item not found',
                    },
                });
            }

            const updatedItem = await inventoryService.updateInventoryItem(itemId, {
                item_name,
                unit,
                min_quantity,
                supplier,
                cost_per_unit,
                last_updated_by: req.user?.id,
            });

            return res.json({
                data: updatedItem,
                message: 'Inventory item updated successfully',
            });
        } catch (error: any) {
            console.error(`[UPDATE INVENTORY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // POST /api/v1/inventory/:id/add - Add stock (manager only)
    async addStock(req: AuthRequest, res: Response) {
        try {
            const itemId = parseInt(req.params.id);
            const { quantity, notes } = req.body;

            if (!itemId || quantity === undefined) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Inventory item ID and quantity are required',
                    },
                });
            }

            if (quantity <= 0) {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_QUANTITY',
                        message: 'Quantity must be greater than 0',
                    },
                });
            }

            const item = await inventoryService.getInventoryItemById(itemId);

            if (!item) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Inventory item not found',
                    },
                });
            }

            const updatedItem = await inventoryService.addStock(itemId, quantity, notes, req.user?.id);

            return res.json({
                data: updatedItem,
                message: `Added ${quantity} units to stock`,
            });
        } catch (error: any) {
            console.error(`[ADD STOCK ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // POST /api/v1/inventory/:id/remove - Remove stock (manager only)
    async removeStock(req: AuthRequest, res: Response) {
        try {
            const itemId = parseInt(req.params.id);
            const { quantity, notes } = req.body;

            if (!itemId || quantity === undefined) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Inventory item ID and quantity are required',
                    },
                });
            }

            if (quantity <= 0) {
                return res.status(400).json({
                    error: {
                        code: 'INVALID_QUANTITY',
                        message: 'Quantity must be greater than 0',
                    },
                });
            }

            const item = await inventoryService.getInventoryItemById(itemId);

            if (!item) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Inventory item not found',
                    },
                });
            }

            if ((item as any).quantity < quantity) {
                return res.status(400).json({
                    error: {
                        code: 'INSUFFICIENT_STOCK',
                        message: `Only ${(item as any).quantity} units available`,
                    },
                });
            }

            const updatedItem = await inventoryService.removeStock(
                itemId,
                quantity,
                notes,
                req.user?.id
            );

            return res.json({
                data: updatedItem,
                message: `Removed ${quantity} units from stock`,
            });
        } catch (error: any) {
            console.error(`[REMOVE STOCK ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // DELETE /api/v1/inventory/:id - Delete inventory item (manager only)
    async deleteInventoryItem(req: AuthRequest, res: Response) {
        try {
            const itemId = parseInt(req.params.id);

            if (!itemId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Inventory item ID is required',
                    },
                });
            }

            const item = await inventoryService.getInventoryItemById(itemId);

            if (!item) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Inventory item not found',
                    },
                });
            }

            await inventoryService.deleteInventoryItem(itemId);

            return res.json({
                data: null,
                message: 'Inventory item deleted successfully',
            });
        } catch (error: any) {
            console.error(`[DELETE INVENTORY ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
