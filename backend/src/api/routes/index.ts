import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import categoryRoutes from './category.routes';
import tagRoutes from './tag.routes'; // Import tag routes

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/categories', categoryRoutes);
router.use('/etiquetas', tagRoutes); // Use tag routes with '/etiquetas' prefix

export default router;