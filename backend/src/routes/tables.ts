import { Router } from 'express';
import { tablesController } from '../controllers/tablesController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', tablesController.getTables);
router.get('/:id', tablesController.getTableById);
router.post('/', rbacMiddleware(['manager']), tablesController.createTable);
router.put('/:id', rbacMiddleware(['manager']), tablesController.updateTable);
router.delete('/:id', rbacMiddleware(['manager']), tablesController.deleteTable);

export default router;
