import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import categoryRoutes from './category.routes';
import tagRoutes from './tag.routes'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/tareas', taskRoutes);
router.use('/categorias', categoryRoutes);
router.use('/etiquetas', tagRoutes); 

export default router;