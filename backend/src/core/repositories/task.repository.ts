import { Prisma, Tarea } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const TaskRepository = {
  /**
   * Crea una nueva tarea en la base de datos.
   * @param data Los datos de la tarea a crear.
   * @returns La tarea recién creada.
   */
  async create(data: Prisma.TareaCreateInput): Promise<Tarea> {
    return prisma.tarea.create({
      data,
    });
  },

  /**
   * Busca todas las tareas de un usuario específico.
   * @param userId El ID del usuario.
   * @returns Una lista de las tareas del usuario.
   */
  async findByUserId(userId: string): Promise<Tarea[]> {
    return prisma.tarea.findMany({
      where: {
        usuario_id: userId,
      },
      orderBy: {
        creado_en: 'desc',
      },
    });
  },
};
