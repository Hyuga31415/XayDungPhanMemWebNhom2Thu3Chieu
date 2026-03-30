import React from 'react';

const PayrollDetail = () => {
  const employee = {
    name: 'Nguyen Van A',
    id: 'NV-001',
    position: 'Chuyen vien nhan su',
    department: 'Payroll',
    period: 'Thang 03/2026',
    baseSalary: 18000000,
    allowances: [
      { label: 'Phu cap trach nhiem', amount: 2500000 },
      { label: 'Phu cap an trua', amount: 800000 },
      { label: 'Phu cap xang', amount: 900000 },
    ],
    deductions: [
      { label: 'Bao hiem xa hoi', amount: 900000 },
      { label: 'Thue TNCN', amount: 650000 },
      { label: 'Di muon 2 lan', amount: 150000 },
    ],
  };

  const totalAllowance = employee.allowances.reduce((sum, item) => sum + item.amount, 0);
  const totalDeduction = employee.deductions.reduce((sum, item) => sum + item.amount, 0);
  const grossSalary = employee.baseSalary + totalAllowance;
  const netSalary = grossSalary - totalDeduction;

  const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Luong ca nhan</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{employee.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Chi tiet bang luong thang, phu cap va khau tru cho nhan vien.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Ky luong</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{employee.period}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Phong ban</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{employee.department}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Chuc vu</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{employee.position}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Luong co ban</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{formatVnd(employee.baseSalary)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Tong phu cap</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">{formatVnd(totalAllowance)}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-6 text-center shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Luong thuc linh</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{formatVnd(netSalary)}</p>
            <p className="mt-2 text-sm text-slate-600">Sau khau tru bao hiem, thue va di muon.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Tong truoc khau tru</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{formatVnd(grossSalary)}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Khau tru</p>
              <p className="mt-3 text-xl font-semibold text-rose-600">{formatVnd(totalDeduction)}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="rounded-3xl bg-sky-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Tong quan nhanh</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />Phu cap duoc cong truc tiep vao luong co ban.</li>
              <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />Khau tru theo luong bao hiem va thue chuan.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Tinh nang noi bat</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>- Bao cao so lieu luong chi tiet cho tung nhan vien.</p>
              <p>- De so sanh phu cap va khoan khau tru.</p>
              <p>- Giao dien sach, doc so lieu nhanh.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Chi tiet bang luong</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Phu cap va khau tru</h2>
          </div>
          <div className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700">Du lieu cap nhat theo ky luong</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Phu cap</h3>
            <div className="mt-4 space-y-3">
              {employee.allowances.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <span className="font-medium text-slate-900">{item.label}</span>
                  <span className="text-slate-700">{formatVnd(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Khau tru</h3>
            <div className="mt-4 space-y-3">
              {employee.deductions.map((item) => (
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
