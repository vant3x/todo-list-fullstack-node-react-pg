import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <h2>Bienvenido, {user?.name || user?.email}!</h2>
      <p>Este es tu panel de control. Aquí verás tus tareas.</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default DashboardPage;
