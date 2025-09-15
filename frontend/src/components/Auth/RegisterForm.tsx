import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
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
      name: '',
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register</h2>

      {(message || errorSession?.message) && (
        <p style={{ color: 'red' }}>{message || errorSession?.message}</p>
      )}
      {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
      {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
      {errors.root?.serverError && (
        <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>
      )}

      <div>
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          {...register('name')}
          required
        />
      </div>
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
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
