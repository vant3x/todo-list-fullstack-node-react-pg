import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { protect } from '../middleware/auth.middleware';
import { createTaskSchema } from '../schemas/task.schema';
import { TaskService } from '../../core/services/task.service';

const router = Router();

// Aplicamos el middleware `protect` a todas las rutas de este archivo
router.use(protect);

/**
 * @route   POST /api/tareas
 * @desc    Crea una nueva tarea
 * @access  Private
 */
const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const userId = req.user!.id; // Sabemos que req.user existe gracias al middleware `protect`

    const task = await TaskService.create(userId, validatedData);

    res.status(StatusCodes.CREATED).json(task);
  } catch (error) {
    next(error);
  }
};

router.post('/', createTask);

/**
 * @route   GET /api/tareas
 * @desc    Obtiene todas las tareas del usuario autenticado
 * @access  Private
 */
const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tasks = await TaskService.getAllForUser(userId);
    res.status(StatusCodes.OK).json(tasks);
  } catch (error) {
    next(error);
  }
};

router.get('/', getTasks);

// --- Endpoints futuros ---
// router.get('/', ...);
// router.put('/:id', ...);
// router.delete('/:id', ...);
// router.patch('/:id/completar', ...);

export default router;
