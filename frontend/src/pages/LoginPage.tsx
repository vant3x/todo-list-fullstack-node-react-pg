import React from 'react';
import LoginForm from '../components/Auth/LoginForm'; 
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { auth } = useAuth();

  if (auth) {
    return <Navigate to="/" replace />; 
  }

  return (
    <div className="login-page">
      <h1>Iniciar Sesión</h1>
      <LoginForm /> 
      <p>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
};

export default LoginPage;
