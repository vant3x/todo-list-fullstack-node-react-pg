import { Prisma } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const AuthService = {
  async register(userData: Prisma.UsuarioCreateInput) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'El correo electrónico ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await UserRepository.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(loginData: Pick<Prisma.UsuarioCreateInput, 'email' | 'password'>) {
    const user = await UserRepository.findByEmail(loginData.email);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Credenciales inválidas.');
    }

    const tokenPayload = { id: user.id, email: user.email };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { token };
  },
};