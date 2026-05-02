import { Router } from 'express';
import { equipmentController } from '../controllers/equipmentController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All equipment routes require authentication
router.use(authMiddleware);

// GET /api/v1/equipment - Get all equipment (read access for all)
router.get('/', equipmentController.getEquipment);

// GET /api/v1/equipment/:id - Get single equipment
router.get('/:id', equipmentController.getEquipmentById);

// POST /api/v1/equipment - Create equipment (manager only)
router.post('/', rbacMiddleware(['manager']), equipmentController.createEquipment);

// PUT /api/v1/equipment/:id - Update equipment (manager only)
router.put('/:id', rbacMiddleware(['manager']), equipmentController.updateEquipment);

// POST /api/v1/equipment/:id/maintenance - Record maintenance (manager only)
router.post('/:id/maintenance', rbacMiddleware(['manager']), equipmentController.recordMaintenance);

// DELETE /api/v1/equipment/:id - Delete equipment (manager only)
router.delete('/:id', rbacMiddleware(['manager']), equipmentController.deleteEquipment);

export default router;
