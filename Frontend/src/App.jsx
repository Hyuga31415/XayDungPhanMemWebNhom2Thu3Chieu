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
  { title: 'Tổng chi phí lương', value: 125000000, trend: '+8%', color: 'success' },
  { title: 'Số nhân viên nhận lương', value: 320, trend: '+2%', color: 'info' },
  { title: 'Phụ cấp trung bình', value: 4200000, trend: '-1.5%', color: 'warning' },
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
      <div className="bg-light text-dark">
        <header className="border-bottom bg-white shadow-sm">
          <div className="container py-4">
            <div className="row align-items-center gx-4">
              <div className="col-md">
                <p className="text-primary text-uppercase fw-semibold small mb-2">Payroll & Settings</p>
                <h1 className="h2 mb-2">Hệ thống quản lý lương</h1>
                <p className="text-muted mb-0">Giao diện HR sạch, dễ theo dõi và không rối mắt.</p>
              </div>
              <div className="col-md-auto mt-3 mt-md-0">
                <ul className="nav nav-pills flex-wrap gap-2">
                  {navItems.map((item) => (
                    <li className="nav-item" key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-5">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section className="card text-white bg-primary mb-4 shadow card-shadow">
                    <div className="card-body">
                      <div className="row align-items-center g-4">
                        <div className="col-lg-8">
                          <p className="text-uppercase fw-bold small text-white-50">Dashboard Payroll</p>
                          <h2 className="display-6 fw-bold">Quản lý lương chuyên nghiệp</h2>
                          <p className="lead text-white-75">
                            Kiểm soát nhanh số liệu nhân viên, trạng thái bảng lương và cấu hình chi tiết trong cùng một giao diện.
                          </p>
                        </div>
                        <div className="col-lg-4">
                          <div className="row row-cols-1 g-3">
                            <div className="col">
                              <div className="card bg-white bg-opacity-10 border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <p className="mb-1 text-white-50">Tổng nhân viên</p>
                                  <p className="h3 mb-0">320</p>
                                </div>
                              </div>
                            </div>
                            <div className="col">
                              <div className="card bg-white bg-opacity-10 border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <p className="mb-1 text-white-50">Bảng lương</p>
                                  <p className="h3 mb-0">23</p>
                                </div>
                              </div>
                            </div>
                            <div className="col">
                              <div className="card bg-white bg-opacity-10 border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <p className="mb-1 text-white-50">Mức lương</p>
                                  <p className="h3 mb-0">12</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="row g-4">
                    <div className="col-md-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="display-6 mb-3">💼</div>
                          <h3 className="h5 fw-bold">Lương chi tiết</h3>
                          <p className="text-muted">Xem chi tiết thu nhập, phụ cấp và khấu trừ cho từng nhân viên.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="display-6 mb-3">📊</div>
                          <h3 className="h5 fw-bold">Bảng lương HR</h3>
                          <p className="text-muted">Tra cứu nhanh trạng thái lương và tổng chi trả trong tháng.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="display-6 mb-3">⚙️</div>
                          <h3 className="h5 fw-bold">Cấu hình lương</h3>
                          <p className="text-muted">Thiết lập mức lương, phụ cấp và quy tắc chấm công chính xác.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
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
