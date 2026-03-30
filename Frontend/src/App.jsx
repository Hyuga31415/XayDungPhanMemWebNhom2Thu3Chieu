import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import UserList from './UserList';
import PayrollDetail from './PayrollDetail';
import PayrollManagement from './PayrollManagement';
import PayrollSettings from './PayrollSettings';
import PayrollHistory from './PayrollHistory';
import PayrollReports from './PayrollReports';

const navItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Lương chi tiết', path: '/payroll-detail' },
  { label: 'Bảng lương HR', path: '/payroll-management' },
  { label: 'Lịch sử lương', path: '/payroll-history' },
  { label: 'Báo cáo', path: '/payroll-reports' },
  { label: 'Cấu hình lương', path: '/payroll-settings' },
  { label: 'Users', path: '/users' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Payroll & Settings</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hệ thống quản lý lương</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Giao diện HR chuyên nghiệp, rõ ràng và dễ theo dõi số liệu lương nhân viên.</p>
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
            <Route
              path="/"
              element={
                <div className="grid gap-6">
                  <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-600 to-cyan-500 p-8 text-white shadow-lg shadow-sky-200/20">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/80">Payroll dashboard</p>
                        <h2 className="mt-3 text-3xl font-semibold">Quản lý lương trực quan cho HR</h2>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/90">
                          Kiểm soát nhanh số liệu nhân viên, trạng thái bảng lương và cấu hình chi tiết trong cùng một giao diện.
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-sm">
                          <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/80">Tổng nhân viên</p>
                          <p className="mt-3 text-3xl font-semibold">320</p>
                        </div>
                        <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-sm">
                          <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/80">Bảng lương</p>
                          <p className="mt-3 text-3xl font-semibold">23</p>
                        </div>
                        <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-sm">
                          <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/80">Mức lương</p>
                          <p className="mt-3 text-3xl font-semibold">12</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="grid gap-6 lg:grid-cols-3">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-900">Lương chi tiết</h3>
                      <p className="mt-2 text-sm text-slate-600">Xem chi tiết thu nhập, phụ cấp và khấu trừ cho từng nhân viên.</p>
                    </article>
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-900">Bảng lương HR</h3>
                      <p className="mt-2 text-sm text-slate-600">Tra cứu nhanh trạng thái lương và tổng chi trả trong tháng.</p>
                    </article>
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-900">Cấu hình lương</h3>
                      <p className="mt-2 text-sm text-slate-600">Thiết lập mức lương, phụ cấp và quy tắc chấm công chính xác.</p>
                    </article>
                  </section>
                </div>
              }
            />
            <Route path="/payroll-detail" element={<PayrollDetail />} />
            <Route path="/payroll-management" element={<PayrollManagement />} />
            <Route path="/payroll-history" element={<PayrollHistory />} />
            <Route path="/payroll-reports" element={<PayrollReports />} />
            <Route path="/payroll-settings" element={<PayrollSettings />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
