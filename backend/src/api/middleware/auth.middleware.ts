import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/ApiError';
import { UserRepository } from '../../core/repositories/user.repository';

// Extendemos el tipo Request de Express para poder añadir nuestra propiedad `user`
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
      // 1. Extraer el token del header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // 3. Buscar al usuario por el ID del token y adjuntarlo a la request (sin la contraseña)
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Usuario no encontrado.'));
      }

      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;

      next(); // El usuario está autenticado, continuar a la siguiente función
    } catch (error) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token no válido o expirado.'));
    }
  }

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'No autorizado. Se requiere un token.'));
  }
};
