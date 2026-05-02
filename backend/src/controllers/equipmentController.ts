import { Request, Response } from 'express';
import { equipmentService } from '../services/equipmentService.js';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: 'staff' | 'pos' | 'manager';
    };
}

export const equipmentController = {
    // POST /api/v1/equipment - Create equipment (manager only)
    async createEquipment(req: AuthRequest, res: Response) {
        try {
            const {
                equipment_name,
                equipment_type,
                purchase_date,
                purchase_cost,
                warranty_expiry,
                location,
                status,
            } = req.body;

            if (!equipment_name || !equipment_type || !purchase_date) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'equipment_name, equipment_type, and purchase_date are required',
                    },
                });
            }

            const equipment = await equipmentService.createEquipment({
                equipment_name,
                equipment_type,
                purchase_date,
                purchase_cost: purchase_cost || 0,
                warranty_expiry: warranty_expiry || null,
                location: location || null,
                status: status || 'working',
                last_maintained_by: req.user?.id,
            });

            return res.status(201).json({
                data: equipment,
                message: 'Equipment created successfully',
            });
        } catch (error: any) {
            console.error(`[CREATE EQUIPMENT ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/equipment - Get all equipment
    async getEquipment(req: AuthRequest, res: Response) {
        try {
            const { status, type } = req.query;

            let equipment = await equipmentService.getAllEquipment();

            if (status) {
                equipment = equipment.filter(
                    (e: any) => e.status === status
                );
            }

            if (type) {
                equipment = equipment.filter((e: any) => e.equipment_type === type);
            }

            return res.json({
                data: equipment,
            });
        } catch (error: any) {
            console.error(`[GET EQUIPMENT ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // GET /api/v1/equipment/:id - Get single equipment
    async getEquipmentById(req: AuthRequest, res: Response) {
        try {
            const equipmentId = parseInt(req.params.id);

            if (!equipmentId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Equipment ID is required',
                    },
                });
            }

            const equipment = await equipmentService.getEquipmentById(equipmentId);

            if (!equipment) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Equipment not found',
                    },
                });
            }

            return res.json({
                data: equipment,
            });
        } catch (error: any) {
            console.error(`[GET EQUIPMENT ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // PUT /api/v1/equipment/:id - Update equipment (manager only)
    async updateEquipment(req: AuthRequest, res: Response) {
        try {
            const equipmentId = parseInt(req.params.id);
            const {
                equipment_name,
                equipment_type,
                purchase_date,
                purchase_cost,
                warranty_expiry,
                location,
                status,
            } = req.body;

            if (!equipmentId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Equipment ID is required',
                    },
                });
            }

            const equipment = await equipmentService.getEquipmentById(equipmentId);

            if (!equipment) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Equipment not found',
                    },
                });
            }

            const updatedEquipment = await equipmentService.updateEquipment(equipmentId, {
                equipment_name,
                equipment_type,
                purchase_date,
                purchase_cost,
                warranty_expiry,
                location,
                status,
                last_maintained_by: req.user?.id,
            });

            return res.json({
                data: updatedEquipment,
                message: 'Equipment updated successfully',
            });
        } catch (error: any) {
            console.error(`[UPDATE EQUIPMENT ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // POST /api/v1/equipment/:id/maintenance - Record maintenance (manager only)
    async recordMaintenance(req: AuthRequest, res: Response) {
        try {
            const equipmentId = parseInt(req.params.id);
            const { maintenance_type, description, cost } = req.body;

            if (!equipmentId || !maintenance_type) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Equipment ID and maintenance_type are required',
                    },
                });
            }

            const equipment = await equipmentService.getEquipmentById(equipmentId);

            if (!equipment) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Equipment not found',
                    },
                });
            }

            const updatedEquipment = await equipmentService.recordMaintenance(
                equipmentId,
                {
                    maintenance_type,
                    description: description || null,
                    cost: cost || 0,
                },
                req.user?.id
            );

            return res.json({
                data: updatedEquipment,
                message: 'Maintenance recorded successfully',
            });
        } catch (error: any) {
            console.error(`[MAINTENANCE RECORD ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },

    // DELETE /api/v1/equipment/:id - Delete equipment (manager only)
    async deleteEquipment(req: AuthRequest, res: Response) {
        try {
            const equipmentId = parseInt(req.params.id);

            if (!equipmentId) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Equipment ID is required',
                    },
                });
            }

            const equipment = await equipmentService.getEquipmentById(equipmentId);

            if (!equipment) {
                return res.status(404).json({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Equipment not found',
                    },
                });
            }

            await equipmentService.deleteEquipment(equipmentId);

            return res.json({
                data: null,
                message: 'Equipment deleted successfully',
            });
        } catch (error: any) {
            console.error(`[DELETE EQUIPMENT ERROR] ${error.message}`);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error.message,
                },
            });
        }
    },
};
