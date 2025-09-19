import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth';
import styles from './AuthForm.module.css';

const registerSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Formato de email inválido").min(1, "El email es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").min(1, "La contraseña es requerida"),
});

type RegisterFormSchema = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { signup, message, errorSession, signupStatus } = useAuth(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    try {
      await signup(data);
    } catch (err: any) {
   
    }
  };

  useEffect(() => {
    if (signupStatus === 201 && message) {
      console.log("Registro exitoso", message);
      navigate('/login');
    }
  }, [signupStatus, message]);

  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
      <h2>Registrarse</h2>

      {(message || errorSession?.detail) && (
        <p className={styles.errorMessage}>{message || errorSession?.detail}</p>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          {...register('nombre')}
          required
          className={errors.nombre ? styles.inputError : ''}
        />
        {errors.nombre && <p className={styles.errorMessage}>{errors.nombre.message}</p>}
      </div>
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
        {isSubmitting ? 'Registrando...' : 'Registrar'}
      </button>
      <p className={styles.linkText}>
        ¿Ya tienes cuenta? <NavLink
                    to={"/login"}> Inicia sesión aquí</NavLink>
      </p>
    </form>
  );
};

export default RegisterForm;
