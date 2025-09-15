import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod'; // Cambiado AnyZodObject por ZodObject
import { ApiError } from './ApiError';
import { StatusCodes } from 'http-status-codes';

// El schema ahora es de tipo ZodObject
export const validate = (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod parsea el body, query y params por separado, no como un solo objeto.
      // Lo correcto es validar el `req` completo o las partes que esperas.
      // Para una API REST típica, validamos el body.
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Unimos los mensajes de error en uno solo.
        const errorMessages = error.errors.map((err) => err.message).join(', ');
        const message = `Error de validación: ${errorMessages}`;
        // Creamos el ApiError con solo 2 argumentos.
        next(new ApiError(StatusCodes.BAD_REQUEST, message));
      } else {
        next(error);
      }
    }
  };