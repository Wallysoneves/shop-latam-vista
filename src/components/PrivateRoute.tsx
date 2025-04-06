import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  allowedRoles?: Array<'CLIENTE' | 'VENDEDOR'>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Se ainda estiver carregando, poderia mostrar um spinner
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se precisar verificar papéis e o usuário não tiver o papel necessário
  if (allowedRoles && user && !allowedRoles.includes(user.tipoUsuario)) {
    // Redireciona para a página de acesso negado ou para a home
    return <Navigate to="/acesso-negado" replace />;
  }

  // Se tudo estiver ok, renderiza o componente filho (Outlet)
  return <Outlet />;
};

export default PrivateRoute; 