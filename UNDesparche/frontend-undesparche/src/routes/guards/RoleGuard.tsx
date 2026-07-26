import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import type { RoleName } from '../../modules/auth/types/auth.types';

interface RoleGuardProps {
  requiredRoles: RoleName | RoleName[];
  forbiddenRoles?: RoleName | RoleName[];
  children: ReactNode;
}

export const RoleGuard = ({ requiredRoles, forbiddenRoles, children }: RoleGuardProps) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (forbiddenRoles && hasRole(forbiddenRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;