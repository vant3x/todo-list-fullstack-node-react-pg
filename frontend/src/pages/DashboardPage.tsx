import React from 'react';
import useAuth from '../hooks/useAuth'; // Updated import

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <h2>Bienvenido, {user?.email}!</h2> {/* Changed from user?.name */}
      <p>Este es tu panel de control. Aquí verás tus tareas.</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default DashboardPage;