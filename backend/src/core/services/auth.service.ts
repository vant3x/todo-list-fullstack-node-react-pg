import { Prisma } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const AuthService = {
  /**
   * Registra un nuevo usuario.
   * @param userData Datos del usuario para el registro.
   * @returns El usuario creado sin la contraseña.
   */
  async register(userData: Prisma.UsuarioCreateInput) {
    // 1. Verificar si el usuario ya existe
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'El correo electrónico ya está en uso.');
    }

    // 2. Hashear la contraseña (10 es el número de "salt rounds")
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Crear el usuario en la base de datos
    const newUser = await UserRepository.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
    });

    // 4. Omitir la contraseña del objeto de usuario que se devuelve
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  /**
   * Autentica a un usuario y devuelve un token JWT.
   * @param loginData Datos del login (email y password).
   * @returns Un objeto con el token JWT.
   */
  async login(loginData: Pick<Prisma.UsuarioCreateInput, 'email' | 'password'>) {
    // 1. Buscar al usuario por email
    const user = await UserRepository.findByEmail(loginData.email);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Credenciales inválidas.'); // Mensaje genérico por seguridad
    }

    // 2. Comparar la contraseña enviada con la hasheada en la BD
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Credenciales inválidas.');
    }

    // 3. Generar el JWT
    const tokenPayload = { id: user.id, email: user.email };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 4. Devolver el token
    return { token };
  },
};
