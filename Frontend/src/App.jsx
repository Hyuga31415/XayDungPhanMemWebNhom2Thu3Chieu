import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import UserList from './UserList';
import PayrollDetail from './PayrollDetail';
import PayrollManagement from './PayrollManagement';
import PayrollSettings from './PayrollSettings';
import PayrollHistory from './PayrollHistory';
import PayrollReports from './PayrollReports';

const employeeData = {
  name: 'Nguyễn Văn A',
  id: 'NV-001',
  position: 'Chuyên viên nhân sự',
  department: 'Payroll',
  period: 'Tháng 03/2026',
  baseSalary: 18000000,
  allowances: [
    { label: 'Phụ cấp trách nhiệm', amount: 2500000 },
    { label: 'Phụ cấp ăn trưa', amount: 800000 },
    { label: 'Phụ cấp xăng', amount: 900000 },
  ],
  deductions: [
    { label: 'Bảo hiểm xã hội', amount: 900000 },
    { label: 'Thuế TNCN', amount: 650000 },
    { label: 'Đi muộn 2 lần', amount: 150000 },
  ],
};

const payrollList = [
  {
    id: 'NV-001',
    name: 'Nguyễn Văn A',
    period: '03/2026',
    netSalary: 21500000,
    status: 'Đã xác nhận',
  },
  {
    id: 'NV-002',
    name: 'Trần Thị B',
    period: '03/2026',
    netSalary: 19800000,
    status: 'Chờ duyệt',
  },
  {
    id: 'NV-003',
    name: 'Lê Văn C',
    period: '03/2026',
    netSalary: 22500000,
    status: 'Đã chuyển khoản',
  },
];

const historyItems = [
  { month: '02/2026', status: 'Hoàn thành', totalPaid: 19800000, employees: 23 },
  { month: '01/2026', status: 'Hoàn thành', totalPaid: 21000000, employees: 22 },
  { month: '12/2025', status: 'Chờ phê duyệt', totalPaid: 20500000, employees: 24 },
  { month: '11/2025', status: 'Hoàn thành', totalPaid: 19350000, employees: 21 },
];

const reportData = [
  { title: 'Tổng chi phí lương', value: 125000000, trend: '+8%', color: 'text-emerald-700' },
  { title: 'Số nhân viên nhận lương', value: 320, trend: '+2%', color: 'text-sky-700' },
  { title: 'Phụ cấp trung bình', value: 4200000, trend: '-1.5%', color: 'text-amber-700' },
];

const quickInsights = [
  'Lương tháng này tăng 8% so với tháng trước.',
  'Tỷ lệ phê duyệt bảng lương vượt 90%.',
  'Phụ cấp trách nhiệm là mục chi lớn nhất.',
];

const initialSalaryLevels = [
  { id: 1, level: 'Junior', monthly: 10000000 },
  { id: 2, level: 'Senior', monthly: 18000000 },
  { id: 3, level: 'Lead', monthly: 24000000 },
];

const initialAllowances = [
  { id: 1, name: 'Phụ cấp trách nhiệm', rate: '15%' },
  { id: 2, name: 'Phụ cấp xăng', rate: '5%' },
  { id: 3, name: 'Phụ cấp ăn trưa', rate: '3%' },
];

const initialRules = [
  { id: 1, name: 'Đi muộn 1 lần', penalty: '100,000 VND' },
  { id: 2, name: 'Vắng không phép', penalty: '500,000 VND' },
  { id: 3, name: 'Quá 2 ngày phép', penalty: '200,000 VND/ngày' },
];

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
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Payroll & Settings</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hệ thống quản lý lương</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Giao diện HR sạch, dễ theo dõi và không rối mắt.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
                      <div className="stats stats-vertical gap-4 rounded-[1.5rem] bg-white/10 p-4 text-white shadow-sm sm:stats-horizontal lg:stats-horizontal">
                        <div className="stat rounded-3xl bg-white/10 p-5 shadow-sm">
                          <div className="stat-title text-cyan-100/80">Tổng nhân viên</div>
                          <div className="stat-value text-3xl">320</div>
                        </div>
                        <div className="stat rounded-3xl bg-white/10 p-5 shadow-sm">
                          <div className="stat-title text-cyan-100/80">Bảng lương</div>
                          <div className="stat-value text-3xl">23</div>
                        </div>
                        <div className="stat rounded-3xl bg-white/10 p-5 shadow-sm">
                          <div className="stat-title text-cyan-100/80">Mức lương</div>
                          <div className="stat-value text-3xl">12</div>
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
            <Route path="/payroll-detail" element={<PayrollDetail employee={employeeData} />} />
            <Route path="/payroll-management" element={<PayrollManagement payrollList={payrollList} />} />
            <Route path="/payroll-history" element={<PayrollHistory historyItems={historyItems} />} />
            <Route path="/payroll-reports" element={<PayrollReports reportData={reportData} quickInsights={quickInsights} />} />
            <Route path="/payroll-settings" element={<PayrollSettings initialSalaryLevels={initialSalaryLevels} initialAllowances={initialAllowances} initialRules={initialRules} />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
