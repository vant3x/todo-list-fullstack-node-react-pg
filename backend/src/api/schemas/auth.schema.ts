import { z } from 'zod';

/**
 * Esquema de validación para el registro de un usuario.
 * Valida que el cuerpo de la petición contenga nombre, email y password
 * con los formatos y longitudes correctas.
 */
export const registerSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre es requerido.',
  }).min(3, 'El nombre debe tener al menos 3 caracteres.'),
  
  email: z.string({
    required_error: 'El email es requerido.',
  }).email('El formato del email no es válido.'),

  password: z.string({
    required_error: 'La contraseña es requerida.',
  }).min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

/**
 * Esquema de validación para el login de un usuario.
 */
export const loginSchema = z.object({
  email: z.string({
    required_error: 'El email es requerido.',
  }).email('El formato del email no es válido.'),

  password: z.string({
    required_error: 'La contraseña es requerida.',
  }),
});
