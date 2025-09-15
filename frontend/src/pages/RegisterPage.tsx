import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm'; // Import the RegisterForm component
import useAuth from '../hooks/useAuth'; // Import useAuth from the new location
import { Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { auth } = useAuth(); // Use 'auth' from the new context

  // If already authenticated, redirect to dashboard
  if (auth) {
    return <Navigate to="/" replace />; // Assuming '/' redirects to dashboard
  }

  // The RegisterForm component now handles its own state and submission
  return (
    <div className="register-page">
      <h1>Registrarse</h1>
      <RegisterForm /> {/* Render the RegisterForm component */}
      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default RegisterPage;
