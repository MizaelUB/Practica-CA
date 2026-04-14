import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Verificar si el usuario tiene acceso al módulo admin
  if (!user?.moduleAccess?.includes('admin')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontSize: '24px', color: '#dc2626' }}>Acceso Denegado</h1>
        <p style={{ color: '#6b7280' }}>No tienes permisos para acceder al módulo de administración</p>
      </div>
    );
  }

  return <>{children}</>;
};
