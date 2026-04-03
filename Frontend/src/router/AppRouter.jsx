import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import EmployeeListPage from '../pages/Employees/EmployeeListPage';
import DepartmentListPage from '../pages/Departments/DepartmentListPage';
import AttendancePage from '../pages/Attendance/AttendancePage';
import LeaveRequestsPage from '../pages/LeaveRequests/LeaveRequestsPage';

// ============================================================
// App Router
// ============================================================

function NotFound() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <span style={{ fontSize: 64, lineHeight: 1 }}>🔍</span>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)' }}>Trang không tồn tại</h2>
      <a href="/dashboard" style={{ color: 'var(--brand-primary)', fontSize: 'var(--font-size-sm)' }}>← Về Dashboard</a>
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <span style={{ fontSize: 64, lineHeight: 1 }}>🚧</span>
      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Tính năng đang được phát triển</p>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Core pages */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave-requests" element={<LeaveRequestsPage />} />

          {/* Placeholder routes (cho FE members khác) */}
          <Route path="/positions" element={<ComingSoon title="Quản lý chức vụ" />} />
          <Route path="/analytics" element={<ComingSoon title="Phân tích & Báo cáo" />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;