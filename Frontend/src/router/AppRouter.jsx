import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginLayout from '../components/layout/LoginLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthLayout from '../components/layout/AuthLayout';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import EmployeeListPage from '../pages/Employees/EmployeeListPage';
import DepartmentListPage from '../pages/Departments/DepartmentListPage';
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
  const { checkAuth, isCheckingAuth } = useAuthStore();

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

  // Dữ liệu Mock tạm thời (Sau này sẽ đưa vào Store gọi API giống Nhân viên)
  const payrollList = [
    { id: 'PR-001', name: 'Nguyễn Văn A', period: '03/2026', netSalary: 22100000, status: 'Đã xác nhận' },
    { id: 'PR-002', name: 'Trần Thị B', period: '03/2026', netSalary: 19850000, status: 'Chờ duyệt' },
    { id: 'PR-003', name: 'Lê Văn C', period: '03/2026', netSalary: 24500000, status: 'Đã chuyển khoản' },
  ];

  const historyItems = [
    { month: '01/2026', totalPaid: 425000000, employees: 58, status: 'Hoàn thành' },
    { month: '02/2026', totalPaid: 438000000, employees: 60, status: 'Hoàn thành' },
    { month: '03/2026', totalPaid: 452000000, employees: 61, status: 'Chờ phê duyệt' },
  ];

  const reportData = [
    { title: 'Tổng quỹ lương', value: 452000000, color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)', trend: '+3.2%' },
    { title: 'Tổng phụ cấp', value: 79000000, color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)', trend: '+1.1%' },
    { title: 'Tổng khấu trừ', value: 25400000, color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)', trend: '-0.5%' },
  ];

  const quickInsights = [
    'Tỷ lệ phê duyệt bảng lương đạt 98%.',
    'Chi phí phụ cấp ổn định qua 3 kỳ gần nhất.',
    'Nhóm vận hành khuyến nghị chuẩn hóa quy tắc đi muộn.',
  ];

  const initialSalaryLevels = [
    { id: 1, level: 'Junior', monthly: 12000000 },
    { id: 2, level: 'Middle', monthly: 18000000 },
    { id: 3, level: 'Senior', monthly: 26000000 },
  ];

  const initialAllowances = [
    { id: 1, name: 'Ăn trưa', rate: '800,000 VND' },
    { id: 2, name: 'Đi lại', rate: '700,000 VND' },
  ];

  const initialRules = [
    { id: 1, name: 'Đi muộn 1 lần', penalty: '100,000 VND' },
    { id: 2, name: 'Nghỉ không phép', penalty: '300,000 VND/ngày' },
  ];

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
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/departments" element={<DepartmentListPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave-requests" element={<LeaveRequestsPage />} />
            <Route path="/shifts" element={<ShiftsPage />} />

            {/* Đã đồng bộ component props */}
            <Route path="/payroll/management" element={<PayrollManagement payrollList={payrollList} />} />
            <Route path="/payroll/history" element={<PayrollHistory historyItems={historyItems} />} />
            <Route path="/payroll/reports" element={<PayrollReports reportData={reportData} quickInsights={quickInsights} />} />
            <Route path="/payroll/settings" element={<PayrollSettings initialSalaryLevels={initialSalaryLevels} initialAllowances={initialAllowances} initialRules={initialRules} />} />
            <Route path="/payroll/detail" element={<PayrollDetail />} />

            <Route path="/positions" element={<ComingSoon title="Quản lý chức vụ" />} />
            <Route path="/analytics" element={<ComingSoon title="Phân tích & Báo cáo" />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;