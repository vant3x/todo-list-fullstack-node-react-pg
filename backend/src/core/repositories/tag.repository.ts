import { Prisma, Etiqueta, TareaEtiqueta } from '@prisma/client';
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

  async associateTagWithTarea(tareaId: string, etiquetaId: string): Promise<TareaEtiqueta> {
    return prisma.tareaEtiqueta.create({
      data: {
        tarea_id: tareaId,
        etiqueta_id: etiquetaId,
      },
    });
  },

  async disassociateTagFromTarea(tareaId: string, etiquetaId: string): Promise<TareaEtiqueta> {
    return prisma.tareaEtiqueta.delete({
      where: {
        tarea_id_etiqueta_id: {
          tarea_id: tareaId,
          etiqueta_id: etiquetaId,
        },
      },
    });
  },

  async findTagsByTareaId(tareaId: string): Promise<Etiqueta[]> {
    const tareaEtiquetas = await prisma.tareaEtiqueta.findMany({
      where: {
        tarea_id: tareaId,
      },
      include: {
        etiqueta: true, 
      },
    });
    return tareaEtiquetas.map(te => te.etiqueta);
  },
};
