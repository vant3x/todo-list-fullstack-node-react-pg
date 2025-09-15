import { z } from 'zod';

export const createCategoryInputSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre de la categoría es requerido.',
  }).min(1, 'El nombre de la categoría no puede estar vacío.'),
});

export const updateCategoryInputSchema = createCategoryInputSchema.partial();
