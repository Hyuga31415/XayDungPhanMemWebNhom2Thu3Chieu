import React, { useMemo, useState } from 'react';

const payrollList = [
  {
    id: 'NV-001',
    name: 'Nguyen Van A',
    period: '03/2026',
    netSalary: 21500000,
    status: 'Đã xác nhận',
    base: 18000000,
    allowance: 4200000,
    deduction: 500000,
  },
  {
    id: 'NV-002',
    name: 'Tran Thi B',
    period: '03/2026',
    netSalary: 19800000,
    status: 'Chờ duyệt',
    base: 17500000,
    allowance: 3300000,
    deduction: 500000,
  },
  {
    id: 'NV-003',
    name: 'Le Van C',
    period: '03/2026',
    netSalary: 22500000,
    status: 'Đã chuyển khoản',
    base: 18500000,
    allowance: 4500000,
    deduction: 500000,
  },
];

const statusStyles = {
  'Đã xác nhận': 'bg-emerald-100 text-emerald-800',
  'Chờ duyệt': 'bg-amber-100 text-amber-800',
  'Đã chuyển khoản': 'bg-sky-100 text-sky-800',
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
  const approvedCount = payrollList.filter((item) => item.status === 'Đã xác nhận' || item.status === 'Đã chuyển khoản').length;

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Quản lý bảng lương tổng</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bảng lương HR</h1>
            <p className="mt-2 text-sm text-slate-600">Tổng hợp nhanh trạng thái lương của nhân viên và số liệu quản lý.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Tổng số nhân viên</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{payrollList.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Lương đã phê duyệt</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{approvedCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">Tổng chi trả</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{formatVnd(totalPayroll)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Danh sách bảng lương</h2>
            <p className="mt-2 text-sm text-slate-500">Tìm nhanh theo tên, mã nhân viên hoặc kỳ lương.</p>
          </div>
          <div className="w-full max-w-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Nhân viên</th>
                <th className="px-4 py-3">Kỳ lương</th>
                <th className="px-4 py-3">Thực lĩnh</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredPayrolls.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
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
                    <button className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayrolls.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan="6">Không tìm thấy dữ liệu phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
