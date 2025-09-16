import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTagInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           default: urgent
 */
export const createTagInputSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre de la etiqueta es requerido.',
  }).min(1, 'El nombre de la etiqueta no puede estar vacío.'),
});
