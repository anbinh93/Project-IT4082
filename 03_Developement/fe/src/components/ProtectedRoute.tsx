import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const hasRequiredRole = requiredRoles.length === 0 || authService.hasRole(requiredRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole) {
    // Redirect to appropriate homepage based on user role
    const user = authService.getCurrentUser();
    if (user?.role === 'admin' || user?.role === 'accountant') {
      return <Navigate to="/homepage-ketoan" replace />;
    } else if (user?.role === 'manager') {
      return <Navigate to="/homepage-totruong" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
