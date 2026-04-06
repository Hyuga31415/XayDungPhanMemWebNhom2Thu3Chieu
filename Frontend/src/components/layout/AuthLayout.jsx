import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

// ============================================================
// Auth Layout – Cho trang login (không có sidebar/header)
// ============================================================

function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  // Nếu đã đăng nhập, redirect về dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AuthLayout;
