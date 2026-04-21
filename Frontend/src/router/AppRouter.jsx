import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginLayout from '../components/layout/LoginLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthLayout from '../components/layout/AuthLayout';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import EmployeeListPage from '../pages/Employees/EmployeeListPage';
import EmployeeDetailPage from '../pages/Employees/EmployeeDetailPage';
import DepartmentListPage from '../pages/Departments/DepartmentListPage';
import PositionListPage from '../pages/Positions/PositionListPage';
import AttendancePage from '../pages/Attendance/AttendancePage';
import LeaveRequestsPage from '../pages/LeaveRequests/LeaveRequestsPage';
import ShiftsPage from '../pages/Shifts/ShiftsPage';

// Đã cập nhật lại đường dẫn chuẩn sau khi bạn move file vào thư mục mới
import PayrollManagement from '../pages/Payroll/PayrollManagement';
import PayrollHistory from '../pages/Payroll/PayrollHistory';
import PayrollReports from '../pages/Payroll/PayrollReports';
import PayrollSettings from '../pages/Payroll/PayrollSettings';
import PayrollDetail from '../pages/Payroll/PayrollDetail';

import useAuthStore from '../store/useAuthStore';

// ============================================================
// CÁC COMPONENT PLACEHOLDER
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

// ============================================================
// MAIN APP ROUTER
// ============================================================
function AppRouter() {
  const { checkAuth, isCheckingAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-normal)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%' }} className="animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<LoginLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<DashboardPage />} />

            <Route element={<ProtectedRoute allowedRoles={['Admin', 'HR']} />}>
              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/payroll/management" element={<PayrollManagement />} />
              <Route path="/payroll/reports" element={<PayrollReports />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin', 'HR', 'Staff']} />}>
              <Route path="/profile" element={<Navigate to={user?.emp_id ? `/employees/${user.emp_id}` : '/dashboard'} replace />} />
              <Route path="/employees/:id" element={<EmployeeDetailPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave-requests" element={<LeaveRequestsPage />} />
              <Route path="/payroll/history" element={<PayrollHistory />} />
              <Route path="/payroll/detail" element={<PayrollDetail />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin', 'HR']} />}>
              <Route path="/shifts" element={<ShiftsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/departments" element={<DepartmentListPage />} />
              <Route path="/payroll/settings" element={<PayrollSettings />} />
              <Route path="/positions" element={<PositionListPage />} />
            </Route>
            <Route path="/analytics" element={<ComingSoon title="Phân tích & Báo cáo" />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;