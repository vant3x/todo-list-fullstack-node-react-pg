import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Error de validación',
      errors: err.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  console.error(`[ERROR INESPERADO]: ${err.message}`);
  console.error(err.stack);
  // Rspuesta generica para errores no controlados   
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Ha ocurrido un error interno en el servidor.',
  });
};