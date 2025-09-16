import { Prisma, Tarea, Etiqueta, TareaEtiqueta } from '@prisma/client';
import { TaskRepository, TareaFilters, TareaOrderBy } from '../repositories/task.repository';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { TagService } from './tag.service';
import { CategoryRepository } from '../repositories/category.repository';
import { prisma } from '../lib/prisma'; // Import prisma client

export type CreateTaskData = Omit<Prisma.TareaCreateInput, 'usuario' | 'etiquetas'>;

// Helper function to transform task tags for API response consistency
const transformTaskTags = (task: Tarea & { etiquetas?: (TareaEtiqueta & { etiqueta: Etiqueta })[] }): Tarea & { etiquetas?: Etiqueta[] } => {
  if (task.etiquetas) {
    return {
      ...task,
      etiquetas: task.etiquetas.map(te => te.etiqueta),
    };
  }
  return task;
};

export const TaskService = {
  async create(
    userId: string,
    taskData: CreateTaskData,
    tagNames?: string[]
  ): Promise<Tarea> {
    let { categoria_id, fecha_vencimiento, ...restOfTaskData } = taskData as any;

    // 1. Handle default category
    if (!categoria_id) {
      const defaultCategoryName = 'General';
      let generalCategory = await CategoryRepository.findByName(userId, defaultCategoryName);
      if (!generalCategory) {
        generalCategory = await CategoryRepository.create({
          nombre: defaultCategoryName,
          usuario: { connect: { id: userId } },
        });
      }
      categoria_id = generalCategory.id;
    }

    // 2. Handle tags
    const tagIds = tagNames && tagNames.length > 0
      ? await TagService.findOrCreateByNames(userId, tagNames)
      : [];

    // 3. Build the data payload for Prisma
    const data: Prisma.TareaCreateInput = {
      ...restOfTaskData,
      usuario: {
        connect: { id: userId },
      },
      categoria: {
        connect: { id: categoria_id },
      },
    };

    // 4. Handle optional date conversion
    if (fecha_vencimiento) {
      data.fecha_vencimiento = new Date(fecha_vencimiento);
    }

    const task = await TaskRepository.create(data);

    // 5. Connect tags explicitly after task creation
    if (tagIds.length > 0) {
      await prisma.tareaEtiqueta.createMany({
        data: tagIds.map(etiqueta_id => ({ tarea_id: task.id, etiqueta_id })),
      });
    }

    return this.getByIdForUser(userId, task.id);
  },

  async getAllForUser(
    userId: string,
    filters: TareaFilters,
    orderBy: TareaOrderBy
  ): Promise<(Tarea & { etiquetas?: Etiqueta[] })[]> {
    const tasks = await TaskRepository.findMany(userId, filters, orderBy);
    return tasks.map(task => transformTaskTags(task));
  },

  async update(
    userId: string,
    taskId: string,
    taskData: Prisma.TareaUpdateInput,
    tagNames?: string[]
  ): Promise<Tarea> {
    await this.getByIdForUser(userId, taskId);

    const { categoria_id, fecha_vencimiento, ...restOfTaskData } = taskData as any;

    let tagIdsToSet: { id: string }[] | undefined;
    if (tagNames !== undefined) {
      const tagIds = await TagService.findOrCreateByNames(userId, tagNames);
      // Disconnect all existing tags for the task
      await prisma.tareaEtiqueta.deleteMany({
        where: { tarea_id: taskId },
      });
      // Connect new tags
      if (tagIds.length > 0) {
        await prisma.tareaEtiqueta.createMany({
          data: tagIds.map(etiqueta_id => ({ tarea_id: taskId, etiqueta_id })),
        });
      }
    }

    const updatePayload: Prisma.TareaUpdateInput = {
      ...restOfTaskData,
    };

    // Handle date conversion
    if (fecha_vencimiento) {
      updatePayload.fecha_vencimiento = new Date(fecha_vencimiento);
    } else if (Object.prototype.hasOwnProperty.call(taskData, 'fecha_vencimiento')) {
      updatePayload.fecha_vencimiento = null;
    }

    // Handle category connection/disconnection
    if (typeof categoria_id === 'string' && categoria_id.length > 0) {
      updatePayload.categoria = {
        connect: { id: categoria_id },
      };
    } else if (categoria_id === null) {
      updatePayload.categoria = {
        disconnect: true,
      };
    }

    await TaskRepository.update(taskId, updatePayload);
    return this.getByIdForUser(userId, taskId);
  },

  async getByIdForUser(userId: string, taskId: string): Promise<Tarea & { etiquetas?: Etiqueta[] }> {
    const task = await TaskRepository.findById(taskId);
    if (!task || task.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }
    return transformTaskTags(task);
  },

  async delete(userId: string, taskId: string): Promise<void> {
    await this.getByIdForUser(userId, taskId);
    await TaskRepository.delete(taskId);
  },

  async toggleCompletion(userId: string, taskId: string, completada: boolean): Promise<Tarea> {
    await this.getByIdForUser(userId, taskId);
    const updateData: Prisma.TareaUpdateInput = {
      completada,
      fecha_completado: completada ? new Date() : null,
    };
    return TaskRepository.update(taskId, updateData);
  },
};
