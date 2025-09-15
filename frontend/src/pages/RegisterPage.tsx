import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm'; 
import useAuth from '../hooks/useAuth'; 
import { Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { auth } = useAuth(); 

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="register-page">
      <h1>Registrarse</h1>
      <RegisterForm />
      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default RegisterPage;
