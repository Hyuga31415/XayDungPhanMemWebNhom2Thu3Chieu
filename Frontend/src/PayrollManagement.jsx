import React, { useMemo, useState } from 'react';

const payrollList = [
  {
    id: 'NV-001',
    name: 'Nguyen Van A',
    period: '03/2026',
    netSalary: 21500000,
    status: 'Da xac nhan',
    base: 18000000,
    allowance: 4200000,
    deduction: 500000,
  },
  {
    id: 'NV-002',
    name: 'Tran Thi B',
    period: '03/2026',
    netSalary: 19800000,
    status: 'Cho duyet',
    base: 17500000,
    allowance: 3300000,
    deduction: 500000,
  },
  {
    id: 'NV-003',
    name: 'Le Van C',
    period: '03/2026',
    netSalary: 22500000,
    status: 'Da chuyen khoan',
    base: 18500000,
    allowance: 4500000,
    deduction: 500000,
  },
];

const statusStyles = {
  'Da xac nhan': 'bg-emerald-100 text-emerald-800',
  'Cho duyet': 'bg-amber-100 text-amber-800',
  'Da chuyen khoan': 'bg-sky-100 text-sky-800',
};

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollManagement = () => {
  const [query, setQuery] = useState('');

  const filteredPayrolls = useMemo(() => {
    return payrollList.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase()) ||
      item.period.includes(query)
    );
  }, [query]);

  const totalPayroll = payrollList.reduce((sum, item) => sum + item.netSalary, 0);
  const approvedCount = payrollList.filter((item) => item.status === 'Da xac nhan' || item.status === 'Da chuyen khoan').length;

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Bang luong HR</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Tong quan luong</h1>
            <p className="mt-2 text-sm text-slate-600">Cap nhat nhanh trang thai duyet, tong chi tra va so luong bang luong.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Bang luong</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{payrollList.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Da duyet</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">{approvedCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Tong chi tra</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{formatVnd(totalPayroll)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Danh sach bang luong</h2>
            <p className="mt-2 text-sm text-slate-500">Tim kiem va theo doi trang thai chi tiet.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">🔍</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tim kiem ma hoac ten..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Ma</th>
                <th className="px-4 py-3">Nhan vien</th>
                <th className="px-4 py-3">Ky luong</th>
                <th className="px-4 py-3">Thuc linh</th>
                <th className="px-4 py-3">Trang thai</th>
                <th className="px-4 py-3">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredPayrolls.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-slate-50' : ''}>
                  <td className="px-4 py-4 font-medium text-slate-900">{item.id}</td>
                  <td className="px-4 py-4">{item.name}</td>
                  <td className="px-4 py-4">{item.period}</td>
                  <td className="px-4 py-4">{formatVnd(item.netSalary)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status] || 'bg-slate-100 text-slate-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
                      Xem chi tiet
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayrolls.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan="6">Khong tim thay du lieu phu hop.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PayrollManagement;
