import React from 'react';
import LoginForm from '../components/Auth/LoginForm'; 
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import styles from '../components/Auth/AuthForm.module.css';

const LoginPage: React.FC = () => {
  const { auth } = useAuth();

  if (auth) {
    return <Navigate to="/" replace />; 
  }

  return (
    <div className={styles.authContainer}>
      <LoginForm /> 
    </div>
  );
};

export default LoginPage;
