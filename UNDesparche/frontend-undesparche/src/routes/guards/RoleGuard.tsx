import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import type { RoleName } from '../../modules/auth/types/auth.types';

interface RoleGuardProps {
  /** Roles permitidos para acceder */
  requiredRoles: RoleName | RoleName[];
  /** Componente a renderizar */
  children: ReactNode;
}

export const RoleGuard = ({ requiredRoles, children }: RoleGuardProps) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Si no esta autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no tiene los roles requeridos, redirigir a pagina de no autorizado
  if (!hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si paso todos los checks, renderizar el componente
  return <>{children}</>;
};

export default RoleGuard;