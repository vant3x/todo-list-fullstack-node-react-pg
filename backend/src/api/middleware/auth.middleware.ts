import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/ApiError';
import { UserRepository } from '../../core/repositories/user.repository';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Usuario no encontrado.'));
      }

      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;

      next();
    } catch (error) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token no válido o expirado.'));
    }
  }

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'No autorizado. Se requiere un token.'));
  }
};