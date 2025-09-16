import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategoryInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           default: Work
 *     UpdateCategoryInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           default: Personal
 */
export const createCategoryInputSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre de la categoría es requerido.',
  }).min(1, 'El nombre de la categoría no puede estar vacío.'),
});

export const updateCategoryInputSchema = createCategoryInputSchema.partial();
