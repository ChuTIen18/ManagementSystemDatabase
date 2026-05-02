import { Request, Response } from 'express';
import { tablesService } from '../services/tablesService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const tablesController = {
    async getTables(req: AuthRequest, res: Response) {
        try {
            const { available_only } = req.query;
            const tables =
                available_only === 'true'
                    ? await tablesService.getAvailableTables()
                    : await tablesService.getAllTables();

            return res.json({ data: tables });
        } catch (error: any) {
            console.error(`[GET TABLES ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async getTableById(req: AuthRequest, res: Response) {
        try {
            const tableId = parseInt(req.params.id);
            const table = await tablesService.getTableById(tableId);

            return res.json({ data: table });
        } catch (error: any) {
            if (error.message === 'TABLE_NOT_FOUND') {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Table not found',
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

    async createTable(req: AuthRequest, res: Response) {
        try {
            const { tableNumber, capacity, qrCode } = req.body;

            if (!tableNumber || capacity === undefined) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'tableNumber and capacity are required',
                    },
                });
            }

            const table = await tablesService.createTable({
                tableNumber,
                capacity: Number(capacity),
                qrCode: qrCode || null,
            });

            return res.status(201).json({
                data: table,
                message: 'Table created successfully',
            });
        } catch (error: any) {
            console.error(`[CREATE TABLE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async updateTable(req: AuthRequest, res: Response) {
        try {
            const tableId = parseInt(req.params.id);
            const { tableNumber, capacity, status, qrCode } = req.body;

            const table = await tablesService.getTableById(tableId);
            if (!table) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Table not found',
                    },
                });
            }

            const updatedTable = await tablesService.updateTable(tableId, {
                table_number: tableNumber,
                capacity: capacity !== undefined ? Number(capacity) : undefined,
                status,
                qr_code: qrCode,
            });

            return res.json({
                data: updatedTable,
                message: 'Table updated successfully',
            });
        } catch (error: any) {
            console.error(`[UPDATE TABLE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    async deleteTable(req: AuthRequest, res: Response) {
        try {
            const tableId = parseInt(req.params.id);
            const table = await tablesService.getTableById(tableId);

            if (!table) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Table not found',
                    },
                });
            }

            await tablesService.deleteTable(tableId);

            return res.json({
                data: null,
                message: 'Table deleted successfully',
            });
        } catch (error: any) {
            console.error(`[DELETE TABLE ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
