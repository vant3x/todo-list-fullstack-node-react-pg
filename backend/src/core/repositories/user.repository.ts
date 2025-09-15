import { Prisma, Usuario } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Objeto Repositorio para el modelo Usuario.
 * Contiene todos los métodos para interactuar con la base de datos
 * para el modelo de Usuario.
 */
export const UserRepository = {
  /**
   * Busca un usuario por su dirección de email.
   * @param email El email del usuario a buscar.
   * @returns El usuario encontrado o null.
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email },
    });
  },

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param data Los datos del usuario a crear.
   * @returns El usuario recién creado.
   */
  async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    return prisma.usuario.create({
      data,
    });
  },

  /**
   * Busca un usuario por su ID.
   * @param id El ID del usuario a buscar.
   * @returns El usuario encontrado o null.
   */
  async findById(id: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id },
    });
  },
};
