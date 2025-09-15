import { Prisma, Tarea, Prioridad } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface TareaFilters {
  completed?: boolean;
  categoryId?: string;
  priority?: Prioridad;
  dueDateStart?: Date;
  dueDateEnd?: Date;
  search?: string;
  tagNames?: string[];
}

export interface TareaOrderBy {
  field: 'createdAt' | 'dueDate' | 'priority' | 'titulo';
  direction: 'asc' | 'desc';
}

export const TaskRepository = {
  async create(data: Prisma.TareaCreateInput): Promise<Tarea> {
    return prisma.tarea.create({
      data,
    });
  },

  async findMany(
    userId: string,
    filters: TareaFilters = {},
    orderBy: TareaOrderBy = { field: 'createdAt', direction: 'desc' }
  ): Promise<Tarea[]> {
    const where: Prisma.TareaWhereInput = {
      usuario_id: userId,
    };

    if (filters.completed !== undefined) {
      where.completada = filters.completed;
    }
    if (filters.categoryId) {
      where.categoria_id = filters.categoryId;
    }
    if (filters.priority) {
      where.prioridad = filters.priority;
    }
    if (filters.dueDateStart || filters.dueDateEnd) {
      where.fecha_vencimiento = {};
      if (filters.dueDateStart) {
        (where.fecha_vencimiento as Prisma.DateTimeFilter).gte = filters.dueDateStart;
      }
      if (filters.dueDateEnd) {
        (where.fecha_vencimiento as Prisma.DateTimeFilter).lte = filters.dueDateEnd;
      }
    }
    if (filters.search) {
      where.OR = [
        { titulo: { contains: filters.search, mode: 'insensitive' } },
        { descripcion: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.tagNames && filters.tagNames.length > 0) {
      where.etiquetas = {
        some: {
          nombre: {
            in: filters.tagNames,
            mode: 'insensitive',
          },
        },
      };
    }

    const orderByClause: Prisma.TareaOrderByWithRelationInput = {
      [orderBy.field]: orderBy.direction,
    };

    return prisma.tarea.findMany({
      where,
      orderBy: orderByClause,
      include: {
        categoria: true,
        etiquetas: true,
      },
    });
  },

  async findById(id: string): Promise<Tarea | null> {
    return prisma.tarea.findUnique({
      where: { id },
      include: {
        categoria: true,
        etiquetas: true,
      },
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