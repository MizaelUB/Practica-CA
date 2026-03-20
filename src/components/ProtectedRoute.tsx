import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export const ProtectedRoute = ({ requiredPermission }: ProtectedRouteProps) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    // Admin role natively gets all access for safety, or we strictly check the string:
    if (!user.permissions?.includes(requiredPermission) && !user.permissions?.includes('admin')) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};
