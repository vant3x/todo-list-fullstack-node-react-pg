import { z } from 'zod';

export const createTagInputSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre de la etiqueta es requerido.',
  }).min(1, 'El nombre de la etiqueta no puede estar vacío.'),
});
