import { StatusCodes } from 'http-status-codes';

/**
 * Clase de Error personalizada para la API.
 * Permite estandarizar los errores con un código de estado HTTP.
 */
export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
