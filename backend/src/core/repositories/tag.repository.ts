import { Prisma, Etiqueta } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const TagRepository = {
  async create(data: Prisma.EtiquetaCreateInput): Promise<Etiqueta> {
    return prisma.etiqueta.create({
      data,
    });
  },

  async findByUserId(userId: string): Promise<Etiqueta[]> {
    return prisma.etiqueta.findMany({
      where: {
        usuario_id: userId,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  },

  async findByNameAndUserId(name: string, userId: string): Promise<Etiqueta | null> {
    return prisma.etiqueta.findUnique({
      where: {
        nombre_usuario_id: {
          nombre: name,
          usuario_id: userId,
        },
      },
    });
  },
};
