import { z } from 'zod';

export const registerUserSchema = z.object({
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

export const loginUserSchema = z.object({
  email: z.string({
    required_error: 'El email es requerido.',
  }).email('El formato del email no es válido.'),

  password: z.string({
    required_error: 'La contraseña es requerida.',
  }),
});