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
import { ApiError } from "../../utils/ApiError";

const router = Router();

router.use(protect);

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tagNames, ...taskData } = createTaskInputSchema.parse(req.body);
    const userId = req.user!.id;
    const task = await TaskService.create(userId, taskData, tagNames);
    res.status(StatusCodes.CREATED).json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks for the current user with filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completada
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *       - in: query
 *         name: prioridad
 *         schema:
 *           type: string
 *           enum: [BAJA, MEDIA, ALTA]
 *       - in: query
 *         name: fecha_vencimiento_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fecha_vencimiento_fin
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *       - in: query
 *         name: etiquetas
 *         schema:
 *           type: string
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [creado_en, fecha_vencimiento, prioridad, titulo]
 *       - in: query
 *         name: direccion
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: A list of tasks
 *       401:
 *         description: Unauthorized
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { completada, categoria, prioridad, fecha_vencimiento_inicio, fecha_vencimiento_fin, busqueda, etiquetas, ordenar, direccion } = req.query;
    const filters: any = {};
    if (completada !== undefined) filters.completed = completada === "true";
    if (categoria) filters.categoryId = categoria as string;
    if (prioridad) filters.priority = prioridad as Prioridad;
    if (fecha_vencimiento_inicio) filters.dueDateStart = new Date(fecha_vencimiento_inicio as string);
    if (fecha_vencimiento_fin) filters.dueDateEnd = new Date(fecha_vencimiento_fin as string);
    if (busqueda) filters.search = busqueda as string;
    if (etiquetas) filters.tagNames = (etiquetas as string).split(",");
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
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { tagNames, ...taskData } = updateTaskInputSchema.parse(req.body);
    const updatedTask = await TaskService.update(userId, id, taskData, tagNames);
    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get a task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const task = await TaskService.getByIdForUser(userId, id);
    res.status(StatusCodes.OK).json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    await TaskService.delete(userId, id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks/{id}/complete:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Toggle task completion status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskCompletionInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.patch("/:id/complete", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { completada } = updateTaskCompletionInputSchema.parse(req.body);
    const updatedTask = await TaskService.toggleCompletion(userId, id, completada);
    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
});

export default router;
