import { Router } from 'express';
import { inventoryController } from '../controllers/inventoryController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

// All inventory routes require authentication
router.use(authMiddleware);

// GET /api/v1/inventory - Get all items (read access for all)
router.get('/', inventoryController.getInventoryItems);

// GET /api/v1/inventory/:id - Get single item
router.get('/:id', inventoryController.getInventoryItemById);

// POST /api/v1/inventory - Create item (manager only)
router.post('/', rbacMiddleware(['manager']), inventoryController.createInventoryItem);

// PUT /api/v1/inventory/:id - Update item (manager only)
router.put('/:id', rbacMiddleware(['manager']), inventoryController.updateInventoryItem);

// POST /api/v1/inventory/:id/add - Add stock (manager only)
router.post('/:id/add', rbacMiddleware(['manager']), inventoryController.addStock);

// POST /api/v1/inventory/:id/remove - Remove stock (manager only)
router.post('/:id/remove', rbacMiddleware(['manager']), inventoryController.removeStock);

// DELETE /api/v1/inventory/:id - Delete item (manager only)
router.delete('/:id', rbacMiddleware(['manager']), inventoryController.deleteInventoryItem);

export default router;
