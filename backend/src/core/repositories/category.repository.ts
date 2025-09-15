import { Prisma, Categoria } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const CategoryRepository = {
  async create(data: Prisma.CategoriaCreateInput): Promise<Categoria> {
    return prisma.categoria.create({
      data,
    });
  },

  async findByUserId(userId: string): Promise<Categoria[]> {
    return prisma.categoria.findMany({
      where: {
        usuario_id: userId,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  },

  async findById(id: string): Promise<Categoria | null> {
    return prisma.categoria.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Prisma.CategoriaUpdateInput): Promise<Categoria> {
    return prisma.categoria.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Categoria> {
    return prisma.categoria.delete({
      where: { id },
    });
  },
};
