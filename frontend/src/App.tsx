import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthState from './context/auth/AuthState';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MainLayout from './components/Layout/MainLayout';
import TagList from './components/Etiqueta/TagList';
import CategoriesPage from './pages/CategoriesPage';
import TagManagementPage from './pages/TagManagementPage'; // Import the new page

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { auth } = useAuth();

  if (auth === null) {
    return <div>Cargando autenticación...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthState>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CategoriesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tags"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TagList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tags/manage" // New route for tag management
          element={
            <ProtectedRoute>
              <MainLayout>
                <TagManagementPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthState>
  );
};

export default App;