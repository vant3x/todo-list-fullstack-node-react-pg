import { z } from 'zod';
import { Prioridad } from '@prisma/client';

/**
 * Esquema de validación para la creación de una Tarea.
 */
export const createTaskSchema = z.object({
  titulo: z
    .string({
      required_error: 'El título es requerido.',
    })
    .min(1, 'El título no puede estar vacío.'),

  descripcion: z.string().optional(),

  // Aceptamos un string en formato ISO 8601 y Zod lo valida como fecha
  fecha_vencimiento: z.string().datetime({ message: 'La fecha de vencimiento debe ser una fecha válida.' }).optional(),

  prioridad: z.nativeEnum(Prioridad, { errorMap: () => ({ message: 'La prioridad debe ser BAJA, MEDIA o ALTA.' }) }).optional(),

  categoria_id: z.string().cuid({ message: 'El ID de la categoría no es válido.' }).optional(),
});

/**
 * Esquema de validación para la actualización de una Tarea.
 * Todos los campos son opcionales.
 */
export const updateTaskSchema = createTaskSchema.partial();
