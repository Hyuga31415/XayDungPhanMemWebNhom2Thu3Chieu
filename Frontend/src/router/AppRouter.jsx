import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginLayout from '../components/layout/LoginLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import EmployeeListPage from '../pages/Employees/EmployeeListPage';
import DepartmentListPage from '../pages/Departments/DepartmentListPage';
import AttendancePage from '../pages/Attendance/AttendancePage';
import LeaveRequestsPage from '../pages/LeaveRequests/LeaveRequestsPage';
import ShiftsPage from '../pages/Shifts/ShiftsPage';
import PayrollManagement from '../PayrollManagement';
import PayrollHistory from '../PayrollHistory';
import PayrollReports from '../PayrollReports';
import PayrollSettings from '../PayrollSettings';
import PayrollDetail from '../PayrollDetail';

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
  const payrollList = [
    { id: 'PR-001', name: 'Nguyen Van A', period: '03/2026', netSalary: 22100000, status: 'Da xac nhan' },
    { id: 'PR-002', name: 'Tran Thi B', period: '03/2026', netSalary: 19850000, status: 'Cho duyet' },
    { id: 'PR-003', name: 'Le Van C', period: '03/2026', netSalary: 24500000, status: 'Da chuyen khoan' },
  ];

  const historyItems = [
    { month: '01/2026', totalPaid: 425000000, employees: 58, status: 'Hoan thanh' },
    { month: '02/2026', totalPaid: 438000000, employees: 60, status: 'Hoan thanh' },
    { month: '03/2026', totalPaid: 452000000, employees: 61, status: 'Cho phe duyet' },
  ];

  const reportData = [
    { title: 'Tong quy luong', value: 452000000, color: 'success', trend: '+3.2%' },
    { title: 'Tong phu cap', value: 79000000, color: 'info', trend: '+1.1%' },
    { title: 'Tong khau tru', value: 25400000, color: 'warning', trend: '-0.5%' },
  ];

  const quickInsights = [
    'Ti le phe duyet bang luong dat 98%.',
    'Chi phi phu cap on dinh qua 3 ky gan nhat.',
    'Nhom van hanh khuyen nghi chuan hoa quy tac di muon.',
  ];

  const initialSalaryLevels = [
    { id: 1, level: 'Junior', monthly: 12000000 },
    { id: 2, level: 'Middle', monthly: 18000000 },
    { id: 3, level: 'Senior', monthly: 26000000 },
  ];

  const initialAllowances = [
    { id: 1, name: 'An trua', rate: '800,000 VND' },
    { id: 2, name: 'Di lai', rate: '700,000 VND' },
  ];

  const initialRules = [
    { id: 1, name: 'Di muon 1 lan', penalty: '100,000 VND' },
    { id: 2, name: 'Nghi khong phep', penalty: '300,000 VND/ngay' },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Routes (Không cần xác thực) ──────────────── */}
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ── Protected Routes (Cần xác thực) ─────────────────── */}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<MainLayout />}>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Core pages */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/departments" element={<DepartmentListPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave-requests" element={<LeaveRequestsPage />} />
            <Route path="/shifts" element={<ShiftsPage />} />

            {/* Payroll pages */}
            <Route path="/payroll/management" element={<PayrollManagement payrollList={payrollList} />} />
            <Route path="/payroll/history" element={<PayrollHistory historyItems={historyItems} />} />
            <Route path="/payroll/reports" element={<PayrollReports reportData={reportData} quickInsights={quickInsights} />} />
            <Route path="/payroll/settings" element={<PayrollSettings initialSalaryLevels={initialSalaryLevels} initialAllowances={initialAllowances} initialRules={initialRules} />} />
            <Route path="/payroll/detail" element={<PayrollDetail />} />

            {/* Placeholder routes (cho FE members khác) */}
            <Route path="/positions" element={<ComingSoon title="Quản lý chức vụ" />} />
            <Route path="/analytics" element={<ComingSoon title="Phân tích & Báo cáo" />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;