import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);

  // If there is no token, redirect to login.
  // Outlet renders the child routes if the user is authenticated.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;