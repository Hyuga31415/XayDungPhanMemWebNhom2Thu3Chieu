import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import UserList from './UserList';
import PayrollDetail from './PayrollDetail';
import PayrollManagement from './PayrollManagement';
import PayrollSettings from './PayrollSettings';

const navItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Lương chi tiết', path: '/payroll-detail' },
  { label: 'Bảng lương HR', path: '/payroll-management' },
  { label: 'Cấu hình lương', path: '/payroll-settings' },
  { label: 'Users', path: '/users' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Payroll & Settings</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hệ thống quản lý lương</h1>
            </div>
            <nav className="flex flex-wrap items-center gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Chào mừng đến với module Payroll</h2>
                <p className="mt-4 text-slate-600">Sử dụng các menu bên trên để xem bảng lương cá nhân, báo cáo HR và chỉnh sửa các thiết lập lương/phụ cấp.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">Lương chi tiết</h3>
                    <p className="mt-2 text-slate-600">Giao diện rõ ràng, dễ đọc để hiển thị thu nhập, phụ cấp và khấu trừ.</p>
                  </article>
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">Bảng lương HR</h3>
                    <p className="mt-2 text-slate-600">Quản lý tổng quan lương, trạng thái duyệt và tìm kiếm nhanh.</p>
                  </article>
                  <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">Cấu hình hệ thống</h3>
                    <p className="mt-2 text-slate-600">Thêm mức lương, phụ cấp và quy tắc chấm công/đi muộn.</p>
                  </article>
                </div>
              </div>
            } />
            <Route path="/payroll-detail" element={<PayrollDetail />} />
            <Route path="/payroll-management" element={<PayrollManagement />} />
            <Route path="/payroll-settings" element={<PayrollSettings />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;