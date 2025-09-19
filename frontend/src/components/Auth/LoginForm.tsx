import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth';
import styles from './AuthForm.module.css';
import { NavLink } from 'react-router-dom';

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
      
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
      <h2>Iniciar Sesión</h2>

      {(message || errorSession?.detail) && (
        <p className={styles.errorMessage}>{message || errorSession?.detail}</p>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          required
          className={errors.email ? styles.inputError : ''}
        />
        {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          required
          className={errors.password ? styles.inputError : ''}
        />
        {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      <p className={styles.linkText}>
        ¿No tienes cuenta? <NavLink
                    to={"/registrar"}> Regístrate aquí</NavLink>
      </p>
    </form>
  );
};

export default LoginForm;