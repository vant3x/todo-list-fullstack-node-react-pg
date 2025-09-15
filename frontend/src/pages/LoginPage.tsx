import React from 'react';
import LoginForm from '../components/Auth/LoginForm'; // Import the LoginForm component
import useAuth from '../hooks/useAuth'; // Import useAuth from the new location
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { auth } = useAuth(); // Use 'auth' from the new context

  // If already authenticated, redirect to dashboard
  if (auth) {
    return <Navigate to="/" replace />; // Assuming '/' redirects to dashboard
  }

  // The LoginForm component now handles its own state and submission
  return (
    <div className="login-page">
      <h1>Iniciar Sesión</h1>
      <LoginForm /> {/* Render the LoginForm component */}
      <p>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
};

export default LoginPage;
