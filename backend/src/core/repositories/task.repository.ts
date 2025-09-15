import { Prisma, Tarea } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const TaskRepository = {
  async create(data: Prisma.TareaCreateInput): Promise<Tarea> {
    return prisma.tarea.create({
      data,
    });
  },

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

  async findById(id: string): Promise<Tarea | null> {
    return prisma.tarea.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Prisma.TareaUpdateInput): Promise<Tarea> {
    return prisma.tarea.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Tarea> {
    return prisma.tarea.delete({
      where: { id },
    });
  },
};