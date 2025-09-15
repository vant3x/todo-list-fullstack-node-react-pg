import { Prisma } from '@prisma/client';
import { TaskRepository } from '../repositories/task.repository';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';

export type CreateTaskData = Omit<Prisma.TareaCreateInput, 'usuario'>;

export const TaskService = {
  async create(userId: string, taskData: CreateTaskData) {
    const task = await TaskRepository.create({
      ...taskData,
      usuario: {
        connect: { id: userId },
      },
    });
    return task;
  },

  async getAllForUser(userId: string) {
    return TaskRepository.findByUserId(userId);
  },

  async update(userId: string, taskId: string, taskData: Prisma.TareaUpdateInput) {
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    if (task.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    return TaskRepository.update(taskId, taskData);
  },

  async getByIdForUser(userId: string, taskId: string) {
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    if (task.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    return task;
  },

  async delete(userId: string, taskId: string) {
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    if (task.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    return TaskRepository.delete(taskId);
  },

  async toggleCompletion(userId: string, taskId: string, completada: boolean) {
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    if (task.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La tarea no fue encontrada.');
    }

    return TaskRepository.update(taskId, { completada });
  },
};