import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
import categoryRoutes from './category.routes';
router.use('/categories', categoryRoutes);

export default router;