import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './../store/useAuthStore';

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  // Nếu chưa đăng nhập, ép chuyển hướng về trang Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép render các component con (MainLayout)
  return <Outlet />;
}

export default ProtectedRoute;