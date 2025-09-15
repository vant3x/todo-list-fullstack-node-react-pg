import { z } from 'zod';
import { Prioridad } from '@prisma/client';

export const createTaskInputSchema = z.object({
  titulo: z
    .string({
      required_error: 'El título es requerido.',
    })
    .min(1, 'El título no puede estar vacío.'),

  descripcion: z.string().optional(),

  fecha_vencimiento: z.string().datetime({ message: 'La fecha de vencimiento debe ser una fecha válida.' }).optional(),

  prioridad: z.nativeEnum(Prioridad, { errorMap: () => ({ message: 'La prioridad debe ser BAJA, MEDIA o ALTA.' }) }).optional(),

  categoria_id: z.string().cuid({ message: 'El ID de la categoría no es válido.' }).optional(),

  tagNames: z.array(z.string()).optional(), // Add tagNames
});

export const updateTaskInputSchema = createTaskInputSchema.partial();

export const updateTaskCompletionInputSchema = z.object({
  completada: z.boolean({
    required_error: 'El estado de completado es requerido.',
  }),
});