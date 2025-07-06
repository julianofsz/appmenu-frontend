import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context as AuthContext } from '@/contexts/AuthContext';

export function ProtectedRoute() {
  const { authenticated, loading } = useContext(AuthContext)!;

  if (loading) {
    return <div>Carregando autenticação...</div>;
  }
  if (!authenticated) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}
