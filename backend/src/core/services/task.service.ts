import { Prisma } from '@prisma/client';
import { TaskRepository } from '../repositories/task.repository';

// Definimos un tipo para los datos de creación de la tarea, excluyendo el usuario_id
// que se añadirá en el servicio.
export type CreateTaskData = Omit<Prisma.TareaCreateInput, 'usuario'>;

export const TaskService = {
  /**
   * Crea una nueva tarea para un usuario específico.
   * @param userId El ID del usuario que crea la tarea.
   * @param taskData Los datos de la tarea.
   * @returns La tarea recién creada.
   */
  async create(userId: string, taskData: CreateTaskData) {
    const task = await TaskRepository.create({
      ...taskData,
      usuario: {
        connect: { id: userId },
      },
    });
    return task;
  },

  /**
   * Obtiene todas las tareas de un usuario.
   * @param userId El ID del usuario.
   * @returns Una lista de tareas.
   */
  async getAllForUser(userId: string) {
    return TaskRepository.findByUserId(userId);
  },
};
