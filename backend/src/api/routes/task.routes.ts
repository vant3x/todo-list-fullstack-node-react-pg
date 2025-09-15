import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { protect } from '../middleware/auth.middleware';
import { createTaskInputSchema, updateTaskInputSchema, updateTaskCompletionInputSchema } from '../schemas/task.schema';
import { TaskService } from '../../core/services/task.service';

const router = Router();

router.use(protect);

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createTaskInputSchema.parse(req.body);
    const userId = req.user!.id;

    const task = await TaskService.create(userId, validatedData);

    res.status(StatusCodes.CREATED).json(task);
  } catch (error) {
    next(error);
  }
};

router.post('/', createTask);

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

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const validatedData = updateTaskInputSchema.parse(req.body);

    const updatedTask = await TaskService.update(userId, id, validatedData);

    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

router.put('/:id', updateTask);

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await TaskService.getByIdForUser(userId, id);

    res.status(StatusCodes.OK).json(task);
  } catch (error) {
    next(error);
  }
};

router.get('/:id', getTaskById);

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await TaskService.delete(userId, id);

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

router.delete('/:id', deleteTask);

const toggleTaskCompletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { completada } = updateTaskCompletionInputSchema.parse(req.body);

    const updatedTask = await TaskService.toggleCompletion(userId, id, completada);

    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

router.patch('/:id/complete', toggleTaskCompletion);

export default router;