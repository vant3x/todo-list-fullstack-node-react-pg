import { Prioridad } from '@prisma/client';
import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { protect } from "../middleware/auth.middleware";
import {
  createTaskInputSchema,
  updateTaskInputSchema,
  updateTaskCompletionInputSchema,
} from "../schemas/task.schema";
import { TaskService } from "../../core/services/task.service";
import { ApiError } from "../../utils/ApiError"; // Ensure ApiError is imported

const router = Router();

router.use(protect);

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tagNames, ...taskData } = createTaskInputSchema.parse(req.body);
    const userId = req.user!.id;

    const task = await TaskService.create(userId, taskData, tagNames);

    res.status(StatusCodes.CREATED).json(task);
  } catch (error) {
    next(error);
  }
};

router.post("/", createTask);

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const {
      completada,
      categoria,
      prioridad,
      fecha_vencimiento_inicio,
      fecha_vencimiento_fin,
      busqueda,
      etiquetas,
      ordenar,
      direccion,
    } = req.query;

    const filters: any = {};
    if (completada !== undefined) {
      filters.completed = completada === "true";
    }
    if (categoria) {
      filters.categoryId = categoria as string;
    }
    if (prioridad) {
      filters.priority = prioridad as Prioridad;
    }
    if (fecha_vencimiento_inicio) {
      filters.dueDateStart = new Date(fecha_vencimiento_inicio as string);
    }
    if (fecha_vencimiento_fin) {
      filters.dueDateEnd = new Date(fecha_vencimiento_fin as string);
    }
    if (busqueda) {
      filters.search = busqueda as string;
    }
    if (etiquetas) {
      filters.tagNames = (etiquetas as string).split(",");
    }

    const orderBy: any = {};
    if (ordenar) {
      orderBy.field = ordenar as "creado_en" | "dueDate" | "priority" | "titulo";
      orderBy.direction = (direccion as "asc" | "desc") || "desc";
    } else {
      orderBy.field = "creado_en";
      orderBy.direction = "desc";
    }

    const tasks = await TaskService.getAllForUser(userId, filters, orderBy);
    res.status(StatusCodes.OK).json(tasks);
  } catch (error) {
    next(error);
  }
};

router.get("/", getTasks);

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { tagNames, ...taskData } = updateTaskInputSchema.parse(req.body); 

    const updatedTask = await TaskService.update(
      userId,
      id,
      taskData,
      tagNames
    ); 

    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

router.put("/:id", updateTask);

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

router.get("/:id", getTaskById);

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

router.delete("/:id", deleteTask);

const toggleTaskCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { completada } = updateTaskCompletionInputSchema.parse(req.body);

    const updatedTask = await TaskService.toggleCompletion(
      userId,
      id,
      completada
    );

    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

router.patch("/:id/complete", toggleTaskCompletion);

export default router;
