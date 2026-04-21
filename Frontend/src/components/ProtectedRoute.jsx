import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './../store/useAuthStore';

function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  // Nếu chưa đăng nhập, ép chuyển hướng về trang Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = user?.role;
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Nếu đã đăng nhập, cho phép render các component con (MainLayout)
  return <Outlet />;
}

export default ProtectedRoute;