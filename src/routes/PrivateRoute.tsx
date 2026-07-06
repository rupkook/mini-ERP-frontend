import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}
