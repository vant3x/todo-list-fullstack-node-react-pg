import { Prisma, Usuario } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const UserRepository = {
  async findByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email },
    });
  },

  async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    return prisma.usuario.create({
      data,
    });
  },

  async findById(id: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id },
    });
  },
};