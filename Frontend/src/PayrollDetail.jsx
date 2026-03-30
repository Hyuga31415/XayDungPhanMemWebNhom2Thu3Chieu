import React from 'react';

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollDetail = ({ employee }) => {
  const data = employee ?? {
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

  const totalAllowance = data.allowances.reduce((sum, item) => sum + item.amount, 0);
  const totalDeduction = data.deductions.reduce((sum, item) => sum + item.amount, 0);
  const grossSalary = data.baseSalary + totalAllowance;
  const netSalary = grossSalary - totalDeduction;

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Lương cá nhân</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{data.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Chi tiết bảng lương tháng, phụ cấp và khấu trừ cho nhân viên.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Kỳ lương</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.period}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Phòng ban</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.department}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Chức vụ</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.position}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Lương cơ bản</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{formatVnd(data.baseSalary)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Tổng phụ cấp</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">{formatVnd(totalAllowance)}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-6 text-center shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Lương thực lĩnh</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{formatVnd(netSalary)}</p>
            <p className="mt-2 text-sm text-slate-600">Sau khấu trừ bảo hiểm, thuế và đi muộn.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Tổng trước khấu trừ</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{formatVnd(grossSalary)}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Khấu trừ</p>
              <p className="mt-3 text-xl font-semibold text-rose-600">{formatVnd(totalDeduction)}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="rounded-3xl bg-sky-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Tổng quan nhanh</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />Phụ cấp được cộng trực tiếp vào lương cơ bản.</li>
              <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />Khấu trừ theo lương bảo hiểm và thuế chuẩn.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Tính năng nổi bật</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>- Báo cáo số liệu lương chi tiết cho từng nhân viên.</p>
              <p>- Dễ so sánh phụ cấp và khoản khấu trừ.</p>
              <p>- Giao diện sạch, đọc số liệu nhanh.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Chi tiết bảng lương</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Phụ cấp và khấu trừ</h2>
          </div>
          <div className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700">Dữ liệu cập nhật theo kỳ lương</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Phụ cấp</h3>
            <div className="mt-4 space-y-3">
              {data.allowances.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <span className="font-medium text-slate-900">{item.label}</span>
                  <span className="text-slate-700">{formatVnd(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Khấu trừ</h3>
            <div className="mt-4 space-y-3">
              {data.deductions.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <span className="font-medium text-slate-900">{item.label}</span>
                  <span className="text-slate-700">{formatVnd(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollDetail;
