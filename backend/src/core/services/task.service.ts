import { Prisma, Tarea } from '@prisma/client';
import { TaskRepository, TareaFilters, TareaOrderBy } from '../repositories/task.repository';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { TagService } from './tag.service';

export type CreateTaskData = Omit<Prisma.TareaCreateInput, 'usuario' | 'etiquetas'>;

export const TaskService = {
  async create(
    userId: string,
    taskData: CreateTaskData,
    tagNames?: string[]
  ): Promise<Tarea> {
    const tagIds = tagNames && tagNames.length > 0
      ? await TagService.findOrCreateByNames(userId, tagNames)
      : [];

    const task = await TaskRepository.create({
      ...taskData,
      usuario: {
        connect: { id: userId },
      },
      etiquetas: {
        connect: tagIds.map(id => ({ id })),
      },
    });

    return this.getByIdForUser(userId, task.id);
  },

  async getAllForUser(
    userId: string,
    filters: TareaFilters,
    orderBy: TareaOrderBy
  ): Promise<Tarea[]> {
    return TaskRepository.findMany(userId, filters, orderBy);
  },

  async update(
    userId: string,
    taskId: string,
    taskData: Prisma.TareaUpdateInput,
    tagNames?: string[]
  ): Promise<Tarea> {
    await this.getByIdForUser(userId, taskId); 

    let tagIdsToSet: { id: string }[] | undefined;
    if (tagNames !== undefined) {
      const tagIds = await TagService.findOrCreateByNames(userId, tagNames);
      tagIdsToSet = tagIds.map(id => ({ id }));
    }

    const updatePayload = {
      ...taskData,
      etiquetas: {
        set: tagIdsToSet,
      },
    };

    await TaskRepository.update(taskId, updatePayload);

    return this.getByIdForUser(userId, taskId);
  },

  async getByIdForUser(userId: string, taskId: string): Promise<Tarea> {
    const task = await TaskRepository.findById(taskId);
    if (!task || task.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }
    return task;
  },

  async delete(userId: string, taskId: string): Promise<void> {
    await this.getByIdForUser(userId, taskId);
    await TaskRepository.delete(taskId);
  },

  async toggleCompletion(userId: string, taskId: string, completada: boolean): Promise<Tarea> {
    await this.getByIdForUser(userId, taskId);
    return TaskRepository.update(taskId, { completada });
  },
};