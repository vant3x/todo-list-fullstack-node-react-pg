import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm'; 
import useAuth from '../hooks/useAuth'; 
import { Navigate } from 'react-router-dom';
import styles from '../components/Auth/AuthForm.module.css';

const RegisterPage: React.FC = () => {
  const { auth } = useAuth(); 

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.authContainer}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
