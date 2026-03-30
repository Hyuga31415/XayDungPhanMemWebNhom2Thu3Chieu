import React from 'react';

const PayrollDetail = () => {
  const employee = {
    name: 'Nguyen Van A',
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

  const totalAllowance = employee.allowances.reduce((sum, item) => sum + item.amount, 0);
  const totalDeduction = employee.deductions.reduce((sum, item) => sum + item.amount, 0);
  const netSalary = employee.baseSalary + totalAllowance - totalDeduction;

  const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">Bảng lương cá nhân</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Chi tiết lương nhân viên</h1>
            <p className="mt-2 text-sm text-slate-500">Xem tổng quan, phụ cấp, khấu trừ và lương thực lĩnh cho từng cá nhân.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Thời gian</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{employee.period}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Phòng ban</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{employee.department}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Chức vụ</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{employee.position}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Thông tin nhân viên</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Tên nhân viên</p>
              <p className="mt-2 text-lg font-medium text-slate-900">{employee.name}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Mã nhân viên</p>
              <p className="mt-2 text-lg font-medium text-slate-900">{employee.id}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tổng quan thu nhập</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Lương cơ bản</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatVnd(employee.baseSalary)}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Lương thực lĩnh</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatVnd(netSalary)}</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Ghi chú quan trọng</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>– Phụ cấp tính theo hệ số hiện hành.</li>
              <li>– Khấu trừ bảo hiểm và thuế tự động theo quy định.</li>
              <li>– Các lần đi muộn, vắng trừ trực tiếp vào thu nhập.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-sky-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Tổng thu nhập</h3>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{formatVnd(employee.baseSalary + totalAllowance)}</p>
            <p className="mt-2 text-sm text-slate-600">Bao gồm phụ cấp và lương cơ bản.</p>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Phụ cấp</h2>
            <p className="text-sm text-slate-500">Tổng: {formatVnd(totalAllowance)}</p>
          </div>
          <div className="mt-6 space-y-3">
            {employee.allowances.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">{formatVnd(item.amount)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Khấu trừ</h2>
            <p className="text-sm text-slate-500">Tổng: {formatVnd(totalDeduction)}</p>
          </div>
          <div className="mt-6 space-y-3">
            {employee.deductions.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">{item.label}</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">{formatVnd(item.amount)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PayrollDetail;
