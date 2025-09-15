import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth';
import type { LoginFormValues } from '../../../interfaces/AuthContextType';

const loginSchema = z.object({
  email: z.string().email("Formato de email inválido").min(1, "El email es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").min(1, "La contraseña es requerida"),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login, message, errorSession } = useAuth(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      await login(data);
    } catch (err: any) {
      // API errors are now fully handled by AuthState and set in context.message/errorSession
      // No need for local setFormError here, context errors will be displayed
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>

      {(message || errorSession?.message) && (
        <p style={{ color: 'red' }}>{message || errorSession?.message}</p>
      )}
      {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
      {errors.root?.serverError && (
        <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>
      )}

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando sesión' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;