import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod'; 
import { ApiError } from './ApiError';
import { StatusCodes } from 'http-status-codes';

export const validate = (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {

      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
 
        const errorMessages = error.errors.map((err) => err.message).join(', ');
        const message = `Error de validación: ${errorMessages}`;
     
        next(new ApiError(StatusCodes.BAD_REQUEST, message));
      } else {
        next(error);
      }
    }
  };