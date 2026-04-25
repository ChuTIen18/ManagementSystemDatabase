import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import tableRoutes from './table.routes';
import inventoryRoutes from './inventory.routes';
import reportRoutes from './report.routes';
import staffRoutes from './staff.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/tables', tableRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);
router.use('/staff', staffRoutes);

export default router;
